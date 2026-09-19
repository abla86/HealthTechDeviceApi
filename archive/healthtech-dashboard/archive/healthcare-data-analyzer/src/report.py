from src.analyzer import (
    average_age,
    count_high_risk,
    count_medication_support,
    municipality_distribution,
)
from src.models import PatientRecord


def build_report(records: list[PatientRecord]) -> str:
    distribution = municipality_distribution(records)
    high_risk_names = [
        record.name
        for record in records
        if record.risk_level == "high"
    ]

    municipality_lines = "\n".join(
        f"  - {name}: {count}"
        for name, count in distribution.items()
    )

    high_risk_lines = (
        "\n".join(f"  - {name}" for name in high_risk_names)
        if high_risk_names
        else "  - None"
    )

    return (
        "Healthcare Data Report\n"
        "======================\n"
        f"Total records: {len(records)}\n"
        f"Average age: {average_age(records):.1f}\n"
        f"High-risk patients: {count_high_risk(records)}\n"
        f"Medication support: {count_medication_support(records)}\n"
        "\nMunicipality distribution:\n"
        f"{municipality_lines}\n"
        "\nHigh-risk patients:\n"
        f"{high_risk_lines}"
    )
