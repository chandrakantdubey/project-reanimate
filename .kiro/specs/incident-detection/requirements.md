# Feature Requirements — Live Incident Detection

## User story

As an on-call engineer, I want a real alert to create an accurate, deduplicated incident record, so I can begin investigating without stitching monitoring tabs together.

## Acceptance requirements

1. WHEN the checkout error ratio crosses the configured threshold for a full alert window, THE SYSTEM SHALL receive a valid Alertmanager `firing` delivery and create a persisted incident.
2. WHEN a webhook lacks a valid bearer secret, THE API SHALL reject with HTTP 401 and SHALL NOT mutate state.
3. WHEN identical deliveries arrive 10 times or concurrently, THE SYSTEM SHALL create one incident per alert episode and zero duplicate investigation schedules.
4. WHEN Alertmanager reports `resolved`, THE SYSTEM SHALL retain history and mark the corresponding episode resolved even if an earlier firing notification is retried.
5. IF Redis is unavailable after DB success, THE SYSTEM SHALL recover scheduling using an outbox and retries, not lose the incident.
6. THE UI SHALL render incident status, service, environment, source timestamp, severity and persisted ID from API; it SHALL NOT fabricate live counters.
7. THE SYSTEM SHALL retain a correlation ID across webhook, DB transaction, scheduled work and logs.
8. IF Prometheus query fails or times out, THE INVESTIGATION SHALL record a visible evidence gap and SHALL NOT invent telemetry.

## Negative cases

Malformed JSON, absent fingerprint, invalid timestamp, oversize webhook, forged token, duplicate resolved events, out-of-order firing, DB outages, Redis outages, worker restart and conflicting episode fingerprints.

## Demo verification

Healthy requests -> timeout regression -> real alert -> incident in UI -> repeated webhook replay -> one incident -> restore timeout -> resolved state.
