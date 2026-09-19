from dataclasses import dataclass


@dataclass(frozen=True)
class PatientRecord:
    patient_id: int
    name: str
    age: int
    municipality: str
    risk_level: str
    medication_support: bool
