# Project Reanimate

**From production alert to verified fix.**

Reanimate is an AI-powered incident investigation and remediation platform for software engineering and reliability teams. It connects operational telemetry with deployment history and source code, helping engineers understand what broke, why it broke and what change could resolve it — without handing production control to an AI agent.

## Why Reanimate?

An alert tells you that something is wrong, not necessarily why. Engineers must navigate dashboards, traces, logs and repositories, reconstruct a timeline, test hypotheses and translate the diagnosis into a safe change.

Reanimate brings that work into a single evidence-driven incident workspace. Every diagnosis can be challenged, every proposed change can be inspected, and every external write requires explicit authorization.

## Product capabilities

| Capability | Experience |
| --- | --- |
| Incident detection | Turn real alerts into durable, deduplicated incident records. |
| Mission Control | Understand affected services, active incidents, severity and integration health. |
| Incident timeline | Connect errors, traces, logs and deployments in chronological order. |
| Evidence explorer | Inspect bounded source excerpts, timestamps, trace identifiers and commit diffs. |
| AI investigation | Review ranked hypotheses, supporting and contradictory evidence, and uncertainty. |
| Remediation review | Inspect a minimal patch, policy checks and isolated test results. |
| GitHub integration | Open a draft pull request after an authorized engineer approves the exact verified change. |
| Incident replay | Explore a recorded investigation in a public read-only environment. |

## From failure to recovery

```mermaid
flowchart LR
    A[Service failure] --> B[Alert]
    B --> C[Incident]
    C --> D[Evidence]
    D --> E[Hypotheses]
    E --> F[Patch proposal]
    F --> G[Isolated tests]
    G --> H{Human approval}
    H -->|Approved| I[Draft pull request]
    H -->|Rejected| J[Review or revise]
    I -. Manual deployment .-> K[Recovery monitoring]
```

Reanimate separates observed facts from AI interpretation, test validation from service recovery, and public replay from private live operations. It does not automatically merge code, deploy changes or mutate production clusters.

## Explore a checkout incident

A checkout service calls a payment service with approximately 300 ms latency. A deployment reduces its timeout from 800 ms to 100 ms, causing HTTP 5xx responses.

The incident workspace connects the error-rate increase to downstream timeout traces, application logs and the deployed commit. The investigation proposes restoring the timeout, validates the correction with regression tests and presents the verified diff for human approval. An approved change becomes a draft GitHub PR.

If evidence is missing or validation fails, Reanimate displays the limitation instead of claiming success.

## Architecture

| Layer | Technology |
| --- | --- |
| Product interface | Next.js, TypeScript |
| Control API | Fastify, Zod |
| Durable state | PostgreSQL |
| Asynchronous investigation | Redis, BullMQ, transactional outbox |
| Telemetry | OpenTelemetry, Prometheus, Loki, Tempo |
| Alert ingestion | Alertmanager |
| Source and deployment context | GitHub App |
| AI reasoning | Provider-neutral structured-output adapter |
| Validation | Isolated, credential-free patch runner |
| Local infrastructure | Docker Compose; optional Kubernetes/Kind |

Reanimate operates outside the application request path. The observability backends remain the source of raw telemetry; PostgreSQL stores incident state and bounded evidence snapshots.

## Documentation

| Area | Document |
| --- | --- |
| Product | [Requirements](docs/PRD.md), [Interface design](docs/design/INTERFACE.md) |
| Engineering | [Architecture](docs/ARCHITECTURE.md), [Data model](docs/DATA_MODEL.md), [API contract](docs/API.md) |
| Intelligence | [Investigation engine](docs/AI_ENGINE.md) |
| Trust and reliability | [Security](docs/SECURITY.md), [Capacity and operations](docs/CAPACITY_AND_OPERATIONS.md) |
| Development | [Local environment](docs/LOCAL_DEVELOPMENT.md), [Roadmap](docs/ROADMAP.md) |
| Validation | [Acceptance criteria](docs/ACCEPTANCE.md), [Checkout incident runbook](docs/runbooks/DEMO.md) |

Architecture decisions: [Control plane](docs/adr/0001-control-plane.md) · [Durable scheduling](docs/adr/0002-outbox.md) · [Human approval](docs/adr/0003-human-approval.md).

## Status

In development. The capabilities above describe the product scope; the repository currently contains the product and engineering specifications.

## License

[MIT](LICENSE)
