# Acceptance, Demo and Submission Gates

## First meaningful slice — pass/fail

- [ ] Fresh checkout service emits HTTP metrics and OTLP traces; a healthy period is visible in Prometheus.
- [ ] Changing `PAYMENT_TIMEOUT_MS` from 800 to 100 against a 300 ms payment service produces measured 5xx failures.
- [ ] Prometheus rule fires with an observed error-rate time series; Alertmanager sends an authenticated webhook.
- [ ] Postgres has **one** incident after ten webhook retries; one job/evidence collection recorded.
- [ ] `GET /v1/incidents` returns persisted fields; frontend shows them, not fabricated metrics.
- [ ] Reverting the regression returns service to healthy and resolves the alert episode.
- [ ] E2E run starts from clean state and passes twice without editing DB manually.

## Complete MVP

- [ ] Timeline accurately aligns alert, deployment, telemetry and investigation events.
- [ ] At least three linked evidence artifacts with real source references.
- [ ] Hypothesis includes evidence IDs and an explicit uncertainty/alternatives section.
- [ ] Missing evidence yields `insufficient_evidence`, never a fabricated source.
- [ ] Proposed patch is a real diff pinned to a SHA; isolated tests pass with captured artifacts.
- [ ] No unapproved GitHub side effects. Authorized user explicitly approves exact diff hash.
- [ ] Draft PR is created in demo repository with explanation and validation results.
- [ ] Replay is clearly marked and public; live pipeline is separately demonstrated.
- [ ] Negative tests: forged webhook, duplicate webhook, dangerous patch, poisoned log, repeated PR request.

## Presentation checklist

- [ ] Public running website or test build with judge access and documented entry steps.
- [ ] Public GitHub repository, root `.kiro/`, and repository-level recognized open-source `LICENSE`.
- [ ] <3 minute YouTube video with actual on-screen application functionality.
- [ ] Devpost description and Frankenstein positioning: OTel + Kubernetes + GitHub + agentic intelligence.
- [ ] Kiro usage explained with concrete artifacts (specs, steering, hooks, actual implementation history).
- [ ] Launch deadline: 2026-12-04 22:00 UTC (2026-12-05 03:30 IST). Verify in Devpost before final submit.
- [ ] Read-only public replay does not expose API tokens, production logs or secrets.
- [ ] Repository README quickstart works on clean machine; CI green.

## Measurable demos

1. Show healthy 2xx checkout traffic and live service metric.
2. Apply known regression; observe request failures and Alertmanager incident.
3. Open exact incident; navigate source-correlated evidence and deployment SHA.
4. Show bounded investigation with evidence-backed RCA.
5. Inspect patch + verification results, explicitly approve, then open draft PR.
6. Demonstrate recovery signal after manually applying fix (if time).

## Important distinction

`Validation passed` proves configured tests passed in the sandbox, **not** that the production incident is fixed. `Recovery verified` is separate and requires post-deploy measured healthy service signals.
