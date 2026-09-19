from pathlib import Path

from src.quality import assess_csv


DATA_FILE = Path(__file__).parent.parent / "data" / "patients.csv"


def test_quality_report_passes_reference_dataset() -> None:
    report = assess_csv(DATA_FILE)
    assert report.status == "PASS"
    assert report.records_seen == 8
    assert report.duplicate_ids == 0
    assert report.missing_values == 0
    assert report.invalid_values == 0


def test_quality_report_detects_duplicate_ids(tmp_path: Path) -> None:
    file = tmp_path / "duplicate.csv"
    file.write_text(
        "patient_id,name,age,municipality,risk_level,medication_support\n"
        "1,A,70,A,low,no\n"
        "1,B,71,B,medium,yes\n",
        encoding="utf-8",
    )

    report = assess_csv(file)
    assert report.status == "FAIL"
    assert report.duplicate_ids == 1


def test_quality_report_detects_invalid_values(tmp_path: Path) -> None:
    file = tmp_path / "invalid.csv"
    file.write_text(
        "patient_id,name,age,municipality,risk_level,medication_support\n"
        "1,A,150,A,unknown,maybe\n",
        encoding="utf-8",
    )

    report = assess_csv(file)
    assert report.status == "FAIL"
    assert report.invalid_values >= 2
