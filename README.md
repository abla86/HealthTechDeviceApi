# HealthTech Device API

[![.NET CI](https://github.com/abla86/HealthTechDeviceApi/actions/workflows/dotnet-ci.yml/badge.svg)](https://github.com/abla86/HealthTechDeviceApi/actions/workflows/dotnet-ci.yml)

REST API for healthcare-technology device management and secure medical-imaging development, built with C# and ASP.NET Core.

## Start here

| Need | Go to |
|---|---|
| Current scope and status | [Status](#status) |
| See implemented functionality | [Implemented](#implemented) |
| Understand DICOM boundaries | [DICOM development boundary](#dicom-development-boundary) |
| Run tests | [Testing](#testing) |
| Run with Docker | [Docker](#docker) |
| See portfolio context | [Developer portfolio](https://abla86.github.io/developer-portfolio/) |

## Status

**Development / demonstration project.**

The repository demonstrates API engineering, validation, testing, containerisation and security-aware healthcare software development. It is not presented as a production medical-imaging system or clinically validated software.

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

## DICOM development boundary

The current DICOM implementation is for synthetic demonstration data and bounded inspection. It does not claim production medical-imaging security or clinical validation.

Current functionality includes generated synthetic identifiers and DICOM UIDs, de-identification markers, bounded inspection and allow-listed metadata output.

The repository does not currently claim SQL persistence, authentication/authorization, threat modelling, secure networking or Azure deployment as implemented functionality.

See `docs/SECURE_DICOM_ROADMAP.md` and `SECURITY.md`.

## Technology

- C#
- .NET 9
- ASP.NET Core
- Minimal APIs
- REST
- OpenAPI
- fo-dicom 5.2.6
- xUnit
- Microsoft.AspNetCore.Mvc.Testing
- GitHub Actions
- Docker

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

## Run locally

```powershell
dotnet restore
dotnet run
```

## Employer / portfolio evidence

This project demonstrates ASP.NET Core REST API development, validation, dependency injection, layered architecture, automated testing, OpenAPI documentation, Docker execution, CI/security tooling and explicit healthcare data-safety boundaries.

## Author

Anne Beth Andersen

## Portfolio

https://abla86.github.io/developer-portfolio/

## Change-control audit

See [docs/REPOSITORY-CHANGE-AUDIT-2026-08-28.md](docs/REPOSITORY-CHANGE-AUDIT-2026-08-28.md) for the repository change-control and traceability record.
