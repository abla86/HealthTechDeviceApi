from pathlib import Path

from src.analyzer import load_records
from src.quality import assess_csv
from src.report import build_report


def main() -> None:
    data_file = Path(__file__).parent / "data" / "patients.csv"
    quality = assess_csv(data_file)

    print("Healthcare Data Quality Assessment")
    print("==================================")
    print(f"Status: {quality.status}")
    for check in quality.checks:
        print(f"[{check.status}] {check.name}: {check.detail}")
    print()

    if quality.status == "FAIL":
        raise SystemExit("Analysis stopped because the dataset failed quality checks.")

    records = load_records(data_file)
    print(build_report(records))


if __name__ == "__main__":
    main()
