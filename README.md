# HealthTech Dashboard

A full-stack demonstration project combining a FastAPI REST API with a responsive JavaScript monitoring dashboard and consolidated HealthTech control-center modules.

The application uses simulated healthcare-technology data and contains no patient or personal health information.

## Start here

| Need | Go to |
|---|---|
| Device monitoring | `frontend/` |
| Python data quality | `tools/python-data-quality/` |
| RAVENTA HMS + Security control center | `tools/raventa-control-center/` |
| API | `backend/` |
| Run locally | [Run locally](#run-locally) |

## Consolidated modules

### RAVENTA Control Center

The historical RAVENTA prototype contributed a useful HMS + Security control-center concept. Its reusable implementation is now preserved under `tools/raventa-control-center/` rather than maintained as a separate flagship repository.

The module covers control registration, severity, lifecycle status, KPI overview and domain filtering. The lifecycle is represented as registration → risk → action → verification → closure.

This is a portfolio/demo component. It does not claim regulatory compliance, clinical validation, production security, or suitability for operational safety decisions.

## Verification

[![CI](https://github.com/abla86/healthtech-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/abla86/healthtech-dashboard/actions/workflows/ci.yml)

The baseline CI compiles the Python backend and runs API smoke/integration checks covering health, device listing, create/read/delete behaviour, validation and missing-device handling.

## Features

- FastAPI REST API
- Device monitoring dashboard
- API health endpoint
- Device status and battery metrics
- Responsive frontend
- Configurable CORS policy
- Pydantic validation
- Create, read and delete API operations
- Interactive refresh and dashboard metrics
- OpenAPI / Swagger documentation
- Configurable frontend API endpoint
- Explicit API health check before dashboard data loading
- Safe text-based DOM rendering for returned device data
- Frontend request timeout and response-shape validation
- Consolidated HMS + Security control-center demonstration
- Python healthcare-data quality tooling

## Technology Stack

### Backend

- Python
- FastAPI
- Pydantic
- Uvicorn
- REST API

### Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API
- Responsive CSS
- React/Vite for the consolidated RAVENTA module

## Data safety

Use simulated or non-sensitive demonstration data only. Do not commit patient or other personal health information to this public repository.

## Status

Demonstration / learning project with automated backend baseline verification. Clinical validation and production readiness are not claimed.

## Portfolio boundary

HealthTech-related implementation belongs here. Workforce competence management remains a separate flagship where its domain-specific architecture warrants separation. Small generic engineering experiments belong in `AB-Engineering-Lab`.

## Change-control audit

See `docs/REPOSITORY-CHANGE-AUDIT-2026-08-28.md` for the repository change-control and traceability record.
