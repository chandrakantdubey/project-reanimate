# Project Reanimate — Kiro Build Brief

**State: design and direction only. No application scaffold has been committed on the current branch. Kiro will design, generate, implement, and validate the actual system.**

> Autonomous incident investigation. Human-approved recovery.

Project Reanimate is an AI-powered reliability engineering platform that connects Kubernetes, OpenTelemetry, GitHub and LLM-assisted investigation. The goal is to detect production-like failures, reconstruct an evidence-backed root cause, and produce a tested remediation pull request without granting an AI agent production write privileges.

## Ownership boundary

**This repository provides direction, not starter code.** The existing `docs/` material describes the desired product, constraints and acceptance criteria; it is not evidence of working integrations. There should be no hand-authored application code, `.kiro/` workspace, infrastructure configuration, dependency manifest, workflow or scripts before Kiro starts.

**Kiro must create `.kiro/` itself**, including any specs, steering, agents, hooks or task plans it decides are appropriate. Kiro must also create every application, test, package, CI and deployment artifact. The eventual hackathon submission requires `.kiro/` at the repository root; this initial direction-only state intentionally does not contain it.

## The user journey to build

1. Operate a real, instrumented checkout and payment demo in a local, isolated environment.
2. Inject a reproducible regression: checkout payment-client timeout changes from 800 ms to 100 ms while downstream latency is approximately 300 ms.
3. Detect increased HTTP 5xx rates through metrics and a real alert; deduplicate repeat webhook deliveries into a single incident.
4. Correlate alert times, spans, bounded log evidence and GitHub deployment/commit history into a navigable incident timeline.
5. Produce structured root-cause hypotheses with valid evidence references, alternatives, confidence limitations and an explicit insufficient-evidence outcome.
6. Propose an allowlisted code/config patch, run it in an isolated no-secrets sandbox, and record the tests and policy checks.
7. After explicit human approval, open an idempotent **draft** GitHub PR. Never auto-merge, auto-deploy or write to a production cluster.
8. Offer a **clearly labelled, public read-only replay** of an authentic recorded incident for judges without exposing integrations or secrets.

## Architectural direction (not existing implementation)

- TypeScript monorepo; Next.js web UI, Fastify API, worker; shared typed contracts.
- PostgreSQL as source of truth; Redis/BullMQ for dispatch, transactional outbox for durable scheduling.
- OpenTelemetry Collector, Prometheus, Loki, Tempo, Alertmanager for telemetry and alert delivery.
- GitHub App with least-privilege repository permissions and a provider-agnostic LLM adapter.
- Docker Compose first for local repeatability; Kubernetes/Kind integration where it adds demonstrable value.
- Distinguish public replay, private live UI, ingest endpoints and isolated patch execution as separate trust boundaries.

The rationale and alternatives are in the architecture decisions. Kiro should challenge or refine choices in its own design phase, documenting consequential changes rather than silently diverging.

## Non-negotiable engineering requirements

- Deterministic alert episode identity, idempotency, state transitions and retry/reconciliation behavior.
- Never present simulated or replay data as live production data.
- Evidence must be linkable, timestamped, bounded and redacted; untrusted log/repository text cannot override instructions.
- LLM output is an untrusted proposal; every cited evidence ID must be validated.
- All model/observability/GitHub calls have explicit budgets, timeouts and actionable failure states.
- Test failures, missing approval, policy violations and sandbox errors must block PR creation.
- No autonomous deployments, Kubernetes mutations, or secret-bearing patch runners.
- Automated unit, integration and real end-to-end acceptance tests; honest validation status.

## Read the blueprint in this order

1. [Kiro handoff and first prompt](docs/KIRO_HANDOFF.md)
2. [Product requirements](docs/PRD.md) and [acceptance criteria](docs/ACCEPTANCE.md)
3. [System architecture](docs/ARCHITECTURE.md), [data model](docs/DATA_MODEL.md) and [API contract](docs/API.md)
4. [AI investigation](docs/AI_ENGINE.md), [security](docs/SECURITY.md), [capacity and operations](docs/CAPACITY_AND_OPERATIONS.md)
5. [Mission Control interface](docs/design/INTERFACE.md), [demo scenario](docs/runbooks/DEMO.md)
6. [Roadmap](docs/ROADMAP.md), [issue backlog](docs/GITHUB_ISSUES.md), [architecture decisions](docs/adr/)

## Definition of done

Not 'files generated'. Success means a clean clone starts the stack; a healthy service develops a measured failure; a genuine alert creates exactly one durable incident; investigators can inspect real supporting evidence; an approved, sandbox-validated fix opens exactly one draft PR; and a read-only replay is independently accessible. The checklist lives in [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md).

## Kiro working agreement

Start from [docs/KIRO_HANDOFF.md](docs/KIRO_HANDOFF.md). Kiro should create and own `.kiro/`, implementation, tests, infrastructure, scripts and CI in subsequent commits. Review specs and architecture before code, implement vertical slices with observed test results, preserve the documented safety boundaries, and record actual Kiro contributions in [docs/KIRO_USAGE.md](docs/KIRO_USAGE.md).

License: [MIT](LICENSE).