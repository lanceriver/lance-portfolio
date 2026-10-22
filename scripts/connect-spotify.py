#!/usr/bin/env python3
"""Authorize this portfolio's read-only Spotify now-playing integration."""

import argparse
import base64
import hashlib
import hmac
import json
import secrets
import sys
import time
import webbrowser
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlencode, urlsplit
from urllib.request import Request, urlopen

import boto3

REDIRECT_URI = "http://127.0.0.1:8888/callback"
AUTH_URL = "https://accounts.spotify.com/authorize"
TOKEN_URL = "https://accounts.spotify.com/api/token"
PARAMETER_NAME = "/lance-portfolio/spotify/credentials"
SCOPES = "user-read-currently-playing user-read-recently-played"
TIMEOUT_SECONDS = 300


def _base64url(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def make_pkce_pair() -> tuple[str, str]:
    verifier = _base64url(secrets.token_bytes(64))
    challenge = _base64url(hashlib.sha256(verifier.encode("ascii")).digest())
    return verifier, challenge


def make_authorization_url(client_id: str, state: str, challenge: str) -> str:
    return AUTH_URL + "?" + urlencode(
        {
            "client_id": client_id,
            "response_type": "code",
            "redirect_uri": REDIRECT_URI,
            "scope": SCOPES,
            "state": state,
            "code_challenge_method": "S256",
            "code_challenge": challenge,
        }
    )


def callback_result(target: str, expected_state: str) -> tuple[str | None, str | None]:
    parsed = urlsplit(target)
    if parsed.path != "/callback":
        return None, "unexpected callback path"
    values = parse_qs(parsed.query, keep_blank_values=True)
    states = values.get("state", [])
    if len(states) != 1 or not hmac.compare_digest(states[0], expected_state):
        return None, "state mismatch"
    if values.get("error"):
        return None, "Spotify authorization was declined"
    codes = values.get("code", [])
    if len(codes) != 1 or not codes[0]:
        return None, "authorization code missing"
    return codes[0], None


def accept_callback(server, target: str) -> int:
    """Record only a valid OAuth response; ignore unrelated or forged requests."""
    if urlsplit(target).path != "/callback":
        return 404
    result = callback_result(target, server.expected_state)
    code, error = result
    if code or error == "Spotify authorization was declined":
        server.result = result
    return 200 if code else 400


class _CallbackServer(HTTPServer):
    def __init__(self, expected_state: str):
        self.expected_state = expected_state
        self.result: tuple[str | None, str | None] | None = None
        super().__init__(("127.0.0.1", 8888), _CallbackHandler)
        self.timeout = 1


class _CallbackHandler(BaseHTTPRequestHandler):
    def do_GET(self):  # noqa: N802 - BaseHTTPRequestHandler API
        status = accept_callback(self.server, self.path)
        if status == 404:
            self.send_error(404)
            return

        code, error = self.server.result or (None, None)
        self.send_response(200 if code else 400)
        self.send_header("content-type", "text/html; charset=utf-8")
        self.send_header("cache-control", "no-store")
        self.end_headers()
        message = (
            "Authorization received. Finishing connection; return to Codex."
            if code
            else "Spotify authorization could not be completed. Return to the terminal for details."
        )
        self.wfile.write(f"<!doctype html><title>Spotify setup</title><p>{message}</p>".encode())

    def log_message(self, _format, *args):
        # Callback URLs contain OAuth codes and state; never log request details.
        return


def exchange_code(client_id: str, code: str, verifier: str) -> dict:
    body = urlencode(
        {
            "client_id": client_id,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": REDIRECT_URI,
            "code_verifier": verifier,
        }
    ).encode()
    request = Request(TOKEN_URL, data=body, headers={"content-type": "application/x-www-form-urlencoded"})
    try:
        with urlopen(request, timeout=10) as response:
            result = json.loads(response.read())
    except (HTTPError, URLError, TimeoutError, OSError, json.JSONDecodeError) as error:
        raise RuntimeError("Spotify token exchange failed") from error
    if not isinstance(result, dict) or not all(isinstance(result.get(key), str) and result[key] for key in ("access_token", "refresh_token")):
        raise RuntimeError("Spotify did not return the required authorization tokens")
    return result


def save_credentials(client_id: str, refresh_token: str) -> None:
    client = boto3.Session(profile_name="admin", region_name="us-east-1").client("ssm")
    client.put_parameter(
        Name=PARAMETER_NAME,
        Value=json.dumps({"client_id": client_id, "refresh_token": refresh_token}),
        Type="SecureString",
        Tier="Standard",
        Overwrite=True,
    )


def authorize(client_id: str) -> None:
    verifier, challenge = make_pkce_pair()
    state = secrets.token_urlsafe(32)
    server = _CallbackServer(state)
    try:
        if not webbrowser.open(make_authorization_url(client_id, state, challenge)):
            print("Open the Spotify sign-in page in your browser if it did not open automatically.")
        deadline = time.monotonic() + TIMEOUT_SECONDS
        while server.result is None and time.monotonic() < deadline:
            server.handle_request()
        result = server.result
    finally:
        server.server_close()

    if result is None:
        raise RuntimeError("Spotify sign-in timed out after five minutes; run the command again to reconnect.")
    code, error = result
    if error or not code:
        raise RuntimeError("Spotify sign-in was not completed; run the command again to reconnect.")
    token_response = exchange_code(client_id, code, verifier)
    save_credentials(client_id, token_response["refresh_token"])


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--client-id", help="Spotify app's public Client ID")
    args = parser.parse_args(argv)
    client_id = (args.client_id or input("Spotify app Client ID: ")).strip()
    if not client_id:
        print("A Spotify Client ID is required.", file=sys.stderr)
        return 2
    try:
        authorize(client_id)
    except Exception:
        print("Spotify setup failed. Check the client ID, AWS admin profile, and network, then retry.", file=sys.stderr)
        return 1
    print("Spotify is connected. Re-run this command to reconnect after the refresh token expires (about six months).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
