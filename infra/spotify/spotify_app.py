"""Read-only Spotify now-playing endpoint."""

import json
import logging
import re
import time
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, urlsplit
from urllib.request import Request, urlopen

import boto3
from botocore.config import Config
from botocore.exceptions import BotoCoreError, ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

PARAMETER_NAME = "/lance-portfolio/spotify/credentials"
SPOTIFY_API = "https://api.spotify.com/v1"
TOKEN_URL = "https://accounts.spotify.com/api/token"
REQUEST_TIMEOUT = 1.5
CACHE_SECONDS = 30
TRACK_ID = re.compile(r"^[A-Za-z0-9]{22}$")
SPOTIFY_ART_PATH = re.compile(r"^/image/[A-Za-z0-9]+$")

ssm = boto3.client(
    "ssm",
    config=Config(connect_timeout=1, read_timeout=2, retries={"max_attempts": 1}),
)
_access_token: str | None = None
_access_token_expires_at = 0.0
_response_cache: tuple[float, dict[str, Any]] | None = None
_rate_limited_until = 0.0


class SpotifyUnavailable(Exception):
    """A safe, non-diagnostic failure for the public endpoint."""

    def __init__(self, retry_after: int | None = None):
        super().__init__()
        self.retry_after = retry_after


def _activate_rate_limit(headers: Any) -> int:
    global _rate_limited_until
    value = headers.get("Retry-After", "") if headers else ""
    try:
        delay = max(1.0, float(value))
    except (TypeError, ValueError):
        delay = 1.0
    _rate_limited_until = max(_rate_limited_until, time.time() + delay)
    return max(1, int(_rate_limited_until - time.time() + 0.999))


def _check_rate_limit() -> None:
    delay = _rate_limited_until - time.time()
    if delay > 0:
        raise SpotifyUnavailable(max(1, int(delay + 0.999)))


def _response(status: int, payload: dict[str, Any], cache_control: str) -> dict[str, Any]:
    return {
        "statusCode": status,
        "headers": {
            "content-type": "application/json",
            "cache-control": cache_control,
        },
        "body": json.dumps(payload),
    }


def _empty_track() -> dict[str, Any]:
    return {"playing": False, "title": None, "artist": None, "url": None, "art": None}


def _album_art(item: dict[str, Any]) -> str | None:
    album = item.get("album")
    images = album.get("images") if isinstance(album, dict) else None
    if not isinstance(images, list):
        return None
    for image in images:
        candidate = image.get("url") if isinstance(image, dict) else None
        if not isinstance(candidate, str):
            continue
        try:
            parsed = urlsplit(candidate)
            if (
                parsed.scheme.lower() == "https"
                and parsed.hostname == "i.scdn.co"
                and parsed.username is None
                and parsed.password is None
                and parsed.port is None
                and parsed.netloc.lower() == "i.scdn.co"
                and not parsed.query
                and not parsed.fragment
                and SPOTIFY_ART_PATH.fullmatch(parsed.path)
            ):
                return candidate
        except ValueError:
            continue
    return None


def _request(url: str, *, method: str = "GET", headers=None, data=None):
    request = Request(url, data=data, headers=headers or {}, method=method)
    try:
        with urlopen(request, timeout=REQUEST_TIMEOUT) as result:
            content = result.read()
            return result.status, result.headers, json.loads(content) if content else None
    except HTTPError as error:
        content = error.read()
        try:
            body = json.loads(content) if content else None
        except (json.JSONDecodeError, UnicodeDecodeError):
            body = None
        return error.code, error.headers, body
    except (URLError, TimeoutError, OSError, json.JSONDecodeError) as error:
        raise SpotifyUnavailable from error


def _load_credentials() -> dict[str, str]:
    try:
        value = ssm.get_parameter(Name=PARAMETER_NAME, WithDecryption=True)["Parameter"]["Value"]
        credentials = json.loads(value)
        if not isinstance(credentials, dict):
            raise SpotifyUnavailable
        if not all(isinstance(credentials.get(key), str) and credentials[key] for key in ("client_id", "refresh_token")):
            raise SpotifyUnavailable
        return credentials
    except (BotoCoreError, ClientError, AttributeError, KeyError, TypeError, ValueError) as error:
        raise SpotifyUnavailable from error


