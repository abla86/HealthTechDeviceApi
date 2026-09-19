# Security Policy

This repository is a demonstration project using simulated healthcare-technology device data. It must not be used with real patient information or production clinical data.

## Do not commit

- patient or personal health information
- credentials, tokens or secrets
- production connection strings
- private keys

## API security baseline

- Cross-origin requests are not unrestricted by default.
- Local browser development is limited to `localhost` and `127.0.0.1` origins.
- Hosted frontend origins must be explicitly configured through the API's `ALLOWED_ORIGINS` environment variable.
- Credentialed cross-origin requests are disabled.
- Cross-origin HTTP methods are limited to the operations exposed by the demonstration API.

## Scope

The project demonstrates API and dashboard development. It is not a production medical device platform and does not claim clinical safety, regulatory compliance or production security certification.

## Reporting

Please report suspected security issues privately to the repository owner rather than publishing sensitive details in a public issue.
