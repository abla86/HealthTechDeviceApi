# HealthTech Device API

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
- Sample healthcare device data

## Technology Stack

- C#
- .NET 9
- ASP.NET Core
- Minimal APIs
- OpenAPI
- REST
- xUnit
- Microsoft.AspNetCore.Mvc.Testing

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

## Run Locally

dotnet restore
dotnet run

## Run Tests

dotnet test .\HealthTechDeviceApi.Tests\HealthTechDeviceApi.Tests.csproj

Current automated test suite: 7 tests.

## Author

Anne Beth Andersen
