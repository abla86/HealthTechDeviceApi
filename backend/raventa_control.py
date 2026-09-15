"""RAVENTA-inspired control/risk API for the HealthTech showcase.

This module is intentionally synthetic and local-first. It provides the control-record
workflow consolidated from the historical RAVENTA prototype without making clinical,
regulatory, or patient-safety decisions automatically.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/controls", tags=["controls"])


class Severity(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"
    critical = "Critical"


class ControlStatus(str, Enum):
    open = "Open"
    in_progress = "InProgress"
    resolved = "Resolved"
    accepted = "Accepted"


class ControlRecord(BaseModel):
    id: int
    domain: str = Field(min_length=2, max_length=100)
    title: str = Field(min_length=2, max_length=200)
    description: str = Field(default="", max_length=2000)
    severity: Severity
    status: ControlStatus = ControlStatus.open
    owner: str = Field(default="Unassigned", min_length=2, max_length=100)
    due_date: Optional[str] = None
    created_at: str
    updated_at: str


class ControlRecordCreate(BaseModel):
    domain: str = Field(min_length=2, max_length=100)
    title: str = Field(min_length=2, max_length=200)
    description: str = Field(default="", max_length=2000)
    severity: Severity
    owner: str = Field(default="Unassigned", min_length=2, max_length=100)
    due_date: Optional[str] = None


class ControlRecordPatch(BaseModel):
    description: Optional[str] = Field(default=None, max_length=2000)
    severity: Optional[Severity] = None
    status: Optional[ControlStatus] = None
    owner: Optional[str] = Field(default=None, min_length=2, max_length=100)
    due_date: Optional[str] = None


_records: list[ControlRecord] = [
    ControlRecord(
        id=1,
        domain="HMS",
        title="Device maintenance overdue",
        description="Synthetic demonstration record for a maintenance control.",
        severity=Severity.medium,
        status=ControlStatus.open,
        owner="Operations",
        due_date=None,
        created_at="2026-09-01T09:00:00+00:00",
        updated_at="2026-09-01T09:00:00+00:00",
    ),
]


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


@router.get("", response_model=list[ControlRecord])
def list_controls(domain: Optional[str] = None, status: Optional[ControlStatus] = None):
    records = _records
    if domain:
        records = [record for record in records if record.domain.lower() == domain.lower()]
    if status:
        records = [record for record in records if record.status == status]
    return records


@router.get("/{record_id}", response_model=ControlRecord)
def get_control(record_id: int):
    for record in _records:
        if record.id == record_id:
            return record
    raise HTTPException(status_code=404, detail="Control record not found")


@router.post("", response_model=ControlRecord, status_code=201)
def create_control(payload: ControlRecordCreate):
    now = _now()
    record = ControlRecord(
        id=max((item.id for item in _records), default=0) + 1,
        created_at=now,
        updated_at=now,
        **payload.model_dump(),
    )
    _records.append(record)
    return record


@router.patch("/{record_id}", response_model=ControlRecord)
def patch_control(record_id: int, payload: ControlRecordPatch):
    for index, record in enumerate(_records):
        if record.id == record_id:
            values = record.model_dump()
            values.update({key: value for key, value in payload.model_dump().items() if value is not None})
            values["updated_at"] = _now()
            updated = ControlRecord(**values)
            _records[index] = updated
            return updated
    raise HTTPException(status_code=404, detail="Control record not found")
