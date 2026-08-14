# HealthTech Device API

[![.NET CI](https://github.com/abla86/HealthTechDeviceApi/actions/workflows/dotnet-ci.yml/badge.svg)](https://github.com/abla86/HealthTechDeviceApi/actions/workflows/dotnet-ci.yml)

REST API for healthcare-technology device management and secure medical-imaging development, built with C# and ASP.NET Core.

## Features

- RESTful device CRUD operations
- Health-check endpoint
- Device filtering by status, type and location
- Device statistics endpoint
- Input validation and normalized status values
- OpenAPI support
- Repository abstraction and dependency injection
- Separation of domain, application and infrastructure concerns
- Synthetic DICOM Part 10 file generation with `fo-dicom`
- Generated Study, Series and SOP Instance UIDs
- Explicit synthetic identity and de-identification markers
- DICOM metadata and file-download endpoints
- Bounded `application/dicom` metadata inspection endpoint
- 5 MiB streaming request limit for DICOM inspection
- Large DICOM values skipped during inspection
- Allow-listed inspection response without patient-name or patient-ID values
- Generic handling of unreadable DICOM input
- Automated API and application-service tests with xUnit
- Automated tests for generated DICOM structure, synthetic metadata and inspection behaviour
- GitHub Actions continuous integration
- Docker image build and runtime verification in CI
- CodeQL security scanning
- Dependabot dependency monitoring
- Docker containerization

## Architecture

The secure medical-imaging branch uses a layered structure:

- `Domain` - device and DICOM models
- `Application` - business logic and service/repository abstractions
- `Infrastructure` - in-memory device persistence and fo-dicom implementation
- `Program.cs` - HTTP endpoint composition and dependency injection

The design keeps HTTP concerns, business rules and infrastructure dependencies separated and provides a base for SQL persistence and additional DICOM security controls.

## Secure DICOM development track

The current DICOM implementation creates a synthetic DICOM Part 10 file and can inspect an uploaded DICOM request body without returning patient identity values.

Current DICOM functionality:

- `fo-dicom` 5.2.6
- synthetic Patient ID and Patient Name for generated demonstration files
- `Patient Identity Removed = YES`
- de-identification-method marker
- generated DICOM UIDs
- Secondary Capture SOP Class
- `application/dicom` download response
- bounded raw `application/dicom` inspection
- `FileReadOption.SkipLargeTags` during inspection
- allow-listed output: modality, SOP Class UID, identity-presence flag, de-identification flag and partial-read status
- automated checks for the Part 10 `DICM` signature and inspection behaviour

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

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | / | API information |
| GET | /health | Health check |
| GET | /devices | List/filter devices |
| GET | /devices/stats | Device statistics |
| GET | /devices/{id} | Get device by ID |
| POST | /devices | Create device |
| PUT | /devices/{id} | Update device |
| DELETE | /devices/{id} | Delete device |
| GET | /dicom/synthetic/metadata | Return metadata for a newly generated synthetic DICOM study |
| GET | /dicom/synthetic | Generate and download a synthetic DICOM Part 10 file |
| POST | /dicom/inspect | Inspect an `application/dicom` request body using bounded, allow-listed metadata extraction |

`POST /dicom/inspect` accepts a raw `application/dicom` body up to 5 MiB. It does not return Patient Name or Patient ID values.

## Automated Testing

The project includes xUnit integration tests and application-service/DICOM unit tests.

Run tests:

    dotnet test .\HealthTechDeviceApi.Tests\HealthTechDeviceApi.Tests.csproj

## Continuous Integration

GitHub Actions restores dependencies, builds the API in Release configuration and runs the automated test suite on pushes and pull requests to `main`.

Automation includes:

- .NET build and automated tests
- Docker image build and container endpoint verification
- CodeQL static security analysis
- Dependabot monitoring for NuGet packages and GitHub Actions

## Docker

Build the image:

    docker build -t healthtech-device-api:latest .

Run the container:

    docker run --rm -p 8080:8080 healthtech-device-api:latest

## Data Safety

Only synthetic, generated or appropriately de-identified demonstration data may be used. Real patient information must not be committed to this repository or uploaded to public demo environments.

## Run Locally

    dotnet restore
    dotnet run

## Author

Anne Beth Andersen
