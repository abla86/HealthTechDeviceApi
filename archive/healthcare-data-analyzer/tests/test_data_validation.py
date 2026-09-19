from pathlib import Path

import pytest

from src.analyzer import load_records


def test_duplicate_patient_id_is_rejected(tmp_path: Path) -> None:
    data = """patient_id,name,age,municipality,risk_level,medication_support
1,Alice,70,Municipality A,low,no
1,Bob,71,Municipality B,high,yes
"""
    csv_file = tmp_path / "duplicate.csv"
    csv_file.write_text(data, encoding="utf-8")

    with pytest.raises(ValueError, match="Duplicate patient_id"):
        load_records(csv_file)
