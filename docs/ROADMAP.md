# Build Plan & Milestones

Complete P0 before P1. Deliver vertical slices with observed test results and keep the end-to-end workflow runnable.

| ID | Deliverable | Exit criteria |
| --- | --- | --- |
| M0 | Engineering foundation | monorepo, reproducible install, CI and documented threat model |
| M1 | Telemetry + incident ingestion | injected checkout regression produces *real* Alertmanager webhook and one persisted incident |
| M2 | Forensic evidence and timeline | selected logs/traces/metrics + candidate deployment SHA with links and timestamp alignment |
| M3 | AI investigation | schema-validated, evidence-referenced RCA with missing-evidence branch; prompt injection tests |
| M4 | Patch and PR | isolated validation with visible tests; explicit approval; draft PR and idempotency checks |
| M5 | Replay and design polish | publicly accessible replay; functional timeline; responsive typography/accessibility |
| M6 | Release validation | clean-clone setup, public replay, green CI and end-to-end rehearsal |

## Sequenced implementation backlog

### Epic A: Platform and contracts (M0)
- A1. Monorepo wiring, TypeScript strict, lint/test/build scripts and lockfile.
- A2. Shared Zod schemas for alert/incident/evidence states with contract tests.
- A3. PostgreSQL migration and repository abstractions; unique alert episode key.
- A4. Public replay versus authenticated live mode separation, including API policy.
- A5. CI: formatting, typecheck, unit tests, audit and secret scan.
- A6. Local bootstrap script for env/secrets, health checks and deterministic cleanup.

### Epic B: Live signal (M1)
- B1. Implement checkout synthetic payment failure with env-configurable timeout and load generator.
- B2. OTel instrumentation, Prometheus metrics and trace export.
- B3. Alertmanager webhook authentication, validation and dedupe.
- B4. Outbox/queue scheduling and worker reconciliation; prove repeated webhooks create one incident.
- B5. Incident list/detail REST API and frontend incident list with live refresh.
- B6. E2E test: healthy -> high 5xx -> incident -> resolved (with unique episode ID).

### Epic C: Evidence graph (M2)
- C1. Query adapters with bounded time/result limits and defensive parsing.
- C2. Evidence snapshot schema, redaction and source hash/pointer.
- C3. GitHub App install and deployment correlation (workflow run, release, commit compare).
- C4. Incident timeline combining alert, deploy, traces, metric anomaly and investigation events.
- C5. UI causal graph service/deploy/evidence nodes with drilldown.

### Epic D: Evidence-backed AI (M3)
- D1. Tool-restricted investigator workflow (collect -> compare -> hypothesize -> challenge -> summarize).
- D2. Typed output schema with references and `insufficient_evidence` discriminant.
- D3. Evidence citation validator; reject invented sources and invalid source timestamps.
- D4. Prompt injection tests from malicious log or README content.
- D5. Cost caps, request timeouts, retry budgets, model/provider fallback and evaluation fixtures.

### Epic E: Safe remediation (M4)
- E1. Repository patch creation restricted to allowlisted paths and diff size.
- E2. Sandbox checkout pinned to SHA; disable network after dependencies prepared; no host mounts.
- E3. Test/lint/typecheck regression checks; capture exit codes, patch SHA and artifact references.
- E4. Approval API with authenticated user, optimistic version and audit event.
- E5. Draft PR against correct base SHA; idempotent branch naming and GitHub failure retries.
- E6. Regression tests for failed patch, approval bypass and duplicate triggers.

### Epic F: Experience and release (M5–M6)
- F1. Styled incident command center; fast transitions; no decorative fake logs, numbers or stats.
- F2. Read-only replay, clearly labelled, accessible without credentials.
- F3. Error/empty states, responsive layout, keyboard support and readable type scale.
- F4. Deploy, monitor, uptime testing, synthetic smoke test.
- F5. Verify the complete demo workflow and document observed results.

## Scope protection / decision gates

- **Signal pipeline:** if Alertmanager->DB not working, stop UI extras and fix the signal pipeline.
- **Evidence correlation:** if Tempo/Loki correlation is too unreliable, ship Prometheus + structured app logs first; explicitly mark absent traces as gaps.
- **Patch quality:** if AI patch quality is unsafe, limit to constrained config diff in checkout demo; don't advertise general code remediation.
- **Release freeze:** freeze features, fix defects, rehearse. No last-minute agent framework rewrite.

## Parallelizable streams

UI structure and diagrams can be built alongside observability; schema/API contracts must land before independent adapter work. AI evaluation fixtures can be authored before provider wiring. PR creation depends on verified patch policy and real approvals.
