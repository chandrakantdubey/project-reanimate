# Product Requirements — Project Reanimate

**Version:** v0.1 / 2026-11-19  
**Status:** Approved direction, implementation in progress  
**Primary personas:** on-call SRE, platform engineer, backend engineer, hackathon judge

## Product promise

A deterministic alert becomes a traceable investigation with sourced hypotheses and a policy-checked, human-approved, verifiable remediation PR. The product improves investigation time without pretending that a language model is an infallible production operator.

## Jobs to be done

1. **Triage:** When an incident fires, show what failed, how severe it is, where it is, and when it started.
2. **Correlate:** Show service traces, errors, signals, deployments and suspect commits on one timeline.
3. **Explain:** Present ranked root-cause hypotheses with exact supporting and contradicting evidence.
4. **Recover:** Offer a minimally scoped patch with safety checks, isolated test results and a draft PR after human approval.
5. **Audit:** Let reviewers reconstruct all inputs, model decisions, approvals and external side effects.

## MVP user journey

- Operator enters public Replay Mode without credentials (read-only, labelled as a replay).
- They can inspect an authentic recorded checkout regression; real demo cluster uses the same API schema.
- A live Alertmanager `firing` webhook creates exactly one incident per alert episode; repeats are deduplicated.
- An investigation links error metrics, selected trace/log snippets and a recent GitHub deployment.
- Evidence references open exact timestamps and corresponding source locations.
- A structured hypothesis distinguishes observed facts from inference; uncertainty is visible.
- A proposed 100 ms -> 800 ms timeout patch runs in an isolated verification environment; tests produce downloadable artifacts.
- An authorized operator approves creation of a **draft PR**, including a summary, evidence and checks; no merging or deployment.
- Users can follow progress via live server-sent events and inspect a persistent audit trail.

## In scope / out of scope

| In MVP | Later, not for first deadline |
| --- | --- |
| One checkout/service outage, reproducible failure injection | Arbitrary multi-service incident coverage |
| One local Kind/Compose deployment and one GitHub repo | Multi-region multi-cloud control plane |
| Alertmanager + OTel metrics/traces/logs evidence | Autonomous multi-tool remediation execution |
| Deterministic correlation + bounded LLM hypothesis | Unconstrained free-form autonomous agents |
| Whitelisted configuration/code patch | Production `kubectl` write actions |
| Isolated validation, human-approved draft PR | Automatic merge, deployment, rollback |
| Public read-only judge replay + private live mode | Full enterprise SSO, billing, tenancy features |

## Priorities / functional requirements

### P0 — required for compelling demo

- **FR-01 Ingestion:** API validates an authenticated Alertmanager webhook, size-limits payload, normalizes alert identity and rejects malformed requests.
- **FR-02 Deduplication:** At-least-once repeated events for same alert episode must not create duplicate incidents or investigations.
- **FR-03 Lifecycle:** Incident state transitions are validated and persisted; resolved alerts close active incidents but history remains searchable.
- **FR-04 Evidence:** Investigation stores source URI, bounded query, UTC time range, capture timestamp, redaction metadata and stable ID for every collected signal.
- **FR-05 GitHub correlation:** Deployment SHA and timestamp are inspected within a configurable 30-minute window, with multiple candidate changes preserved.
- **FR-06 AI analysis:** Model returns schema-validated hypothesis objects, a confidence range, supporting/contradicting evidence IDs and an explicit `insufficient_evidence` outcome.
- **FR-07 Verification:** Proposed patch must pass allowlisted-path policy and isolated build/tests before `ready_for_review` state.
- **FR-08 Approval:** An authenticated human reviews full diff and initiates draft-PR creation; no background agent may bypass this step.
- **FR-09 UX:** The incident workspace renders accurate state and evidence, with loading/error states, keyboard access and replay labels.
- **FR-10 Replay:** Public judge replay uses captured data, no privileged connections, and visible indication that it is a replay.
- **FR-11 Audit:** Every critical state transition and external action records who/what caused it and its correlation ID.
- **FR-12 Kiro:** Tasks, technical design, steering and hooks are committed at project root; meaningful development uses Kiro.

### P1 — if P0 is complete early

- OpenTelemetry service topology and dependency graph using real traces.
- WebSocket/SSE partial investigation updates.
- Verified recovery signal after an approved fix is manually deployed.
- Basic policy editor and repository installation UI.

### P2 — post-hackathon

Multi-tenant RBAC, several providers/cluster integrations, incident search, SLO budgets, cross-region handling, risk-based auto-approval, incident learning, change replay and anomaly detection.

## Nonfunctional requirements (targets, not current claims)

| Area | MVP target |
| --- | --- |
| Ingestion | p95 under 300 ms excluding DB cold start |
| Alert-to-visible | under 15 seconds in healthy local stack |
| Investigation | 60–120 seconds for the preset fixture, with timeout and partial result |
| Availability | survive worker restart without losing persisted incident |
| Idempotency | zero duplicate incidents/PRs under 10 webhook replays |
| Security | zero plaintext secrets in repo or model context |
| Cost | default LLM cap of 2 analyses per incident; budget and token metering |
| Observability | logs/metrics/traces for API, worker, webhook, AI and PR creation |
| Accessibility | keyboard navigation and WCAG AA contrast in core workflows |

## Metrics

- **Time to first useful hypothesis:** detection -> evidence-backed first hypothesis.
- **Evidence coverage:** supporting IDs linked to persisted, accessible signals.
- **Fix success:** validation pass plus separate post-deploy recovery verification.
- **False confidence:** investigations that return insufficient evidence rather than unsupported certainty.
- **Side-effect safety:** zero unapproved PR creations and production mutations.

## Assumptions and constraints

- Demo uses a synthetic payment service and does **not** touch production.
- Live data can be incomplete; model must handle missing logs/traces rather than fill gaps.
- GitHub API and LLM rate limits exist; retries and circuit breakers required.
- A successful test suite does **not** prove a production fix is correct; UI must preserve this distinction.
- Date-specific implementation priority is defined by [ROADMAP](ROADMAP.md).
