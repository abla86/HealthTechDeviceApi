# HealthTech Device API

[![.NET CI](https://github.com/abla86/HealthTechDeviceApi/actions/workflows/dotnet-ci.yml/badge.svg)](https://github.com/abla86/HealthTechDeviceApi/actions/workflows/dotnet-ci.yml)

REST API for managing healthcare technology devices, built with C# and ASP.NET Core.

## Features

- RESTful CRUD operations
- Health-check endpoint
- Device filtering by status, type and location
- Device statistics endpoint
- Input validation
- Normalized device status values
- HTTP status handling
- JSON responses
- OpenAPI support
- Automated API tests with xUnit
- Unit tests for application service behaviour
- Repository abstraction and dependency injection
- Separation of domain, application and infrastructure concerns
- GitHub Actions continuous integration
- Docker image build and runtime verification in CI
- CodeQL security scanning
- Dependabot dependency monitoring
- Docker containerization
- Sample healthcare device data

## Architecture

The current development branch introduces a layered structure as the foundation for the secure medical-imaging track:

- `Domain` - device models and API contracts
- `Application` - business logic and repository abstraction
- `Infrastructure` - in-memory repository implementation
- `Program.cs` - HTTP endpoint composition and dependency injection

This separation reduces coupling between HTTP endpoints, business rules and persistence and prepares the project for later SQL persistence and DICOM-specific services.

## Secure DICOM development track

A staged secure medical-imaging implementation is under development. Planned functionality is documented separately and is not presented as complete until it is implemented and tested.

Planned stages include:

1. SOLID architecture and test coverage
2. DICOM metadata handling using synthetic/de-identified data
3. SQL persistence
4. authentication, authorization and audit controls
5. threat modelling and vulnerability assessment
6. secure connectivity and container hardening
7. cloud deployment

See `docs/SECURE_DICOM_ROADMAP.md` and `SECURITY.md` for the implementation and security constraints.

## Technology Stack

- C#
- .NET 9
- ASP.NET Core
- Minimal APIs
- REST
- OpenAPI
- xUnit
- Microsoft.AspNetCore.Mvc.Testing
- GitHub Actions
- Docker

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | / | API information |
| GET | /health | Health check |
| GET | /devices | List devices |
| GET | /devices?status=Online | Filter by status |
| GET | /devices?type=Vital%20Signs | Filter by type |
| GET | /devices?location=Home%20Care | Filter by location |
| GET | /devices/stats | Device statistics |
| GET | /devices/{id} | Get device by ID |
| POST | /devices | Create device |
| PUT | /devices/{id} | Update device |
| DELETE | /devices/{id} | Delete device |

## Automated Testing

The API includes xUnit integration tests and application-service unit tests.

Run tests:

    dotnet test .\HealthTechDeviceApi.Tests\HealthTechDeviceApi.Tests.csproj

## Continuous Integration

GitHub Actions restores dependencies, builds the API in Release configuration and runs the automated test suite on pushes and pull requests to `main`.

Verified automation on the main branch includes:

- .NET build and automated tests
- Docker image build and container endpoint verification
- CodeQL static security analysis
- Dependabot monitoring for NuGet packages and GitHub Actions

## Docker

The API is containerized using a multi-stage Docker build with the official .NET 9 SDK and ASP.NET Core runtime images.

Build the image:

    docker build -t healthtech-device-api:latest .

Run the container:

    docker run --rm -p 8080:8080 healthtech-device-api:latest

## Run Locally

    dotnet restore
    dotnet run

## Author

Anne Beth Andersen
