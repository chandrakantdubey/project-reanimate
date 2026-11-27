# Local Development

## Environment

Use a TypeScript monorepo with Node.js, pnpm and Docker Compose. Pin supported runtime and dependency versions and commit the lockfile. Kubernetes/Kind is optional for infrastructure-event correlation.

The local stack consists of the web application, API, dispatcher/worker, PostgreSQL, Redis, OpenTelemetry Collector, Prometheus, Alertmanager, Loki, Tempo, checkout and payment services, and an isolated verification runner.

## Workspace boundaries

| Area | Responsibility |
| --- | --- |
| Web | Product UI, replay rendering and API client |
| API | Authentication, input validation, durable state and action endpoints |
| Worker | Evidence retrieval, investigation and external-action reconciliation |
| Shared packages | Contracts, persistence, incident logic and provider adapters |
| Demo services | Instrumented checkout/payment workload and regression controls |
| Infrastructure | Local dependencies, telemetry pipelines and alert rules |
| Tests | Contract, property-based, integration and end-to-end scenarios |

Names and paths may follow the implemented workspace layout; boundaries should remain explicit.

## Configuration and bootstrap

- Document supported versions, resource prerequisites and exact startup commands.
- Provide an example environment configuration with variable names and safe defaults, never real secrets.
- Separate local application, database, telemetry, model and GitHub configuration; validate at process startup.
- Use local-only credentials for private smoke tests and fail closed on missing live credentials.
- Provide frozen-lockfile installation, database migrations, service health checks, deterministic seed/cleanup and a reproducible load generator.
- Public replay must start without model or GitHub credentials.

## Development loop

1. Start infrastructure and apply migrations.
2. Start API, worker, frontend and demo services.
3. Confirm readiness and telemetry ingestion.
4. Generate healthy checkout traffic, trigger the timeout regression and observe a persisted incident.
5. Investigate, verify a patch, review the approval boundary and reconcile draft PR creation using a dedicated demo repository.
6. Reset the isolated workload and repeat from a clean environment.

See [checkout runbook](runbooks/DEMO.md) for scenario details.

## Quality gates

Run formatting, lint, strict typecheck, unit/contract tests, property-based tests for incident identity and transitions, integration tests with PostgreSQL/Redis, provider contract tests, replay isolation checks and browser end-to-end tests. CI must scan dependencies and secrets and build all deliverables.

Exact runnable setup, migration, startup, test and cleanup commands belong here once implemented and verified.
