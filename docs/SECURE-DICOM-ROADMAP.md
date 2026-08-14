# Secure DICOM Service — Architecture Roadmap

## Objective

Extend HealthTechDeviceApi with a security-focused medical-imaging service that demonstrates competencies relevant to healthcare software engineering: C#/.NET, DICOM, client/server architecture, SOLID design, automated testing, security engineering, Docker, CI/CD and cloud-ready architecture.

## Engineering principles

- Separation of concerns and dependency inversion
- Testable application services behind interfaces
- Explicit validation at trust boundaries
- Least-privilege and secure-by-default configuration
- No real patient data or credentials in the repository
- Automated build, test, dependency and static-analysis checks

## Planned architecture

```text
API / HTTP boundary
        |
Application services
        |
Domain models + interfaces
        |
Infrastructure
  |          |          |
DICOM     Database   Security
```

## Phase 1 — Architecture and tests

Refactor device functionality into domain/application/infrastructure boundaries while preserving current API behaviour. Add unit tests for application services and retain API integration tests.

## Phase 2 — DICOM

Add a DICOM abstraction and metadata model. Use synthetic/de-identified test data only. Implement parsing and validation behind an interface so the DICOM library remains an infrastructure dependency.

Target metadata includes:

- Study Instance UID
- Series Instance UID
- SOP Instance UID
- modality
- study date
- non-identifying technical metadata

## Phase 3 — Persistence

Introduce a relational persistence layer and migrations. Keep persistence behind repository interfaces. Demonstrate SQL queries, constraints and safe parameter handling.

## Phase 4 — Security

Add:

- authentication and authorization
- input and upload validation
- secure HTTP configuration
- audit logging without sensitive clinical content
- rate/size limits where appropriate
- threat model
- documented security assumptions

Automated security controls will include the existing CodeQL and Dependabot setup plus dependency/container scanning where appropriate.

## Phase 5 — DICOM connectivity

Implement standards-oriented DICOM connectivity behind dedicated services. Candidate demonstrations include verification and controlled store/query workflows using local synthetic datasets.

## Phase 6 — Cloud-ready deployment

Containerize the complete service and document an Azure-oriented deployment architecture, configuration/secrets strategy, health checks and CI/CD path.

## Verification criteria

A feature is not documented as implemented until corresponding code and tests exist. README claims must match repository state.

## Portfolio competencies demonstrated when complete

- C# / .NET
- healthcare software development
- DICOM
- client/server architecture
- SQL
- SOLID architecture
- automated testing / TDD-oriented workflow
- cybersecurity and privacy engineering
- vulnerability assessment automation
- Docker
- GitHub Actions CI/CD
- cloud-ready application design
