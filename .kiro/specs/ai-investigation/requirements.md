# Feature Requirements — Evidence-backed AI Investigation

- WHEN incident collecting begins, THE WORKER SHALL gather bounded, timestamped telemetry and candidate GitHub changes with stable evidence IDs.
- WHEN any source is unavailable, THE WORKER SHALL preserve the evidence gap and continue if it can; it SHALL NOT synthesize log lines or SHAs.
- THE MODEL SHALL return schema-valid hypotheses listing `supportingEvidenceIds`, `contradictingEvidenceIds`, `alternatives`, `reasoningSummary` and a calibrated confidence or `insufficient_evidence`.
- THE VALIDATOR SHALL reject any referenced evidence ID not in the investigation, any unapproved tool intent and any output exceeding limits.
- THE MODEL SHALL NOT have arbitrary shell, network, Kubernetes mutation or GitHub write tools.
- A poisoned log string that says to ignore policy SHALL be treated as data and SHALL NOT change security permissions.
- WHEN token/time/cost budget is exhausted, THE WORKER SHALL finish with an explicit partial outcome and retry policy.
