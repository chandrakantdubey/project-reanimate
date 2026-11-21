# Implementation Backlog for Kiro

The GitHub issues are task directions only. Kiro must generate `.kiro/` specs and all implementation artifacts before attempting these milestones. Close issues only on observed results, not on file creation alone.

## #1 — Foundation reproducibility (P0 / M0)

**Goal:** `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm test` and `docker compose config` pass on a clean machine. Kiro creates the workspace and lockfile from scratch; adds typecheck CI and dependency scanning; fixes discovered version incompatibilities. **Done:** PR records command outputs, CI green, documented environment setup.

## #2 — Authenticated and idempotent real alerts (P0 / M1)

**Goal:** Firing and resolved Alertmanager events persist through auth, transactional outbox and webhooks. **Done:** 10 repeated webhooks => one incident, forged auth 401, Redis offline => eventual processing on recovery, order-robust resolved lifecycle. Spec: `.kiro/specs/incident-detection/`.

## #3 — Instrumented checkout regression demo (P0 / M1)

**Goal:** Healthy timeout >= payment latency yields 2xx; 100 ms timeout produces elevated 5xx; Prometheus alert fires; trace visible in Tempo; restoration resolves alert. **Done:** automated smoke test from clean Compose with screenshots and exact queries.

## #4 — Timeline and source correlation (P0 / M2)

**Goal:** Persist bounded metrics, traces, logs and deployment diff candidate; expose source references. **Done:** timeline shows accurate UTC order, GitHub SHA, negative evidence and explicit missing-source gap, with unit/integration tests.

## #5 — Evidence-backed structured RCA (P0 / M3)

**Goal:** Provider-neutral LLM adapter, strict output schema, source ID validator, refusal when evidence missing. **Done:** evaluation fixtures E1-E5 pass and prompt-injection test does not result in tool actions. Spec: `.kiro/specs/ai-investigation/`.

## #6 — Verified patch and draft PR (P0 / M4)

**Goal:** Allowlisted diff, sandbox check, approval bound to immutable digest, idempotent GitHub App PR. **Done:** test failure blocks PR, no approval blocks PR, retry does not duplicate, valid case produces actual draft PR. Spec: `.kiro/specs/remediation/`.

## #7 — Judge replay and interface polish (P0 / M5)

**Goal:** Public read-only replay with explicit label; incident graph/timeline and diff review that are data-backed. **Done:** keyboard/accessibility checks, mobile viewport pass, no authentication needed for replay.

## #8 — Submission and demo (P0 / M6)

**Goal:** Rehearsed under-three-minute public YouTube video; clear Kiro build history, public MIT repo containing `.kiro`, functional hosted URL, Devpost submission before deadline. **Done:** `docs/ACCEPTANCE.md` all checked from observed outputs.
