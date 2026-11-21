# Local Development — Target Requirements (No Scaffold Yet)

**No local-development automation is checked in.** Kiro must generate the monorepo, package manifests, secrets bootstrap, Docker Compose, observability configuration, tests and commands. The following is the intended acceptance sequence, not a runnable quickstart.

## Developer experience to create

1. Clean clone and documented prerequisites (Node.js, pnpm, Docker Engine/Compose and optionally Kind).
2. Deterministic setup using generated scripts with safe local-only credentials; never commit secrets.
3. Frozen-lockfile dependency install; lint, typecheck, unit tests and dependency/security checks.
4. Start PostgreSQL/Redis and telemetry services, generate/apply schema migrations, run backend/worker/frontend and checkout/payment demo.
5. Verify health/readiness checks and that all telemetry targets report correctly.
6. Generate healthy traffic, inject the timeout regression, see a real alert and persisted incident.
7. Replay the scenario from a clean environment without manual database edits or secret hardcoding.

## Required verification once Kiro implements it

- API liveness and database-aware readiness behave as documented.
- Alert ingestion rejects invalid authentication and oversized payloads.
- Ten identical webhook deliveries create one incident and one deduplicated investigation.
- DB/Redis/provider outages degrade safely; transient work is reconciled after restart.
- The UI reflects persisted telemetry and clearly distinguishes replay from live.
- Clean-clone setup and test commands work on a developer machine and in CI.

Exact generated commands must be documented here by Kiro after they have been tested, rather than prescribing nonexistent script paths today.