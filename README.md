# HealthTech Device API

[![.NET CI](https://github.com/abla86/HealthTechDeviceApi/actions/workflows/dotnet-ci.yml/badge.svg)](https://github.com/abla86/HealthTechDeviceApi/actions/workflows/dotnet-ci.yml)

REST API for healthcare-technology device management and secure medical-imaging development, built with C# and ASP.NET Core.

## Features

- RESTful device CRUD operations
- Health-check endpoint
- Device filtering and statistics
- Input validation and normalized status values
- OpenAPI support
- Repository abstraction and dependency injection
- Layered domain, application and infrastructure structure
- Synthetic DICOM Part 10 file generation with `fo-dicom`
- Synthetic metadata and de-identification markers
- Bounded `application/dicom` metadata inspection
- Automated API, service and DICOM tests with xUnit
- GitHub Actions continuous integration
- Docker build and runtime verification in CI
- CodeQL security scanning
- Dependabot dependency monitoring

## Secure DICOM development track

The current DICOM implementation creates synthetic demonstration files and supports bounded inspection of uploaded DICOM request bodies. It does not claim production medical-imaging security or clinical validation.

Current functionality includes synthetic identifiers, generated DICOM UIDs, de-identification markers, bounded inspection and allow-listed metadata output.

SQL persistence, authentication/authorization, threat modelling, secure networking and Azure deployment remain planned and are not claimed as implemented.

See `docs/SECURE_DICOM_ROADMAP.md` and `SECURITY.md`.

## Technology Stack

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

## Automated Testing

Run tests:

```powershell
dotnet test .\HealthTechDeviceApi.Tests\HealthTechDeviceApi.Tests.csproj
```

## Continuous Integration

GitHub Actions builds the API and runs the automated test suite. The repository also contains Docker verification, CodeQL and Dependabot configuration.

## Docker

```powershell
docker build -t healthtech-device-api:latest .
docker run --rm -p 8080:8080 healthtech-device-api:latest
```

## Data Safety

Only synthetic, generated or appropriately de-identified demonstration data may be used. Real patient information must not be committed to this public repository or uploaded to public demo environments.

## Run Locally

```powershell
dotnet restore
dotnet run
```

## Status

Development / demonstration project. The repository documents implemented functionality separately from planned production features.

## Author

Anne Beth Andersen
