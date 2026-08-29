# HealthTech Device Platform

A healthcare-technology engineering project combining a C#/.NET REST API with a browser dashboard for simulated device monitoring. It demonstrates backend/API engineering, validation, layered architecture, OpenAPI, Docker, CI/security controls and frontend integration without using real patient data.

## Portfolio role

This is a **combined platform unit**. The former standalone monitoring-dashboard capability is represented here because it complements the device API rather than adding a separate portfolio product. The separate `healthtech-dashboard` repository is retained as implementation history and should not be promoted as a second flagship project.

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
- automated API, service and DICOM tests with xUnit
- GitHub Actions CI
- Docker build/runtime verification in CI
- CodeQL scanning
- Dependabot monitoring
- browser dashboard integration for simulated device status and metrics

## Technology breadth demonstrated

**C# / .NET** · ASP.NET Core · Minimal APIs · REST · OpenAPI · dependency injection · layered architecture · xUnit · Docker · GitHub Actions · CodeQL · Dependabot · DICOM/fo-dicom · HTML5 · CSS3 · JavaScript · Fetch API

## DICOM development boundary

The current DICOM implementation is for synthetic demonstration data and bounded inspection. It does not claim production medical-imaging security or clinical validation.

Current functionality includes generated synthetic identifiers and DICOM UIDs, de-identification markers, bounded inspection and allow-listed metadata output.

The repository does not currently claim SQL persistence, authentication/authorization, threat modelling, secure networking or Azure deployment as implemented functionality.

See `docs/SECURE_DICOM_ROADMAP.md` and `SECURITY.md`.

## Testing

```powershell
dotnet test .\HealthTechDeviceApi.Tests\HealthTechDeviceApi.Tests.csproj
```

CI builds the API and runs the automated test suite, with Docker verification, CodeQL and Dependabot configuration.

## Docker

```powershell
docker build -t healthtech-device-api:latest .
docker run --rm -p 8080:8080 healthtech-device-api:latest
```

## Data safety

Use only synthetic, generated or appropriately de-identified demonstration data. Do not commit real patient information or upload real patient information to public demonstrations.

## Portfolio evidence

This project demonstrates ASP.NET Core REST API development, validation, dependency injection, layered architecture, automated testing, OpenAPI documentation, Docker execution, CI/security tooling and a complementary browser monitoring interface. The project is a demonstration platform, not a clinically validated medical system.

## Status

**Active portfolio project / demonstration platform.** Current implementation status is represented by the code, repository history and CI verification.

## Portfolio

https://abla86.github.io/developer-portfolio/

## Change-control audit

See [docs/REPOSITORY-CHANGE-AUDIT-2026-08-28.md](docs/REPOSITORY-CHANGE-AUDIT-2026-08-28.md) for the repository change-control and traceability record.
