import importlib.util
import json
import os
import sys
from types import SimpleNamespace
from pathlib import Path

import pytest
from botocore.exceptions import ClientError

ROOT = Path(__file__).parents[1]
sys.path.insert(0, str(ROOT / "spotify"))
os.environ.setdefault("AWS_DEFAULT_REGION", "us-east-1")
os.environ.setdefault("AWS_ACCESS_KEY_ID", "test")
os.environ.setdefault("AWS_SECRET_ACCESS_KEY", "test")
import spotify_app

BOOTSTRAP_PATH = ROOT.parent / "scripts" / "connect-spotify.py"
spec = importlib.util.spec_from_file_location("connect_spotify", BOOTSTRAP_PATH)
connect_spotify = importlib.util.module_from_spec(spec)
spec.loader.exec_module(connect_spotify)


class FakeSsm:
    def __init__(self, value=None):
        self.value = value
        self.writes = []

    def get_parameter(self, **_kwargs):
        if self.value is None:
            raise ClientError({"Error": {"Code": "ParameterNotFound", "Message": "missing"}}, "GetParameter")
        return {"Parameter": {"Value": self.value}}

    def put_parameter(self, **kwargs):
        self.writes.append(kwargs)
        self.value = kwargs["Value"]


@pytest.fixture(autouse=True)
def reset_module_state(monkeypatch):
    monkeypatch.setattr(spotify_app, "_access_token", None)
    monkeypatch.setattr(spotify_app, "_access_token_expires_at", 0)
    monkeypatch.setattr(spotify_app, "_response_cache", None)
    monkeypatch.setattr(spotify_app, "_rate_limited_until", 0)


def response_body(response):
    return json.loads(response["body"])


def test_currently_playing_returns_only_safe_track_metadata(monkeypatch):
    monkeypatch.setattr(spotify_app, "_token", lambda force_refresh=False: "temporary-token")
    monkeypatch.setattr(
        spotify_app,
        "_request",
        lambda url, **_kwargs: (
            200,
            {},
            {
                "is_playing": True,
                "device": {"id": "private-device"},
                "item": {
                    "type": "track",
                    "id": "0123456789012345678901",
                    "name": "Harvest Moon",
                    "artists": [{"name": "Neil Young"}],
                    "album": {"images": [{"url": "https://i.scdn.co/image/ab67616d0000b2731234567890abcdef"}]},
                },
            },
        ),
    )
    result = spotify_app._now_playing()
    assert result == {
        "playing": True,
        "title": "Harvest Moon",
        "artist": "Neil Young",
        "url": "https://open.spotify.com/track/0123456789012345678901",
        "art": "https://i.scdn.co/image/ab67616d0000b2731234567890abcdef",
    }


