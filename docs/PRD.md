# Product Requirements — Project Reanimate

**Primary personas:** on-call SRE, platform engineer, backend engineer, incident lab operator, public replay viewer

## Product vision

Reanimate is the investigation and remediation layer above existing monitoring tools. It reduces context switching during incidents by connecting operational signals to source changes and turning a diagnosis into a reviewable engineering action.

## Users

| Persona | Primary need |
| --- | --- |
| On-call engineer | Rapid triage, credible evidence and a clear next action |
| Platform/SRE engineer | Reliable alert processing, reproducibility and safe permissions |
| Service owner | Understand a suspect deployment and review a tested patch |
| Reviewer | Inspect validation, approval and audit history |
| Lab operator | Trigger and reset isolated workload failures, then inspect independent investigations |
| Replay viewer | Explore a genuine incident without connecting infrastructure |

## Product promise

A deterministic alert becomes a traceable investigation with sourced hypotheses and a policy-checked, human-approved, verifiable remediation PR. The product improves investigation time without pretending that a language model is an infallible production operator.

## Jobs to be done

1. **Triage:** When an incident fires, show what failed, how severe it is, where it is, and when it started.
2. **Correlate:** Show service traces, errors, signals, deployments and suspect commits on one timeline.
3. **Explain:** Present ranked root-cause hypotheses with exact supporting and contradicting evidence.
4. **Recover:** Offer a minimally scoped patch with safety checks, isolated test results and a draft PR after human approval.
5. **Audit:** Let reviewers reconstruct all inputs, model decisions, approvals and external side effects.

## MVP user journey

- A viewer enters public Replay Mode without credentials (read-only, labelled as a replay).
- They can inspect authentic recordings of client regression and dependency degradation; the live environment uses the same presentation contracts but separate data access.
- In protected Incident Lab, an operator places a synthetic order, observes healthy requests, then starts one of two allowlisted fault scenarios. The investigator is blind to scenario identity and ground truth.
- In authenticated Live Mode, an Alertmanager `firing` webhook creates exactly one incident per alert episode; repeats are deduplicated.
- An investigation links error metrics, selected trace/log snippets and relevant GitHub deployment evidence, including unchanged revision where applicable.
- Evidence references open exact timestamps and corresponding source locations.
- A structured hypothesis distinguishes observed facts from inference; uncertainty is visible.
- For a client regression, a proposed 100 ms -> 800 ms timeout patch runs in an isolated verification environment; tests produce downloadable artifacts.
- For downstream degradation, the investigation explains the distinct cause and withholds unsupported code remediation.
- An authorized operator approves creation of a **draft PR**, including a summary, evidence and checks; no merging or deployment.
- Users can follow progress via live server-sent events and inspect a persistent audit trail.

## In scope / out of scope

| In MVP | Future scope |
| --- | --- |
| Reanimate Shop, protected Incident Lab, two distinct blind fault scenarios | Public live lab, additional workloads and broad incident coverage |
| One local Kind/Compose deployment and one GitHub repo | Multi-region multi-cloud control plane |
| Alertmanager + OTel metrics/traces/logs evidence | Autonomous multi-tool remediation execution |
| Deterministic correlation + bounded LLM hypothesis | Unconstrained free-form autonomous agents |
| Structured allowlisted configuration patch for one scenario | Production `kubectl` write actions |
| Isolated validation, human-approved draft PR | Automatic merge, deployment, rollback |
| Public read-only replay + private live mode | Full enterprise SSO, billing, tenancy features |

## Priorities / functional requirements

### P0 — core product

