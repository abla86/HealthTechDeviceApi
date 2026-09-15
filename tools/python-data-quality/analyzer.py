from __future__ import annotations

import csv
from collections import Counter
from pathlib import Path

from .models import PatientRecord

REQUIRED_FIELDS = {"patient_id", "name", "age", "municipality", "risk_level", "medication_support"}
VALID_RISK_LEVELS = {"low", "medium", "high"}


def parse_bool(value: str) -> bool:
    normalized = value.strip().lower()
    if normalized in {"true", "yes", "1"}: return True
    if normalized in {"false", "no", "0"}: return False
    raise ValueError(f"Invalid boolean value: {value}")


def load_records(file_path: str | Path) -> list[PatientRecord]:
    path = Path(file_path)
    if not path.exists(): raise FileNotFoundError(f"CSV file not found: {path}")
    with path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        if reader.fieldnames is None: raise ValueError("CSV file has no header row.")
        missing = REQUIRED_FIELDS - set(reader.fieldnames)
        if missing: raise ValueError("Missing required CSV fields: " + ", ".join(sorted(missing)))
        records: list[PatientRecord] = []
        seen_patient_ids: set[int] = set()
        for row_number, row in enumerate(reader, start=2):
            try:
                patient_id, age = int(row["patient_id"]), int(row["age"])
            except (TypeError, ValueError) as exc:
                raise ValueError(f"Invalid numeric value on row {row_number}.") from exc
            if patient_id in seen_patient_ids: raise ValueError(f"Duplicate patient_id on row {row_number}: {patient_id}")
            seen_patient_ids.add(patient_id)
            name, municipality, risk_level = row["name"].strip(), row["municipality"].strip(), row["risk_level"].strip().lower()
            if not name: raise ValueError(f"Name is empty on row {row_number}.")
            if not municipality: raise ValueError(f"Municipality is empty on row {row_number}.")
            if age < 0 or age > 120: raise ValueError(f"Age out of range on row {row_number}: {age}")
            if risk_level not in VALID_RISK_LEVELS: raise ValueError(f"Invalid risk level on row {row_number}: {risk_level}")
            records.append(PatientRecord(patient_id, name, age, municipality, risk_level, parse_bool(row["medication_support"])))
    return records


def average_age(records: list[PatientRecord]) -> float: return sum(r.age for r in records) / len(records) if records else 0.0

def count_high_risk(records: list[PatientRecord]) -> int: return sum(r.risk_level == "high" for r in records)

def count_medication_support(records: list[PatientRecord]) -> int: return sum(r.medication_support for r in records)

def municipality_distribution(records: list[PatientRecord]) -> dict[str, int]: return dict(sorted(Counter(r.municipality for r in records).items()))

def filter_by_municipality(records: list[PatientRecord], municipality: str) -> list[PatientRecord]:
    wanted = municipality.strip().casefold()
    return [r for r in records if r.municipality.casefold() == wanted]

def filter_by_risk(records: list[PatientRecord], risk_level: str) -> list[PatientRecord]:
    wanted = risk_level.strip().lower()
    if wanted not in VALID_RISK_LEVELS: raise ValueError(f"Invalid risk level: {risk_level}")
    return [r for r in records if r.risk_level == wanted]
