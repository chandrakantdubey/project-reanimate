# Kiro Handoff — Build Project Reanimate from a Direction-Only Repository

## Important

Everything currently checked into this repository (except the license) is a product/engineering **brief**, not an implementation. Do not infer that any source tree, database migration, compose file, CI workflow, `.kiro` specification or service already exists. You, Kiro, are expected to produce those artifacts yourself.

**First create and refine your own `.kiro/` structure using Kiro's native workflow.** Do not copy stale generated specs from Git history. Record your actual planning/build actions in docs/KIRO_USAGE.md. The final project should include its real Kiro project assets.

## Copy into Kiro to start

> You are the lead engineer building Project Reanimate. Read README.md and all relevant docs, especially PRD, ARCHITECTURE, SECURITY, AI_ENGINE, ACCEPTANCE, ROADMAP, the ADRs and the UI design brief. This repository intentionally contains no implementation or `.kiro/` directory. First use your own native Kiro spec-driven workflow to create `.kiro` steering, requirements, design, and sequenced tasks, with acceptance criteria traceability. Identify contradictions, record decisions, then build the complete system from scratch in small demonstrable vertical slices. Implement a reproducible checkout failure with real OpenTelemetry and Prometheus/Alertmanager ingestion, persist a deduplicated incident and expose a functional incident UI. Only after that add evidence correlation, bounded AI hypotheses, isolated patch validation, explicit human approval and draft PR creation. Do not fabricate telemetry or working features, do not bypass approval gates, and do not grant the model production credentials. Create the monorepo, source, tests, infrastructure, workflows and config yourself. Verify each slice with runnable tests and observed results. Treat existing docs as intent, not proof of implementation.

## Recommended order of execution

### 0. Plan and validate the brief

- Read docs and GitHub issues; capture ambiguity and explicit tradeoffs in Kiro-native design artifacts.
- Write Kiro-native specs, steering, and task plan under `.kiro/` **only after opening the project in Kiro**.
- Propose a dependency graph and a short reviewable vertical slice, with test-first exit conditions.

### 1. Generate the build foundation

- Create the TypeScript monorepo, shared contracts, package manager lockfile and strict CI from scratch.
- Generate a reproducible local environment, migrations, minimal API, worker and frontend.
- Implement local-only secrets bootstrap and safe defaults; never commit secrets.
- Establish integration-test infrastructure and health/readiness endpoints.

### 2. Prove the live signal path

- Create checkout/payment demo services and a reproducible 800 ms → 100 ms timeout regression.
- Instrument real metrics/traces/logs, configure collectors, alert rules and alert delivery.
- Persist the alert in PostgreSQL with repeat-delivery deduplication and crash-recoverable scheduling.
- Display measured incidents; prove healthy → failing → resolved twice from a clean environment.

### 3. Build the investigation room

- Add bounded metric/trace/log queries, redaction, evidence references and deployment/commit correlation.
- Develop the interactive, responsive incident timeline and service dependency visualization.
- Implement insufficient-evidence handling and partial-failure visibility.

### 4. Build the bounded AI reasoning layer

- Create a provider-neutral model interface with JSON-schema validation and evidence ID checking.
- Treat all telemetry, README, commit messages and retrieved code as untrusted data.
- Evaluate with the documented positive, missing-evidence, unrelated-deployment and malicious-log scenarios.

### 5. Build safe patch and GitHub PR flow

- Propose a minimal allowlisted diff pinned to the source SHA.
- Verify in a truly isolated ephemeral runner with no secrets or network egress.
- Bind recorded validation and approval to the immutable patch digest; never infer approval.
- Make draft PR creation idempotent and forbid automatic merge/deployment.

### 6. Package, test and submit

- Build a labelled public read-only replay with authentic captured evidence.
- Run clean-clone setup, unit/integration/E2E/security/UX checks; record actual observations.
- Create deployment and CI only when build milestones require them; include live demo and proof of Kiro activity.
- Use docs/ACCEPTANCE.md as the release gate; do not claim completion before it passes.

## Definition of implementation ownership

| Owner | Creates |
| --- | --- |
| This direction-only repository | Intent, acceptance conditions, target architecture and constraints |
| Kiro | `.kiro/` project artifacts, application code, tests, migrations, infra/Compose/Kubernetes, CI, configuration, scripts and runnable demo |
| Human reviewer | Approves risky design changes, connected credentials, PR opening and external deployment |

## Engineering guardrails

- Prefer a compact API + independent background worker over speculative microservices.
- Separate persistent state from transient work; model retry, timeout, outbox, idempotency and concurrency.
- Don't optimize for visuals at the expense of genuine signal/causal analysis. Make the interface exceptional, but data-backed.
- Track and show errors, evidence gaps, partial failures and approval state; don't hide them behind synthetic success.
- Keep the implementation compatible with a solo developer's local resources, and document scale-up tradeoffs.

## How to prove progress

Each milestone PR should link to a generated Kiro spec/task, evidence of the Kiro action, observed test output, a demo screenshot or artifact where relevant, and the remaining gaps. Do not claim Kiro generated files that were prewritten or that a scenario passed without running it.