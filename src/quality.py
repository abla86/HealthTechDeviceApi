from __future__ import annotations

import csv
from collections import Counter
from dataclasses import dataclass
from pathlib import Path

EXPECTED_FIELDS = ("patient_id", "name", "age", "municipality", "risk_level", "medication_support")
VALID_RISK_LEVELS = {"low", "medium", "high"}
VALID_BOOL_VALUES = {"true", "yes", "1", "false", "no", "0"}

@dataclass(frozen=True)
class QualityCheck:
    name: str
    status: str
    detail: str

@dataclass(frozen=True)
class QualityReport:
    checks: tuple[QualityCheck, ...]
    records_seen: int
    duplicate_ids: int
    missing_values: int
    invalid_values: int
    @property
    def status(self) -> str:
        if any(check.status == "FAIL" for check in self.checks): return "FAIL"
        if any(check.status == "WARN" for check in self.checks): return "PASS WITH WARNINGS"
        return "PASS"

def assess_csv(file_path: str | Path) -> QualityReport:
    path = Path(file_path)
    if not path.exists():
        return QualityReport((QualityCheck("File availability", "FAIL", f"CSV file not found: {path}"),), 0, 0, 0, 0)
    checks: list[QualityCheck] = []
    duplicate_ids = missing_values = invalid_values = records_seen = 0
    with path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        headers = tuple(reader.fieldnames or ())
        missing_headers = [field for field in EXPECTED_FIELDS if field not in headers]
        unexpected_headers = [field for field in headers if field not in EXPECTED_FIELDS]
        if missing_headers:
            checks.append(QualityCheck("Schema conformity", "FAIL", "Missing required fields: " + ", ".join(missing_headers)))
            return QualityReport(tuple(checks), 0, 0, 0, 0)
        if unexpected_headers:
            checks.append(QualityCheck("Schema conformity", "WARN", "Unexpected fields present: " + ", ".join(unexpected_headers)))
        else:
            checks.append(QualityCheck("Schema conformity", "PASS", "All required fields are present."))
        patient_ids: list[str] = []
        for row in reader:
            records_seen += 1
            patient_ids.append((row.get("patient_id") or "").strip())
            for field in EXPECTED_FIELDS:
                if not (row.get(field) or "").strip(): missing_values += 1
            try:
                age = int((row.get("age") or "").strip())
                if age < 0 or age > 120: invalid_values += 1
            except ValueError: invalid_values += 1
            if (row.get("risk_level") or "").strip().lower() not in VALID_RISK_LEVELS: invalid_values += 1
            if (row.get("medication_support") or "").strip().lower() not in VALID_BOOL_VALUES: invalid_values += 1
            if not (row.get("patient_id") or "").strip(): invalid_values += 1
        counts = Counter(patient_ids)
        duplicate_ids = sum(count - 1 for count in counts.values() if count > 1)
    checks.extend([
        QualityCheck("Completeness", "PASS" if missing_values == 0 else "FAIL", "No missing required values." if missing_values == 0 else f"{missing_values} missing required values detected."),
        QualityCheck("Uniqueness", "PASS" if duplicate_ids == 0 else "FAIL", "Patient IDs are unique." if duplicate_ids == 0 else f"{duplicate_ids} duplicate patient ID occurrences detected."),
        QualityCheck("Validity", "PASS" if invalid_values == 0 else "FAIL", "Values conform to the configured domain rules." if invalid_values == 0 else f"{invalid_values} invalid values detected."),
        QualityCheck("Dataset size", "PASS" if records_seen > 0 else "FAIL", f"{records_seen} records available for analysis." if records_seen > 0 else "Dataset is empty."),
    ])
    return QualityReport(tuple(checks), records_seen, duplicate_ids, missing_values, invalid_values)
