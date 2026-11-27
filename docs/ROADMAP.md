# Product Delivery Roadmap

Deliver one complete incident journey first, then prove the same investigation pipeline distinguishes a second cause before expanding providers or workloads. P0 is the initial product release; P1 follows once the core workflow is reliable.

| Milestone | Product outcome | Exit criteria |
| --- | --- | --- |
| M0 — Foundation | Reproducible product environment | Workspace, contracts, migrations, CI and safe bootstrap |
| M1 — Detect | Shop and Lab produce real incidents | Working checkout, bounded fault controls, measured failure, authenticated webhook, durable deduplication, incident list/detail |
| M2 — Understand | An engineer can inspect what happened | Bounded metrics/logs/traces, deployment SHA, evidence explorer and timeline |
| M3 — Investigate | Distinguish similar failures | Blind client regression and downstream degradation diagnoses, citations, uncertainty and negative tests |
| M4 — Remediate | A verified change becomes a draft PR | Allowlisted diff, isolated tests, explicit approval, idempotent GitHub integration |
| M5 — Explore | Usable product experience | Responsive incident room, diff review, accessible public replay |
| M6 — Release | Repeatable, trustworthy operation | Clean-clone run, green CI, failure-mode tests and observed end-to-end results |

## Implementation backlog

### M0 — Foundation
- Strict TypeScript workspace, shared Zod contracts and versioned migrations.
- Project/service mapping, live authentication, separate replay data boundary.
- Local configuration validation, health/readiness, dependency and secret scanning.

### M1 — Incident detection
- Build minimal Shop storefront and instrument checkout/payment services; generate healthy and failing traffic. Add protected lab run/reset, neutral metadata, TTL and private ground truth.
- Configure telemetry ingestion, Prometheus rules and Alertmanager webhooks.
- Transactional incident/event/outbox persistence, idempotent worker and reconciliation.
- Incident list/detail and lifecycle; property-based alert ordering/deduplication tests.

### M2 — Evidence and incident workspace
- Bounded Prometheus, Tempo and Loki adapters; immutable evidence snapshots and redaction.
- GitHub installation, deployed SHA mapping, compare API and candidate ranking.
- Chronological event timeline, source drilldown and explicit missing-source states.

### M3 — Investigation
- Provider-neutral model adapter, strict discriminated output, evidence validation and budget enforcement.
- Persist investigation attempts; expose SSE progress and retryable error states.
- Evaluate both P0 fault scenarios in randomized order without ground truth, plus missing evidence, unrelated deployment and poisoned source fixtures.

### M4 — Remediation
- Structured allowlisted config action for client regression; no unsupported patch for dependency degradation; immutable digest and path/content policy.
- Isolated regression verification, artifact capture, stale-base and policy checks.
- Role-based approval and rejection; separately authorized, reconciled draft PR creation.
- Negative tests for failed checks, stale approvals, duplicate requests and sandbox isolation.

### M5–M6 — Experience and release
- Product entry, Mission Control, Incident Room and Remediation Review.
- Capture sanitized, authentic replays of both scenarios; deploy a read-only experience separately from live operations.
- Validate responsive layouts, keyboard navigation, error states and accessibility.
- Run repeatable end-to-end scenario and operational failure tests; publish actual limitations.

## Next product increments

P1: isolated hosted live lab, third application-regression scenario, trace-derived dependency topology, manually deployed fix recovery verification, richer integration setup and evidence search. P2: additional incident scenarios and providers, multi-project operations, SLO intelligence, recurring incident patterns and regional expansion.

Scope decisions: prioritize genuine signals over visual extras; show unavailable sources rather than synthesizing evidence; restrict remediation to the checkout configuration and tests until broader policy and isolation are validated.
