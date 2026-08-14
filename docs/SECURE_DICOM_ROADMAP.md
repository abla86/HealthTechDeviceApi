# Secure DICOM Service Roadmap

This roadmap tracks implementation status for the medical-imaging development branch. Features are marked complete only after code and automated tests are present.

## Stage 1 - Architecture and testability

Status: implemented on `feature/secure-dicom-service`.

- Layered domain, application and infrastructure structure
- Repository abstraction
- Dependency injection
- Application-service unit tests
- Existing API integration tests retained

## Stage 2 - DICOM file handling

Status: in progress.

Implemented:

- `fo-dicom` integration
- Synthetic DICOM Part 10 file generation
- Generated Study, Series and SOP Instance UIDs
- Explicit synthetic patient identity
- `Patient Identity Removed = YES`
- De-identification method marker
- DICOM metadata endpoint
- DICOM file download endpoint using `application/dicom`
- Automated checks for the Part 10 `DICM` signature and synthetic metadata

Next:

- Parse uploaded DICOM files with strict size limits
- Return an allow-listed metadata view only
- Reject malformed or unsupported input safely
- Add tests for hostile and invalid file input

## Stage 3 - Persistence

Planned:

- SQL-backed metadata repository
- Entity Framework Core migrations
- No binary DICOM storage in the first persistence iteration
- Repository-level integration tests

## Stage 4 - Security controls

Planned:

- Authentication and authorization
- Audit events without patient-identifying data
- Request limits and safer error responses
- Security headers
- Threat model and abuse-case tests

## Stage 5 - Connectivity

Planned:

- DICOM networking in an isolated development configuration
- Explicit AE-title and endpoint configuration
- Secure transport design before any non-local connectivity

## Stage 6 - Deployment

Planned:

- Hardened container configuration
- Azure deployment
- Environment-specific configuration through secrets
- Deployment verification through CI/CD

## Data rule

Only synthetic, generated or appropriately de-identified demonstration data may be used. Real patient data must not be committed, uploaded to public demo environments or included in logs.
