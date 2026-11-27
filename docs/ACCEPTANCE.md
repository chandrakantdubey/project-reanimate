# Acceptance and Release Criteria

## Alert detection and incident lifecycle

- [ ] Fresh checkout service emits HTTP metrics and OTLP traces; a healthy period is visible in Prometheus.
- [ ] Changing `PAYMENT_TIMEOUT_MS` from 800 to 100 against a 300 ms payment service produces measured 5xx failures.
- [ ] Prometheus rule fires with an observed error-rate time series; Alertmanager sends an authenticated webhook.
- [ ] Postgres has **one** incident after ten webhook retries; one job/evidence collection recorded.
- [ ] `GET /v1/incidents` returns persisted fields; frontend shows them, not fabricated metrics.
- [ ] Reverting the regression returns service to healthy and resolves the alert episode.
- [ ] E2E run starts from clean state and passes twice without editing DB manually.

## Investigation and remediation

- [ ] Timeline accurately aligns alert, deployment, telemetry and investigation events.
- [ ] At least three linked evidence artifacts with real source references.
- [ ] Hypothesis includes evidence IDs and an explicit uncertainty/alternatives section.
- [ ] Missing evidence yields `insufficient_evidence`, never a fabricated source.
- [ ] Proposed patch is a real diff pinned to a SHA; isolated tests pass with captured artifacts.
- [ ] No unapproved GitHub side effects. Authorized user explicitly approves exact diff hash.
- [ ] Draft PR is created in demo repository with explanation and validation results.
- [ ] Replay is clearly marked and public; live pipeline is separately demonstrated.
- [ ] Negative tests: forged webhook, duplicate webhook, dangerous patch, poisoned log, repeated PR request.

## Product experience and trust boundaries

- [ ] Live and replay routes display their mode; replay reads only sanitized recordings and cannot invoke writes, providers or sandbox execution.
- [ ] Unauthorized users cannot read another project or approve/open a PR.
- [ ] Approvals are bound to the exact diff, base SHA and policy version; stale base, changed policy, rejected proposal and failed checks block submission.
- [ ] PR creation timeout followed by retry reconciles to the same draft PR.
- [ ] Worker restart and Redis loss after outbox publication do not lose outstanding investigation work.
- [ ] Property-based tests cover repeated/reordered alert episodes, immutable proposal identities and illegal transitions.
- [ ] Missing telemetry, model timeout and verification failure render actionable states, not fabricated results.
- [ ] Keyboard-only review, accessible chart alternatives and 360 px layout pass browser checks.

## Release readiness

- [ ] Clean-clone setup and documented prerequisites work; CI is green.
- [ ] Public read-only replay is accessible without credentials.
- [ ] No secrets or private telemetry are exposed in replay, logs or source control.
- [ ] Integration, security, accessibility and end-to-end checks have observed results.
- [ ] Known limitations and failure modes are documented.

## End-to-end product scenario

1. Show healthy 2xx checkout traffic and live service metric.
2. Apply known regression; observe request failures and Alertmanager incident.
3. Open exact incident; navigate source-correlated evidence and deployment SHA.
4. Show bounded investigation with evidence-backed RCA.
5. Inspect patch + verification results, explicitly approve, then open draft PR.
6. Demonstrate recovery signal after manually applying fix (if time).

## Important distinction

`Validation passed` proves configured tests passed in the sandbox, **not** that the production incident is fixed. `Recovery verified` is separate and requires post-deploy measured healthy service signals.
