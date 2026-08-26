# HealthTech Device API

[![.NET CI](https://github.com/abla86/HealthTechDeviceApi/actions/workflows/dotnet-ci.yml/badge.svg)](https://github.com/abla86/HealthTechDeviceApi/actions/workflows/dotnet-ci.yml)

REST API for healthcare-technology device management and secure medical-imaging development, built with C# and ASP.NET Core.

## Status at a glance

**Development / demonstration project.**

Implemented functionality is documented separately from planned production features. The repository is suitable for demonstrating API engineering, testing, containerisation and security-aware healthcare software development. It is **not presented as a production medical-imaging system or clinically validated software**.

## What is implemented

- RESTful device CRUD operations
- health-check endpoint
- device filtering and statistics
- input validation and normalised status values
- OpenAPI support
- repository abstraction and dependency injection
- layered domain/application/infrastructure structure
- synthetic DICOM Part 10 file generation with `fo-dicom`
- synthetic metadata and de-identification markers
- bounded `application/dicom` metadata inspection
- automated API, service and DICOM tests with xUnit
- GitHub Actions CI
- Docker build/runtime verification in CI
- CodeQL security scanning
- Dependabot dependency monitoring

## Secure DICOM development track

The current DICOM implementation creates synthetic demonstration files and supports bounded inspection of uploaded DICOM request bodies. It does **not** claim production medical-imaging security or clinical validation.

Current functionality includes synthetic identifiers, generated DICOM UIDs, de-identification markers, bounded inspection and allow-listed metadata output.

SQL persistence, authentication/authorization, threat modelling, secure networking and Azure deployment remain planned and are not claimed as implemented.

See `docs/SECURE_DICOM_ROADMAP.md` and `SECURITY.md`.

## Technology actually represented

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

Run the automated test suite:

```powershell
dotnet test .\HealthTechDeviceApi.Tests\HealthTechDeviceApi.Tests.csproj
```

The repository documents automated API, service and DICOM tests. CI builds the API and runs the test suite, with Docker verification, CodeQL and Dependabot configuration also present.

## Docker

```powershell
docker build -t healthtech-device-api:latest .
docker run --rm -p 8080:8080 healthtech-device-api:latest
```

## Data safety

Only synthetic, generated or appropriately de-identified demonstration data may be used. Real patient information must not be committed to this public repository or uploaded to public demonstration environments.

## Run locally

```powershell
dotnet restore
dotnet run
```

## Employer / portfolio evidence

This project demonstrates:

- ASP.NET Core REST API development
- validation and dependency injection
- layered application architecture
- automated testing
- OpenAPI documentation
- Docker-based execution
- CI and security tooling
- healthcare-aware data-safety boundaries
- explicit separation between implemented functionality and future production work

## Author

Anne Beth Andersen

## Portfolio

https://abla86.github.io/developer-portfolio/