def _save_credentials(credentials: dict[str, str]) -> None:
    try:
        ssm.put_parameter(
            Name=PARAMETER_NAME,
            Value=json.dumps(credentials),
            Type="SecureString",
            Tier="Standard",
            Overwrite=True,
        )
    except (BotoCoreError, ClientError) as error:
        raise SpotifyUnavailable from error


def _refresh_access_token() -> str:
    global _access_token, _access_token_expires_at
    _check_rate_limit()
    credentials = _load_credentials()
    status, headers, body = _request(
        TOKEN_URL,
        method="POST",
        headers={"content-type": "application/x-www-form-urlencoded"},
        data=urlencode(
            {
                "client_id": credentials["client_id"],
                "grant_type": "refresh_token",
                "refresh_token": credentials["refresh_token"],
            }
        ).encode(),
    )
    if status == 429:
        raise SpotifyUnavailable(_activate_rate_limit(headers))
    if status != 200 or not isinstance(body, dict) or not isinstance(body.get("access_token"), str) or not body["access_token"]:
        raise SpotifyUnavailable

    replacement = body.get("refresh_token")
    if isinstance(replacement, str) and replacement and replacement != credentials["refresh_token"]:
        credentials["refresh_token"] = replacement
        _save_credentials(credentials)

    try:
        expires_in = int(body.get("expires_in", 3600))
    except (TypeError, ValueError, OverflowError) as error:
        raise SpotifyUnavailable from error
    _access_token = body["access_token"]
    _access_token_expires_at = time.time() + max(0, expires_in - 60)
    return _access_token


def _token(force_refresh: bool = False) -> str:
    if not force_refresh and _access_token and time.time() < _access_token_expires_at:
        return _access_token
    return _refresh_access_token()


def _spotify_get(path: str) -> tuple[int, Any, Any]:
    global _access_token, _access_token_expires_at
    retried_401 = False
    while True:
        _check_rate_limit()
        token = _token()
        status, headers, body = _request(
            f"{SPOTIFY_API}{path}", headers={"authorization": f"Bearer {token}"}
        )
        if status == 401 and not retried_401:
            _access_token = None
            _access_token_expires_at = 0
            retried_401 = True
            continue
        if status == 429:
            raise SpotifyUnavailable(_activate_rate_limit(headers))
        if status >= 500 or status in (401, 429) or status < 200 or status >= 300:
            raise SpotifyUnavailable
        return status, headers, body


def _track(item: Any, playing: bool) -> dict[str, Any]:
    if not isinstance(item, dict) or item.get("type") != "track":
        return _empty_track()
    title = item.get("name") if isinstance(item.get("name"), str) else None
    artists = item.get("artists")
    artist = None
    if isinstance(artists, list):
        names = [entry.get("name") for entry in artists if isinstance(entry, dict) and isinstance(entry.get("name"), str)]
        artist = ", ".join(names) or None
    track_id = item.get("id")
    url = f"https://open.spotify.com/track/{track_id}" if isinstance(track_id, str) and TRACK_ID.fullmatch(track_id) else None
    if title is None and artist is None:
        return _empty_track()
    return {"playing": playing, "title": title, "artist": artist, "url": url, "art": _album_art(item)}


def _now_playing() -> dict[str, Any]:
    status, _, current = _spotify_get("/me/player/currently-playing")
    is_playing = status == 200 and isinstance(current, dict) and current.get("is_playing") is True
    if is_playing:
        result = _track(current.get("item"), True)
        if result["title"] or result["artist"]:
            return result

    _, _, recent = _spotify_get("/me/player/recently-played?limit=1")
    items = recent.get("items") if isinstance(recent, dict) else None
    if isinstance(items, list) and items:
        if isinstance(items[0], dict):
            return _track(items[0].get("track"), False)
    return _empty_track()


def handler(_event: dict[str, Any], _context: Any) -> dict[str, Any]:
    global _response_cache
    now = time.time()
    if _response_cache and now < _response_cache[0]:
        return _response(200, _response_cache[1], "public, max-age=30")
    try:
        result = _now_playing()
    except SpotifyUnavailable as error:
        logger.warning("Spotify now-playing request unavailable")
        response = _response(503, _empty_track(), "no-store")
        if error.retry_after is not None:
            response["headers"]["retry-after"] = str(error.retry_after)
        return response
    _response_cache = (time.time() + CACHE_SECONDS, result)
    return _response(200, result, "public, max-age=30")
