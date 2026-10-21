import json
import os
import sys
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


def event(method):
    return {"requestContext": {"http": {"method": method}}}


def body(response):
    return json.loads(response["body"])


def test_get_missing_item_returns_zero(table_stubber):
    table_stubber.add_response("get_item", {}, {"TableName": "visits-test", "Key": {"id": "site"}})
    response = app.handler(event("GET"), None)
    assert response["statusCode"] == 200
    assert body(response) == {"count": 0}
    table_stubber.assert_no_pending_responses()


def test_get_existing_item_returns_count(table_stubber):
    table_stubber.add_response(
        "get_item", {"Item": {"id": {"S": "site"}, "count": {"N": "1330"}}}, {"TableName": "visits-test", "Key": {"id": "site"}}
    )
    response = app.handler(event("GET"), None)
    assert body(response) == {"count": 1330}
    table_stubber.assert_no_pending_responses()


def test_post_increments_and_returns_new_count(table_stubber):
    expected = {
        "TableName": "visits-test",
        "Key": {"id": "site"},
        "UpdateExpression": "ADD #c :one",
        "ExpressionAttributeNames": {"#c": "count"},
        "ExpressionAttributeValues": {":one": 1},
        "ReturnValues": "UPDATED_NEW",
    }
    table_stubber.add_response("update_item", {"Attributes": {"count": {"N": "1331"}}}, expected)
    response = app.handler(event("POST"), None)
    assert body(response) == {"count": 1331}
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
