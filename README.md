# HealthTech Device Platform

A healthcare-technology engineering project combining a C#/.NET REST API with a browser dashboard for simulated device monitoring. It demonstrates backend/API engineering, validation, layered architecture, OpenAPI, Docker, CI/security controls and frontend integration without using real patient data.

## Portfolio role

This is a **combined platform unit**. The former standalone monitoring-dashboard capability is represented here because it complements the device API rather than adding a separate portfolio product. Legacy dashboard implementations were removed from the active repository; the current repository contains only the maintained API, tests, documentation and supporting demo assets.

## Implemented

- RESTful device CRUD operations
- health-check endpoint
- device filtering and statistics
- input validation and normalised status values
- OpenAPI support
- repository abstraction and dependency injection
- layered domain/application/infrastructure structure
- synthetic DICOM Part 10 generation with `fo-dicom`
- synthetic metadata and de-identification markers
- bounded `application/dicom` metadata inspection
- **ECDSA P-256 / SHA-256 digital-signature demonstration for synthetic artifacts**
- **AES-256-GCM encryption/decryption demonstration for synthetic artifacts**
- automated API, service, DICOM and cryptography tests with xUnit
- GitHub Actions CI
- Docker build/runtime verification in CI
- CodeQL scanning
- Dependabot monitoring
- browser dashboard integration for simulated device status and metrics

## Security integration

The cryptography examples are intentionally attached to the HealthTech artifact boundary instead of being a disconnected security exercise.

| Endpoint | Demonstrates | Boundary |
|---|---|---|
| `GET /security/integrity-demo` | ECDSA P-256 signing and verification of a synthetic artifact manifest | Ephemeral key; demonstration only |
| `GET /security/encryption-demo` | AES-256-GCM authenticated encryption and successful round-trip decryption | In-memory demo key; demonstration only |

The service never accepts or returns real patient information. These endpoints exist to make the concepts of integrity, authenticity and confidentiality inspectable in a bounded portfolio context.

**Important:** the in-memory key handling is deliberately not presented as production key management. Production systems require managed key storage, rotation, access control, threat modelling and environment-specific security review.

## Engineering evidence

This repository is deliberately positioned as an application-engineering flagship: the strongest evidence is the combination of a typed .NET API, layered domain boundaries, validation, synthetic DICOM handling, persistence, automated tests, cryptography demonstrations, containerization and security controls. The browser dashboard is supporting evidence, not a separate product.

## Technology breadth demonstrated

**C# / .NET** · ASP.NET Core · Minimal APIs · REST · OpenAPI · dependency injection · layered architecture · EF Core / SQLite · xUnit · Docker · GitHub Actions · CodeQL · Dependabot · DICOM/fo-dicom · HTML5 · CSS3 · JavaScript · Fetch API · ECDSA · AES-GCM

## Application security

**Portfolio security focus:** secure API boundaries, validation, throttling, safe handling of synthetic healthcare data, cryptographic integrity/confidentiality demonstrations and auditable failure paths.

| Control | Implementation | Evidence |
|---|---|---|
| Input validation | Device validation and normalized status values | Automated service tests |
| Request throttling | Global fixed-window rate limit plus stricter write-operation limit | HTTP 429 on policy rejection |
| Payload boundary | DICOM inspection rejects non-DICOM media and limits bodies to 5 MiB, including streamed-body enforcement | API implementation + negative paths |
| Production API access | API-key authentication for non-public endpoints outside Development, with constant-time comparison | API boundary middleware |
| Safe response headers | nosniff, DENY, no-referrer, restricted browser permissions and no-store | HTTP middleware |
| DICOM boundary | Synthetic/de-identified data, bounded inspection and allow-listed metadata output | DICOM service/tests |
| Digital signatures | ECDSA P-256 signature and verification over a synthetic artifact manifest | /security/integrity-demo + xUnit |
| Encryption | AES-256-GCM authenticated encryption/decryption | /security/encryption-demo + xUnit |
| Auditability | Security-relevant DICOM outcomes are recorded without storing credentials | Metadata repository/audit events |
| Supply-chain controls | CodeQL and Dependabot | GitHub configuration |
| Secret hygiene | API key is configuration-driven; production startup fails closed unless a 32+ character key is configured | configuration/environment |

The security model deliberately stays within the project's scope. A production identity platform, production key-management infrastructure, clinical validation and complete threat model are not claimed.

## DICOM development boundary

The current DICOM implementation is for synthetic demonstration data and bounded inspection. It does not claim production medical-imaging security or clinical validation.

Current functionality includes generated synthetic identifiers and DICOM UIDs, de-identification markers, bounded inspection and allow-listed metadata output.

See `docs/SECURE_DICOM_ROADMAP.md` and `SECURITY.md`.

## Testing

```powershell
dotnet test .\HealthTechDeviceApi.Tests\HealthTechDeviceApi.Tests.csproj
```

CI builds the API and runs the automated test suite, with Docker verification, CodeQL and Dependabot configuration.

## Docker

```powershell
docker build -t healthtech-device-api:latest .
docker run --rm -p 8080:8080 -e Security__ApiKey="<32+ character secret>" -v healthtech-data:/app/data healthtech-device-api:latest
```

## Data safety

Use only synthetic, generated or appropriately de-identified demonstration data. Do not commit real patient information or upload real patient information to public demonstrations.

## Portfolio evidence

This project demonstrates ASP.NET Core REST API development, validation, dependency injection, layered architecture, automated testing, OpenAPI documentation, Docker execution, CI/security tooling, cryptographic integrity/confidentiality demonstrations and a complementary browser monitoring interface. The project is a demonstration platform, not a clinically validated medical system.

## Status

**Active portfolio project / demonstration platform.** Current implementation status is represented by the code, repository history and CI verification.

## Portfolio

https://abla86.github.io/developer-portfolio/

## Change-control audit

See [docs/REPOSITORY-CHANGE-AUDIT-2026-08-28.md](docs/REPOSITORY-CHANGE-AUDIT-2026-08-28.md) for the repository change-control and traceability record.
