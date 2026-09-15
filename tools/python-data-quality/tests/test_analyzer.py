from pathlib import Path
import sys

import pytest

sys.path.insert(0, str(Path(__file__).parents[1]))

from analyzer import (
    average_age,
    count_high_risk,
    count_medication_support,
    filter_by_municipality,
    filter_by_risk,
    load_records,
    municipality_distribution,
    parse_bool,
)


DATA_FILE = Path(__file__).parents[1] / "data" / "patients.csv"


def test_load_records_returns_expected_count() -> None:
    assert len(load_records(DATA_FILE)) == 8


def test_average_age() -> None:
    assert average_age(load_records(DATA_FILE)) == pytest.approx(76.125)


def test_count_high_risk() -> None:
    assert count_high_risk(load_records(DATA_FILE)) == 3


def test_count_medication_support() -> None:
    assert count_medication_support(load_records(DATA_FILE)) == 5


def test_municipality_distribution() -> None:
    assert municipality_distribution(load_records(DATA_FILE)) == {
        "Municipality A": 4,
        "Municipality B": 2,
        "Municipality C": 2,
    }


def test_filter_by_municipality_is_case_insensitive() -> None:
    assert len(filter_by_municipality(load_records(DATA_FILE), "municipality a")) == 4


def test_filter_by_risk() -> None:
    result = filter_by_risk(load_records(DATA_FILE), "high")
    assert len(result) == 3
    assert all(record.risk_level == "high" for record in result)


def test_parse_bool_accepts_common_values() -> None:
    assert parse_bool("yes") is True
    assert parse_bool("0") is False


def test_invalid_risk_filter_raises_error() -> None:
    with pytest.raises(ValueError):
        filter_by_risk(load_records(DATA_FILE), "critical")
