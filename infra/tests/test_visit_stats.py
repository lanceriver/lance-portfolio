import importlib.util
from datetime import date
from pathlib import Path

SCRIPT_PATH = Path(__file__).parents[2] / "scripts" / "visit-stats.py"
spec = importlib.util.spec_from_file_location("visit_stats", SCRIPT_PATH)
visit_stats = importlib.util.module_from_spec(spec)
spec.loader.exec_module(visit_stats)


def test_summarise_returns_total_recent_days_and_sorted_countries():
    total, daily, countries = visit_stats.summarise(
        [
            {"id": "site", "count": 51},
            {"id": "day#2026-10-25", "count": 4},
            {"id": "day#2026-10-24", "count": 2},
            {"id": "day#2026-10-22", "count": 7},
            {"id": "country#AU", "count": 5},
            {"id": "country#SG", "count": 9},
        ],
        date(2026, 10, 25),
        3,
    )

    assert total == 51
    assert daily == [("2026-10-25", 4), ("2026-10-24", 2), ("2026-10-23", 0)]
    assert countries == [("SG", 9), ("AU", 5), ("unknown", 0)]


def test_summarise_empty_items_returns_zero_counts():
    assert visit_stats.summarise([], date(2026, 10, 25), 2) == (
        0,
        [("2026-10-25", 0), ("2026-10-24", 0)],
        [("unknown", 0)],
    )
