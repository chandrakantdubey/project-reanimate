# Demo Runbook

## Reproducible scenario

1. Start the infrastructure and instrumented checkout service with a safe payment timeout of 800 ms and payment latency of 300 ms.
2. Generate synthetic checkout traffic; observe baseline low 5xx rate and telemetry.
3. Create a real demo commit that changes the timeout config to 100 ms, then redeploy **only the isolated demo service**.
4. Alertmanager detects elevated 5xx ratio and delivers the signed/authenticated webhook.
5. Reanimate persists an incident and ties signals to GitHub deployment/commit metadata.
6. AI investigator returns source-cited probable timeout regression and alternative hypotheses.
7. A constrained fix returns timeout to 800 ms, adds a regression test and passes sandbox checks.
8. Authorized human reviews diff and creates draft PR in the demo repository.
9. Optional: manually deploy approved fix and show metrics recovering. Never auto-merge as part of the demo.

## Execution guardrails

- Use a dedicated throwaway GitHub demo repository and simulated services, never employer systems.
- Capture real terminal/UI events; do not edit a synthetic time series to mimic success.
- Label replay footage if used. Use a pre-recorded authentic incident to avoid demo instability.

## Fallbacks

If model provider down, show the existing persisted investigation and label as replay. If GitHub write operation fails, show the real error and existing verification rather than presenting an uncreated PR. If monitoring backend unavailable, capture a failure indication; do not display fabricated evidence.
