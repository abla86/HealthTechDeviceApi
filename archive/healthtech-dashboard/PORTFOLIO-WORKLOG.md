# Portfolio Worklog

## 2026-08-26 — Documentation navigation

- Added a clear Start Here section linking scope, API documentation, local run instructions, source and the wider portfolio.
- Simplified the portfolio wording without changing implemented functionality.
- No application functionality was changed.

## 2026-08-26 — Baseline verification

- Added focused FastAPI API smoke/integration tests for health, listing, create/read/delete, validation and missing-device behaviour.
- Added GitHub Actions CI for Python compilation and the API test suite.
- Updated the README with the CI verification scope and explicit non-production status.

## 2026-08-26 — Frontend/API integration hardening

- Moved the frontend API base address out of JavaScript logic and into the page configuration (`data-api-base`).
- Added an explicit `/health` check before dashboard data is treated as available.
- Replaced `innerHTML` rendering of API-returned device values with DOM APIs and `textContent`.
- Preserved the existing dashboard features and API contract.
- Updated README documentation at the same time.

## 2026-08-26 — CORS security hardening

- Removed the unrestricted `allow_origins=["*"]` policy from the FastAPI API.
- Kept local development compatible by allowing `localhost` and `127.0.0.1` origins on arbitrary local ports.
- Added `ALLOWED_ORIGINS` configuration for explicit hosted frontend origins.
- Limited cross-origin methods to the API operations exposed by the application.
- Updated README and SECURITY documentation to reflect the configuration model.

## 2026-08-26 — Frontend API resilience

- Added an 8-second timeout to health and device requests using `AbortController`.
- Added response-shape validation for device IDs, names, types, statuses and battery ranges before rendering.
- Kept safe DOM rendering and the existing API contract unchanged.
- Added specific timeout/invalid-payload error handling for clearer failure states.

## Status

Demonstration project with automated backend baseline verification and hardened frontend/API integration. Clinical validation and production readiness are not claimed.
