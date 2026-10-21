"""HTTP handlers for the portfolio visitor counter."""

import json
import logging
import os
from typing import Any

import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])


def _response(status_code: int, body: dict[str, Any]) -> dict[str, Any]:
    return {
        "statusCode": status_code,
        "headers": {"content-type": "application/json"},
        "body": json.dumps(body),
    }


def handler(event: dict[str, Any], _context: Any) -> dict[str, Any]:
    method = event.get("requestContext", {}).get("http", {}).get("method")
    try:
        if method == "GET":
            result = table.get_item(Key={"id": "site"})
            return _response(200, {"count": int(result.get("Item", {}).get("count", 0))})
        if method == "POST":
            result = table.update_item(
                Key={"id": "site"},
                UpdateExpression="ADD #c :one",
                ExpressionAttributeNames={"#c": "count"},
                ExpressionAttributeValues={":one": 1},
                ReturnValues="UPDATED_NEW",
            )
            return _response(200, {"count": int(result["Attributes"]["count"])})
        return _response(405, {"error": "method not allowed"})
    except ClientError:
        logger.exception("Visitor counter request failed")
        return _response(500, {"error": "unavailable"})
