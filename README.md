# Project Reanimate

> Autonomous incident investigation. Human-approved recovery.

Project Reanimate is an AI-powered reliability engineering platform that connects application telemetry, infrastructure events and source code to turn alerts into evidence-backed investigations and verified remediation proposals.

## Core workflow

1. Detect a service failure through Prometheus and Alertmanager.
2. Persist and deduplicate the incident.
3. Correlate metrics, logs, traces and GitHub deployment history.
4. Generate ranked root-cause hypotheses with evidence, alternatives and explicit uncertainty.
5. Propose a minimally scoped patch and validate it in an isolated sandbox.
6. Obtain explicit human approval and open an idempotent draft pull request.

The platform never automatically merges, deploys or modifies production infrastructure.

## Architecture

| Component | Technology |
| --- | --- |
| Web application | Next.js, TypeScript |
| Control API | Fastify |
| Persistence | PostgreSQL |
| Background processing | Redis, BullMQ, transactional outbox |
| Observability | OpenTelemetry, Prometheus, Alertmanager, Loki, Tempo |
| Source control | GitHub App |
| Investigation | Provider-neutral LLM adapter, structured output |
| Local environment | Docker Compose, optional Kubernetes/Kind |

## MVP scenario

An instrumented checkout service calls a payment service with approximately 300 ms latency. A deployment changes the checkout timeout from 800 ms to 100 ms, causing measurable HTTP 5xx failures. Reanimate detects the incident, correlates telemetry with the deployment, proposes a timeout correction, runs regression tests and opens a draft PR after approval.

A public read-only replay provides access to an authentic recorded investigation without exposing private integrations or credentials.

## Documentation

| Document | Purpose |
| --- | --- |
| [Product requirements](docs/PRD.md) | Scope, workflows and functional requirements |
| [Architecture](docs/ARCHITECTURE.md) | Components, data flow, lifecycle and resilience |
| [Data model](docs/DATA_MODEL.md) | Persistence, consistency and retention |
| [API contract](docs/API.md) | Endpoints, authentication and payloads |
| [AI investigation](docs/AI_ENGINE.md) | Evidence collection, reasoning and evaluation |
| [Security](docs/SECURITY.md) | Threat model, isolation and approval policy |
| [Capacity and operations](docs/CAPACITY_AND_OPERATIONS.md) | Resource budgets, scaling and recovery |
| [Interface design](docs/design/INTERFACE.md) | Mission Control and incident review |
| [Local development](docs/LOCAL_DEVELOPMENT.md) | Development environment requirements |
| [Roadmap](docs/ROADMAP.md) | Ordered implementation milestones |
| [Acceptance criteria](docs/ACCEPTANCE.md) | Testable release requirements |
| [Demo runbook](docs/runbooks/DEMO.md) | Reproducible end-to-end scenario |

### Architecture decisions

- [Modular control plane](docs/adr/0001-control-plane.md)
- [Transactional outbox](docs/adr/0002-outbox.md)
- [Human-approved remediation](docs/adr/0003-human-approval.md)

## Development status

The documents describe the intended implementation and acceptance criteria. They are not claims of currently available features.

## License

[MIT](LICENSE)