def test_empty_current_playback_falls_back_to_recent_track_as_stopped(monkeypatch):
    monkeypatch.setattr(spotify_app, "_token", lambda force_refresh=False: "temporary-token")
    calls = []

    def request(url, **_kwargs):
        calls.append(url)
        if url.endswith("currently-playing"):
            return 204, {}, None
        return 200, {}, {
            "items": [{"track": {"type": "track", "id": "0123456789012345678901", "name": "Harvest Moon", "artists": [{"name": "Neil Young"}], "album": {"images": [{"url": "https://i.scdn.co/image/abc123"}]}}}]
        }

    monkeypatch.setattr(spotify_app, "_request", request)
    assert spotify_app._now_playing() == {
        "playing": False,
        "title": "Harvest Moon",
        "artist": "Neil Young",
        "url": "https://open.spotify.com/track/0123456789012345678901",
        "art": "https://i.scdn.co/image/abc123",
    }
    assert calls == [
        "https://api.spotify.com/v1/me/player/currently-playing",
        "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    ]


def test_malformed_recent_history_returns_empty_stopped_state(monkeypatch):
    monkeypatch.setattr(spotify_app, "_token", lambda force_refresh=False: "temporary-token")
    monkeypatch.setattr(
        spotify_app,
        "_request",
        lambda url, **_kwargs: (204, {}, None) if url.endswith("currently-playing") else (200, {}, {"items": [None]}),
    )
    assert spotify_app._now_playing() == {"playing": False, "title": None, "artist": None, "url": None, "art": None}


@pytest.mark.parametrize(
    "images",
    [
        None,
        "not-an-image-list",
        [None, {"url": 42}, {"url": "https://example.com/image/abc"}],
        [{"url": "http://i.scdn.co/image/abc"}],
        [{"url": "https://user@i.scdn.co/image/abc"}],
        [{"url": "https://i.scdn.co:443/image/abc"}],
        [{"url": "https://i.scdn.co.evil.example/image/abc"}],
        [{"url": "https://i.scdn.co/other/abc"}],
        [{"url": "https://i.scdn.co/image/abc-def"}],
        [{"url": "https://i.scdn.co/image/abc?width=640"}],
        [{"url": "https://i.scdn.co/image/abc#fragment"}],
        [{"url": "https://[invalid/image/abc"}],
    ],
)
def test_malformed_or_untrusted_album_art_is_omitted(images):
    assert spotify_app._track(
        {"type": "track", "name": "Track", "album": {"images": images}}, True
    )["art"] is None


def test_album_art_uses_first_valid_spotify_image():
    expected = "https://i.scdn.co/image/valid123"
    assert spotify_app._track(
        {
            "type": "track",
            "name": "Track",
            "album": {"images": [{"url": "https://example.com/image/nope"}, {"url": expected}, {"url": "https://i.scdn.co/image/later"}]},
        },
        True,
    )["art"] == expected


def test_successful_response_cache_avoids_repeat_upstream_calls(monkeypatch):
    monkeypatch.setattr(spotify_app, "_token", lambda force_refresh=False: "temporary-token")
    calls = []

    def request(_url, **_kwargs):
        calls.append(1)
        return 200, {}, {
            "is_playing": True,
            "item": {"type": "track", "name": "Harvest Moon", "artists": [{"name": "Neil Young"}]},
        }

    monkeypatch.setattr(spotify_app, "_request", request)
    first = spotify_app.handler({}, None)
    second = spotify_app.handler({}, None)
    assert response_body(first) == response_body(second)
    assert first["headers"]["cache-control"] == "public, max-age=30"
    assert len(calls) == 1


def test_expired_playing_cache_does_not_survive_failed_refresh(monkeypatch):
    monkeypatch.setattr(spotify_app, "_token", lambda force_refresh=False: "temporary-token")
    now = [100.0]
    monkeypatch.setattr(spotify_app.time, "time", lambda: now[0])
    monkeypatch.setattr(
        spotify_app,
        "_request",
        lambda *_args, **_kwargs: (
            200,
            {},
            {"is_playing": True, "item": {"type": "track", "name": "Harvest Moon", "artists": [{"name": "Neil Young"}]}},
        ),
    )
    playing = spotify_app.handler({}, None)
    assert response_body(playing)["playing"] is True

    now[0] += 31

    def unavailable(*_args, **_kwargs):
        raise spotify_app.SpotifyUnavailable

    monkeypatch.setattr(spotify_app, "_request", unavailable)
    stopped = spotify_app.handler({}, None)
    assert stopped["statusCode"] == 503
    assert stopped["headers"]["cache-control"] == "no-store"
    assert response_body(stopped) == {"playing": False, "title": None, "artist": None, "url": None, "art": None}


def test_missing_parameter_returns_safe_unavailable_response(monkeypatch):
    monkeypatch.setattr(spotify_app, "ssm", FakeSsm())
    response = spotify_app.handler({}, None)
    assert response["statusCode"] == 503
    assert response["headers"]["cache-control"] == "no-store"
    assert response_body(response) == {"playing": False, "title": None, "artist": None, "url": None, "art": None}


def test_non_object_credentials_return_unavailable(monkeypatch):
    monkeypatch.setattr(spotify_app, "ssm", FakeSsm("[]"))
    response = spotify_app.handler({}, None)
    assert response["statusCode"] == 503
    assert response_body(response) == {"playing": False, "title": None, "artist": None, "url": None, "art": None}


def test_invalid_token_expiry_returns_unavailable(monkeypatch):
    monkeypatch.setattr(spotify_app, "ssm", FakeSsm(json.dumps({"client_id": "client", "refresh_token": "refresh"})))
    monkeypatch.setattr(
        spotify_app,
        "_request",
        lambda *_args, **_kwargs: (200, {}, {"access_token": "access", "expires_in": "invalid"}),
    )
    response = spotify_app.handler({}, None)
    assert response["statusCode"] == 503
    assert response_body(response) == {"playing": False, "title": None, "artist": None, "url": None, "art": None}


def test_rotated_refresh_token_is_replaced_as_standard_secure_string(monkeypatch):
    credentials = {"client_id": "public-client-id", "refresh_token": "old-refresh-token"}
    ssm = FakeSsm(json.dumps(credentials))
    monkeypatch.setattr(spotify_app, "ssm", ssm)
    monkeypatch.setattr(
        spotify_app,
        "_request",
        lambda *_args, **_kwargs: (200, {}, {"access_token": "access", "refresh_token": "new-refresh-token", "expires_in": 3600}),
    )
    assert spotify_app._refresh_access_token() == "access"
    assert json.loads(ssm.writes[0]["Value"]) == {
        "client_id": "public-client-id",
        "refresh_token": "new-refresh-token",
    }
    assert ssm.writes[0]["Type"] == "SecureString"
    assert ssm.writes[0]["Tier"] == "Standard"
    assert ssm.writes[0]["Overwrite"] is True


def test_spotify_401_refreshes_access_token_once(monkeypatch):
    ssm = FakeSsm(json.dumps({"client_id": "client", "refresh_token": "refresh"}))
    monkeypatch.setattr(spotify_app, "ssm", ssm)
    spotify_calls = []

    def request(url, **_kwargs):
        if url == spotify_app.TOKEN_URL:
            return 200, {}, {"access_token": f"access-{len(spotify_calls)}", "expires_in": 3600}
        spotify_calls.append(url)
        if len(spotify_calls) == 1:
            return 401, {}, None
        return 204, {}, None

    monkeypatch.setattr(spotify_app, "_request", request)
    assert spotify_app._spotify_get("/me/player/currently-playing")[0] == 204
    assert len(spotify_calls) == 2


def test_rate_limit_cooldown_blocks_next_handler_without_upstream_call(monkeypatch):
    monkeypatch.setattr(spotify_app, "_access_token", "valid-access")
    monkeypatch.setattr(spotify_app, "_access_token_expires_at", 9_999_999_999)
    calls = []

    def request(url, **_kwargs):
        calls.append(url)
        return 429, {"Retry-After": "30"}, None

    monkeypatch.setattr(spotify_app, "_request", request)
    first = spotify_app.handler({}, None)
    second = spotify_app.handler({}, None)
    assert first["statusCode"] == second["statusCode"] == 503
    assert first["headers"]["retry-after"] == "30"
    assert second["headers"]["retry-after"] == "30"
    assert response_body(first) == response_body(second) == {"playing": False, "title": None, "artist": None, "url": None, "art": None}
    assert len(calls) == 1


def test_pkce_pair_and_authorization_url_use_required_read_scopes():
    verifier, challenge = connect_spotify.make_pkce_pair()
    expected = connect_spotify._base64url(__import__("hashlib").sha256(verifier.encode()).digest())
    assert challenge == expected
    url = connect_spotify.make_authorization_url("client-id", "state-value", challenge)
    assert "user-read-currently-playing+user-read-recently-played" in url
    assert "client_secret" not in url
    assert "http%3A%2F%2F127.0.0.1%3A8888%2Fcallback" in url


@pytest.mark.parametrize(
    "target,expected",
    [
        ("/callback?code=auth-code&state=expected", ("auth-code", None)),
        ("/callback?code=auth-code&state=wrong", (None, "state mismatch")),
        ("/callback?error=access_denied&state=expected", (None, "Spotify authorization was declined")),
        ("/elsewhere?code=auth-code&state=expected", (None, "unexpected callback path")),
    ],
)
def test_callback_requires_valid_state_and_callback_path(target, expected):
    assert connect_spotify.callback_result(target, "expected") == expected


def test_callback_ignores_favicon_and_rejects_bad_state_without_consuming_signin():
    server = SimpleNamespace(expected_state="expected", result=None)
    assert connect_spotify.accept_callback(server, "/favicon.ico") == 404
    assert server.result is None
    assert connect_spotify.accept_callback(server, "/callback?code=bad&state=wrong") == 400
    assert server.result is None
    assert connect_spotify.accept_callback(server, "/callback?code=good&state=expected") == 200
    assert server.result == ("good", None)
