# Incident Lab Runbook

## Preparation

Start the isolated Shop and Reanimate stack, verify dependencies, configure a dedicated workload GitHub repository and restricted integration credentials, and confirm the model is reachable. Use synthetic traffic only. Confirm the baseline checkout timeout is 800 ms, payment latency approximately 300 ms, healthy requests and telemetry. Confirm an actual deployed SHA is visible, the alert rule is evaluated, and the environment is not already firing.

## Scenario A — configuration regression

1. Start a bounded run from a healthy baseline. Deploy the actual revision changing timeout from 800 ms to 100 ms; preserve the deployment receipt and neutral release metadata.
2. Generate checkout requests; verify elevated 5xx and genuine payment server measurements near baseline.
3. Wait for Prometheus and Alertmanager to create one durable incident; replay duplicate deliveries and confirm no additional incident/job.
4. Open the Incident Room and run investigation using only source evidence, not lab control data.
5. Inspect supporting/contradictory evidence and the suspect deployed diff. Check that the diagnosis identifies the client deadline, not downstream slowdown.
6. Request a structured config remediation; inspect the actual diff, original failing test and patched passing test with independent oracle.
7. Approve exact verified patch identity, then separately request draft PR creation. Confirm the GitHub URL and repeat request without duplicating PR.
8. Optionally manually apply the correction and observe recovery. Reset workload and wait for resolved alert before next scenario.

## Scenario B — dependency degradation

1. Start a fresh run with unchanged healthy checkout revision and 800 ms timeout.
2. Raise payment processing latency from approximately 300 ms to 1500 ms via the protected lab controller.
3. Generate the same checkout traffic and trigger the same generic error-rate rule.
4. Investigate the new incident; verify downstream latency increased while checkout config/revision remained unchanged.
5. Confirm the investigator identifies downstream degradation and provides supported next actions rather than increasing timeout or creating a PR.
6. Reset latency, stop traffic, and confirm the environment is healthy and alert resolved.

## Negative and blind evaluation

Run A and B in randomized order, hiding scenario identities and expected outcomes from the investigator. Include an unrelated deployment and remove material evidence for a separate test. Verify incomplete evidence produces abstention when the cause cannot be distinguished. Inject a malicious log string and check it is treated as data. Preserve results, model input provenance, observed outcomes and limitations.

## Replay and recovery

Export sanitized, authentic recordings of both cases, including actual evidence, hypotheses and the recorded PR receipt only where applicable. Verify public replay can load without live credentials and cannot invoke any mutation. If a provider is unavailable, show the real failure and previous persisted result with timestamps. Never represent replay as live. Reset/cleanup must terminate all active traffic and return the lab to baseline.

## Expected evidence

| Stage | Proof |
| --- | --- |
| Baseline | Successful requests, deployed SHA and latency/error metrics |
| Failure | Actual failed requests and server/client traces |
| Detection | Real alert and deduplicated incident |
| Diagnosis | Distinct evidence-backed outcomes for A and B |
| Verification | Original failing and patched passing independent test for A |
| Authorization | Explicit approval audit and confirmed real draft PR |
| Replay | Sanitized records of both incident journeys |
