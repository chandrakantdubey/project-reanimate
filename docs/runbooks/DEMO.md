# Checkout Incident Runbook

## Scenario

A checkout regression demonstrates the full incident journey on an isolated, instrumented workload. The payment endpoint returns after approximately 300 ms; the checkout timeout changes from 800 ms to 100 ms through an actual deployed commit.

## Reproducible scenario

1. Start the infrastructure and instrumented checkout service with a safe payment timeout of 800 ms and payment latency of 300 ms.
2. Generate synthetic checkout traffic; observe baseline low 5xx rate and telemetry.
3. Create a real demo commit that changes the timeout config to 100 ms, then redeploy **only the isolated demo service**.
4. Prometheus evaluates the configured 5xx alert rule; Alertmanager delivers the authenticated webhook.
5. Reanimate persists an incident and ties signals to GitHub deployment/commit metadata.
6. AI investigator returns source-cited probable timeout regression and alternative hypotheses.
7. A constrained fix returns timeout to 800 ms, adds a regression test and passes sandbox checks.
8. Authorized human reviews and approves the exact verified diff, then separately requests draft PR creation in the demo repository.
9. Optional: manually deploy approved fix and show metrics recovering. Never auto-merge as part of the demo.

## Expected observations

| Stage | Evidence |
| --- | --- |
| Healthy baseline | Successful checkout requests and low 5xx ratio |
| Regression | Timeout errors, downstream traces and matching deployment SHA |
| Detection | Firing alert and one durable incident despite duplicate deliveries |
| Investigation | Linked metrics, logs, traces and commit evidence; alternatives and uncertainty |
| Verification | Original fault reproduced, corrected case passes independent tests |
| Review | Immutable patch identity and explicit approval audit |
| PR | Confirmed draft PR URL and no duplicate on retry |
| Recovery (optional) | Manually deployed fix followed by measured healthy signals |

## Execution guardrails

- Use a dedicated throwaway GitHub demo repository and simulated services, never employer systems.
- Capture real terminal/UI events; do not edit a synthetic time series to mimic success.
- Export an authentic, sanitized recording for public replay; retain event timestamps and source relationships.

## Fallbacks

If model provider down, show the last persisted investigation with its timestamp and current provider error; use a labelled replay only when displaying a recording. If GitHub write operation fails, show the real error and existing verification rather than presenting an uncreated PR. If monitoring backend unavailable, capture a failure indication; do not display fabricated evidence.
