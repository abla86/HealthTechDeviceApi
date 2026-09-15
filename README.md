# HealthTech Dashboard

A full-stack demonstration project combining a FastAPI REST API with a responsive JavaScript monitoring dashboard and consolidated HealthTech control-center modules.

The application uses simulated healthcare-technology data and contains no patient or personal health information.

## Start here

| Need | Go to |
|---|---|
| Device monitoring | `frontend/` |
| Python data quality | `tools/python-data-quality/` |
| RAVENTA HMS + Security control center | `tools/raventa-control-center/` |
| Control API | `backend/raventa_control.py` (`/controls`) |
| API | `backend/` |
| Run locally | [Run locally](#run-locally) |

## Consolidated modules

### RAVENTA Control Center

The historical RAVENTA prototype contributed an HMS + Security control-record workflow. The reusable concept is now consolidated into this repository and exposed through the canonical FastAPI application.

The control API supports:

- control registration
- severity levels
- lifecycle status
- owner and due-date fields
- domain/status filtering
- create, read and patch operations
- deterministic synthetic seed data
- API tests for the lifecycle and missing-record behaviour

The lifecycle is represented as registration → risk → action → verification → closure. The API is a portfolio/demo component and does not claim regulatory compliance, clinical validation, production security, or suitability for operational safety decisions.

## Verification

[![CI](https://github.com/abla86/healthtech-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/abla86/healthtech-dashboard/actions/workflows/ci.yml)

The repository contains baseline backend verification for the device API and consolidated control API. CI status must be checked from the actual workflow run before claiming a passing build.

## Features

- FastAPI REST API
- Device monitoring dashboard
- API health endpoint
- Device status and battery metrics
- Responsive frontend
- Configurable CORS policy
- Pydantic validation
- Create, read and delete device API operations
- Interactive refresh and dashboard metrics
- OpenAPI / Swagger documentation
- Configurable frontend API endpoint
- Explicit API health check before dashboard data loading
- Safe text-based DOM rendering for returned device data
- Frontend request timeout and response-shape validation
- Consolidated HMS + Security control API
- RAVENTA-derived control-center module
- Python healthcare-data quality tooling

## Technology Stack

### Backend

- Python
- FastAPI
- Pydantic
- Uvicorn
- REST API
- Standard-library datetime/enum support for control records

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

Demonstration / learning project with backend verification coverage. Clinical validation and production readiness are not claimed.

## Portfolio boundary

HealthTech-related implementation belongs here. Workforce competence management remains a separate flagship where its domain-specific architecture warrants separation. Small generic engineering experiments belong in `AB-Engineering-Lab`.

## Consolidation

`RAVENTA` is now a legacy source repository. New HealthTech control-center work belongs here rather than in a second flagship repository.

## Change-control audit

See `docs/REPOSITORY-CHANGE-AUDIT-2026-08-28.md` for the repository change-control and traceability record.
