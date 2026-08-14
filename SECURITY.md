# Security Policy

## Scope

HealthTechDeviceApi is a portfolio and learning project for healthcare software engineering. It must not be used to process real patient information or other production health data.

## Data safety

Only synthetic, generated or appropriately de-identified demonstration data may be committed to this repository.

Never commit:

- patient names or identifiers
- medical record numbers
- DICOM files containing identifiable patient information
- credentials, API keys or connection secrets
- production configuration

## Security controls

The repository uses automated dependency monitoring and static analysis. Security-sensitive changes should be covered by automated tests and reviewed before merging to the default branch.

## Reporting a vulnerability

Do not publish exploitable security details in a public issue. Report suspected vulnerabilities privately to the repository owner through an appropriate private contact channel.

## Development principles

- Validate untrusted input at system boundaries.
- Apply least privilege.
- Keep secrets outside source control.
- Avoid sensitive information in application logs.
- Keep dependencies current.
- Prefer secure defaults and explicit failure modes.
