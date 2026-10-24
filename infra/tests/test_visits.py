import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import boto3
import pytest
from botocore.stub import Stubber

sys.path.insert(0, str(Path(__file__).parents[1] / "visits"))
os.environ.setdefault("TABLE_NAME", "visits-test")
os.environ.setdefault("AWS_DEFAULT_REGION", "us-east-1")
os.environ.setdefault("AWS_ACCESS_KEY_ID", "test")
os.environ.setdefault("AWS_SECRET_ACCESS_KEY", "test")

import app


@pytest.fixture
def table_stubber(monkeypatch):
    # Stubber validates params before the resource layer serialises them, so
    # expected_params use plain Python values; response stubs stay in wire format.
    resource = boto3.resource(
        "dynamodb", region_name="us-east-1", aws_access_key_id="test", aws_secret_access_key="test"
    )
    table = resource.Table("visits-test")
    monkeypatch.setattr(app, "table", table)
    with Stubber(table.meta.client) as stubber:
        yield stubber


def event(method, headers=None):
    result = {"requestContext": {"http": {"method": method}}}
    if headers is not None:
        result["headers"] = headers
    return result


def body(response):
    return json.loads(response["body"])


def expected_update(key, return_values=None):
    expected = {
        "TableName": "visits-test",
        "Key": {"id": key},
        "UpdateExpression": "ADD #c :one",
        "ExpressionAttributeNames": {"#c": "count"},
        "ExpressionAttributeValues": {":one": 1},
    }
    if return_values:
        expected["ReturnValues"] = return_values
    return expected


def queue_post(stubber, country="unknown", day="2026-10-25", site_count=1331):
    stubber.add_response(
        "update_item", {"Attributes": {"count": {"N": str(site_count)}}},
        expected_update("site", "UPDATED_NEW"),
    )
    stubber.add_response("update_item", {}, expected_update(f"day#{day}"))
    stubber.add_response("update_item", {}, expected_update(f"country#{country}"))


def test_get_missing_item_returns_zero(table_stubber):
    table_stubber.add_response("get_item", {}, {"TableName": "visits-test", "Key": {"id": "site"}})
    response = app.handler(event("GET"), None)
    assert response["statusCode"] == 200
    assert body(response) == {"count": 0}
    table_stubber.assert_no_pending_responses()


def test_get_existing_item_returns_count(table_stubber):
    table_stubber.add_response(
        "get_item", {"Item": {"id": {"S": "site"}, "count": {"N": "1330"}}},
        {"TableName": "visits-test", "Key": {"id": "site"}},
    )
    response = app.handler(event("GET"), None)
    assert body(response) == {"count": 1330}
    table_stubber.assert_no_pending_responses()


def test_post_increments_and_returns_new_count(table_stubber, monkeypatch):
    fixed = datetime(2026, 10, 24, 14, 30, tzinfo=timezone.utc)
    monkeypatch.setattr(app, "_now", lambda: fixed)
    queue_post(table_stubber, country="AU")
    response = app.handler(event("POST", {"cloudfront-viewer-country": "AU"}), None)
    assert body(response) == {"count": 1331}
    table_stubber.assert_no_pending_responses()


@pytest.mark.parametrize(
    ("headers", "country"),
    [
        (None, "unknown"),
        ({"cloudfront-viewer-country": None}, "unknown"),
        ({"cloudfront-viewer-country": "<script>"}, "unknown"),
        ({"cloudfront-viewer-country": "aus"}, "unknown"),
        ({"cloudfront-viewer-country": "T1"}, "T1"),
    ],
)
def test_post_normalizes_country_header(table_stubber, monkeypatch, headers, country):
    monkeypatch.setattr(app, "_now", lambda: datetime(2026, 10, 24, 14, 30, tzinfo=timezone.utc))
    queue_post(table_stubber, country=country)
    response = app.handler(event("POST", headers), None)
    assert response["statusCode"] == 200
    table_stubber.assert_no_pending_responses()


def test_post_normalizes_lowercase_country(table_stubber, monkeypatch):
    monkeypatch.setattr(app, "_now", lambda: datetime(2026, 10, 24, 14, 30, tzinfo=timezone.utc))
    queue_post(table_stubber, country="SG")
    response = app.handler(event("POST", {"cloudfront-viewer-country": " sg "}), None)
    assert response["statusCode"] == 200
    table_stubber.assert_no_pending_responses()


def test_day_write_failure_still_updates_country(table_stubber, monkeypatch):
    monkeypatch.setattr(app, "_now", lambda: datetime(2026, 10, 24, 14, 30, tzinfo=timezone.utc))
    table_stubber.add_response("update_item", {"Attributes": {"count": {"N": "8"}}}, expected_update("site", "UPDATED_NEW"))
    table_stubber.add_client_error("update_item", service_error_code="InternalServerError", expected_params=expected_update("day#2026-10-25"))
    table_stubber.add_response("update_item", {}, expected_update("country#AU"))
    response = app.handler(event("POST", {"cloudfront-viewer-country": "AU"}), None)
    assert response["statusCode"] == 200
    assert body(response) == {"count": 8}
    table_stubber.assert_no_pending_responses()


def test_country_write_failure_still_returns_200(table_stubber, monkeypatch):
    monkeypatch.setattr(app, "_now", lambda: datetime(2026, 10, 24, 14, 30, tzinfo=timezone.utc))
    table_stubber.add_response("update_item", {"Attributes": {"count": {"N": "9"}}}, expected_update("site", "UPDATED_NEW"))
    table_stubber.add_response("update_item", {}, expected_update("day#2026-10-25"))
    table_stubber.add_client_error("update_item", service_error_code="InternalServerError", expected_params=expected_update("country#AU"))
    response = app.handler(event("POST", {"cloudfront-viewer-country": "AU"}), None)
    assert response["statusCode"] == 200
    assert body(response) == {"count": 9}
    table_stubber.assert_no_pending_responses()


def test_site_write_failure_returns_500_without_secondary_writes(table_stubber):
    table_stubber.add_client_error(
        "update_item", service_error_code="InternalServerError",
        expected_params=expected_update("site", "UPDATED_NEW"),
    )
    response = app.handler(event("POST"), None)
    assert response["statusCode"] == 500
    assert body(response) == {"error": "unavailable"}
    table_stubber.assert_no_pending_responses()


def test_unknown_method_returns_405(table_stubber):
    response = app.handler(event("DELETE"), None)
    assert response["statusCode"] == 405
    table_stubber.assert_no_pending_responses()


def test_dynamodb_error_returns_500(table_stubber):
    table_stubber.add_client_error("get_item", service_error_code="InternalServerError", expected_params={"TableName": "visits-test", "Key": {"id": "site"}})
    response = app.handler(event("GET"), None)
    assert response["statusCode"] == 500
    assert body(response) == {"error": "unavailable"}
    table_stubber.assert_no_pending_responses()
