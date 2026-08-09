# HealthTech Device API

REST API for managing healthcare technology devices, built with C# and ASP.NET Core.

## Features

- RESTful device management
- Create, read, update and delete operations
- Health-check endpoint
- HTTP status handling
- Input validation
- JSON responses
- OpenAPI support
- Sample healthcare device data

## Technology Stack

- C#
- .NET 9
- ASP.NET Core
- Minimal APIs
- OpenAPI
- REST

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | / | API information |
| GET | /health | Health check |
| GET | /devices | List all devices |
| GET | /devices/{id} | Get device by ID |
| POST | /devices | Create device |
| PUT | /devices/{id} | Update device |
| DELETE | /devices/{id} | Delete device |

## Example Device

```json
{
  "id": 1,
  "name": "Blood Pressure Monitor",
  "type": "Vital Signs",
  "status": "Online",
  "location": "Home Care"
}
```

## Run Locally

```powershell
dotnet restore
dotnet run
```

The API starts on the local address shown in the terminal.

## Author

Anne Beth Andersen
