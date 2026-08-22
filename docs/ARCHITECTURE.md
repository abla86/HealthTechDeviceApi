# Architecture

## System overview

HealthTech Device API is a C#/.NET REST API for healthcare-technology device management and controlled synthetic DICOM development.

```text
HTTP client
    |
    v
ASP.NET Core Minimal API
    |
    +--> validation / endpoint composition
    |
    v
Application services
    |
    +--> device business logic
    +--> DICOM generation/inspection
    |
    v
Infrastructure
    |
    +--> repository abstraction
    +--> in-memory persistence
    +--> fo-dicom
```

## Layering

### Domain

Contains device and DICOM-related models without direct HTTP concerns.

### Application

Contains business rules and service/repository abstractions.

### Infrastructure

Provides persistence and `fo-dicom` integration.

### API

Composes HTTP endpoints, validation, dependency injection and OpenAPI.

## Secure DICOM boundary

The current implementation deliberately uses synthetic/generated or appropriately de-identified demonstration data.

The inspection endpoint applies bounded request handling and allow-listed metadata extraction. Patient name and patient ID values are not returned by the inspection response.

The implementation does not claim to provide a complete clinical DICOM security architecture.

## CI/CD

GitHub Actions currently validates:

- .NET restore/build
- automated tests
- Docker image build/runtime
- CodeQL analysis
- Dependabot monitoring

## Current limitations

The repository does not currently claim:

- SQL persistence
- enterprise authentication/authorization
- Azure deployment
- Kubernetes
- Terraform/Bicep
- production networking
- full threat modelling
- production observability

Those boundaries are explicit so the repository does not overstate its capabilities.
