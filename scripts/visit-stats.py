#!/usr/bin/env python3
"""Read the portfolio's per-day and per-country visit counts."""

import argparse
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

import boto3

SYDNEY = ZoneInfo("Australia/Sydney")


def summarise(items: list[dict], today: date, days: int) -> tuple[int, list[tuple[str, int]], list[tuple[str, int]]]:
    counts = {item["id"]: int(item.get("count", 0)) for item in items}
    daily = [
        ((today - timedelta(days=offset)).isoformat(), counts.get(f"day#{(today - timedelta(days=offset)).isoformat()}", 0))
        for offset in range(days)
    ]
    countries = [(key.removeprefix("country#"), value) for key, value in counts.items() if key.startswith("country#")]
    if not any(code == "unknown" for code, _ in countries):
        countries.append(("unknown", 0))
    countries.sort(key=lambda item: (-item[1], item[0]))
    return counts.get("site", 0), daily, countries


def _table_name(cloudformation) -> str:
    result = cloudformation.describe_stack_resource(
        StackName="lance-portfolio", LogicalResourceId="VisitsTable"
    )
    return result["StackResourceDetail"]["PhysicalResourceId"]


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--days", type=int, default=30, help="number of Sydney days to show (default: 30)")
    parser.add_argument("--table", help="DynamoDB table name (skip stack lookup)")
    args = parser.parse_args(argv)
    if args.days < 1:
        parser.error("--days must be at least 1")

    session = boto3.Session(region_name="us-east-1")
    table_name = args.table or _table_name(session.client("cloudformation"))
    table = session.resource("dynamodb").Table(table_name)
    items = []
    response = table.scan()
    items.extend(response.get("Items", []))
    while "LastEvaluatedKey" in response:
        response = table.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
        items.extend(response.get("Items", []))

    today = datetime.now(SYDNEY).date()
    total, daily, countries = summarise(items, today, args.days)
    print(f"Site total: {total}")
    print(f"\nVisits by day (Sydney, last {args.days} days)")
    print("Date        Count")
    for day, count in daily:
        print(f"{day}  {count}")
    print("\nVisits by country")
    print("Country     Count")
    for country, count in countries:
        print(f"{country:<11} {count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
