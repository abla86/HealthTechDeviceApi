from pathlib import Path

import pytest

from src.analyzer import (
    average_age,
    count_high_risk,
    count_medication_support,
    filter_by_municipality,
    filter_by_risk,
    load_records,
    municipality_distribution,
    parse_bool,
)


DATA_FILE = Path(__file__).parent.parent / "data" / "patients.csv"


def test_load_records_returns_expected_count() -> None:
    records = load_records(DATA_FILE)
    assert len(records) == 8


def test_average_age() -> None:
    records = load_records(DATA_FILE)
    assert average_age(records) == pytest.approx(76.125)


def test_count_high_risk() -> None:
    records = load_records(DATA_FILE)
    assert count_high_risk(records) == 3


def test_count_medication_support() -> None:
    records = load_records(DATA_FILE)
    assert count_medication_support(records) == 5


def test_municipality_distribution() -> None:
    records = load_records(DATA_FILE)
    assert municipality_distribution(records) == {
        "Municipality A": 4,
        "Municipality B": 2,
        "Municipality C": 2,
    }


def test_filter_by_municipality_is_case_insensitive() -> None:
    records = load_records(DATA_FILE)
    result = filter_by_municipality(records, "municipality a")
    assert len(result) == 4


def test_filter_by_risk() -> None:
    records = load_records(DATA_FILE)
    result = filter_by_risk(records, "high")
    assert len(result) == 3
    assert all(record.risk_level == "high" for record in result)


def test_parse_bool_accepts_common_values() -> None:
    assert parse_bool("yes") is True
    assert parse_bool("0") is False


def test_invalid_risk_filter_raises_error() -> None:
    records = load_records(DATA_FILE)
    with pytest.raises(ValueError):
        filter_by_risk(records, "critical")
