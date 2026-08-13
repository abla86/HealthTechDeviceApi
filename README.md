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
- GitHub Actions continuous integration
- Docker image build and runtime verification in CI
- CodeQL security scanning
- Dependabot dependency monitoring
- Docker containerization
- Sample healthcare device data

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

The API includes an automated xUnit integration test suite.

Current status: **7/7 tests passing**.

Run tests:

    dotnet test .\HealthTechDeviceApi.Tests\HealthTechDeviceApi.Tests.csproj

## Continuous Integration

GitHub Actions automatically restores dependencies, builds the API in Release configuration and runs the automated test suite on pushes and pull requests to `main`.

The CI workflows have been successfully verified on GitHub.

Verified automation:
- .NET build and 7/7 automated tests
- Docker image build and container endpoint verification
- CodeQL static security analysis
- Dependabot monitoring for NuGet packages and GitHub Actions

## Docker

The API is containerized using a multi-stage Docker build with the official .NET 9 SDK and ASP.NET Core runtime images.

Build the image:

    docker build -t healthtech-device-api:latest .

Run the container:

    docker run --rm -p 8080:8080 healthtech-device-api:latest

Verified container endpoints:

- `GET /health` - healthy
- `GET /devices/stats` - verified

Verified sample statistics:

- Total devices: 3
- Online: 2
- Offline: 1
- Maintenance: 0

## Run Locally

    dotnet restore
    dotnet run

## Author

Anne Beth Andersen

