from pathlib import Path

from analyzer import load_records
from quality import assess_csv
from report import build_report


DATA_FILE = Path(__file__).parent / "data" / "patients.csv"


def main() -> None:
    quality = assess_csv(DATA_FILE)
    print("Healthcare Data Quality Assessment")
    print("==================================")
    print(f"Status: {quality.status}")
    for check in quality.checks:
        print(f"[{check.status}] {check.name}: {check.detail}")
    print()
    if quality.status == "FAIL":
        raise SystemExit("Analysis stopped because the dataset failed quality checks.")
    print(build_report(load_records(DATA_FILE)))


if __name__ == "__main__":
    main()