- **FR-01 Ingestion:** API validates an authenticated Alertmanager webhook, size-limits payload, normalizes alert identity and rejects malformed requests.
- **FR-02 Deduplication:** At-least-once repeated events for same alert episode must not create duplicate incidents or investigations.
- **FR-03 Lifecycle:** Incident state transitions are validated and persisted; resolved alerts close active incidents but history remains searchable.
- **FR-04 Evidence:** Investigation stores source URI, bounded query, UTC time range, capture timestamp, redaction metadata and stable ID for every collected signal.
- **FR-05 GitHub correlation:** Deployment SHA and timestamp are inspected within a configurable 30-minute window, with multiple candidate changes preserved.
- **FR-06 AI analysis:** Model returns schema-validated hypothesis objects, a heuristic confidence label, supporting/contradicting evidence IDs and an explicit `insufficient_evidence` outcome.
- **FR-07 Verification:** Proposed patch must pass allowlisted-path policy and isolated build/tests before `awaiting_approval` state.
- **FR-08 Approval:** An authorized human approves the exact verified diff, base SHA and policy version, then separately requests draft-PR creation; no background agent may bypass this step.
- **FR-09 UX:** The incident workspace renders accurate state and evidence, with loading/error states, keyboard access and replay labels.
- **FR-10 Replay:** Public replay uses captured data, no privileged connections, and visible indication that it is a replay.
- **FR-11 Audit:** Every critical state transition and external action records who/what caused it and its correlation ID.

- **FR-12 Progress:** Persist investigation events, support SSE resume and polling fallback; expose failed and retryable states.
- **FR-13 Integration health:** Show connection availability, last successful collection and source-specific errors without exposing secrets.
- **FR-14 Reference workload:** Provide a working synthetic storefront, checkout/payment HTTP services and bounded traffic generation; emit genuine telemetry without real payments or PII.
- **FR-15 Incident Lab:** Authorized operators can start and reset one isolated run at a time using predefined fault actions, with health checks, duration limits and cleanup.
- **FR-16 Blind diagnosis:** Use one investigation pipeline for two similar-symptom scenarios; prohibit ground truth, scenario labels and evaluation oracle from investigator inputs. Distinguish client regression from downstream degradation using evidence.
- **FR-17 Remediation eligibility:** Only materialize structured allowlisted config actions supported by observed deployed changes and independent regression checks; withhold patch for dependency degradation or insufficient evidence.
- **FR-18 Replay coverage:** Provide publicly accessible recordings of both actual incident journeys.

### P1 — product expansion

- Safely hosted interactive lab with isolated sessions, quotas and no anonymous privileged operations.
- Additional application-code regression scenario.
- OpenTelemetry service topology and dependency graph using real traces.
- Verified recovery signal after an approved fix is manually deployed.
- Basic policy editor and repository installation UI.

### P2 — future scope

Multi-tenant RBAC, several providers/cluster integrations, incident search, SLO budgets, cross-region handling, incident learning, change replay and anomaly detection.

## Nonfunctional requirements (targets, not current claims)

| Area | MVP target |
| --- | --- |
| Ingestion | p95 under 300 ms excluding DB cold start |
| Alert-to-visible | under 15 seconds in healthy local stack |
| Investigation | 60–120 seconds for either P0 scenario, with timeout and partial result |
| Availability | survive worker restart without losing persisted incident |
| Idempotency | zero duplicate incidents/PRs under 10 webhook replays |
| Security | zero plaintext secrets in repo or model context |
| Cost | maximum 2 analysis calls plus 1 schema-repair call per incident; budget and token metering |
| Observability | logs/metrics/traces for API, worker, webhook, AI and PR creation |
| Accessibility | keyboard navigation and WCAG AA contrast in core workflows |

## Product success metrics

- **Time to first useful hypothesis:** detection -> evidence-backed first hypothesis.
- **Evidence coverage:** supporting IDs linked to persisted, accessible signals.
- **Fix success:** validation pass plus separate post-deploy recovery verification.
- **Abstention quality:** correct insufficient-evidence outcomes on missing-source fixtures and unsupported-claim rate.
- **Side-effect safety:** zero unapproved PR creations and production mutations.

## Product boundaries

Live operations are private; replay is public and read-only. A healthy system does not require an LLM to ingest or display alerts. A rejected or failed patch cannot create a PR. The MVP does not automatically merge, deploy, roll back or mutate clusters.

## Assumptions and constraints

- Reanimate Shop uses synthetic orders/payments and does **not** touch production. See [Incident Lab](INCIDENT_LAB.md) for workload, scenario and blind evaluation requirements.
- Live data can be incomplete; model must handle missing logs/traces rather than fill gaps.
- GitHub API and LLM rate limits exist; retries and circuit breakers required.
- A successful test suite does **not** prove a production fix is correct; UI must preserve this distinction.
- Implementation priority is defined by [ROADMAP](ROADMAP.md).
