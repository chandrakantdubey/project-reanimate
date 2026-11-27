# Product API Contract — v1

All endpoints except `/healthz`, `/readyz` and explicitly read-only Replay endpoints require authentication. REST responses are JSON; the events endpoint uses `text/event-stream`; errors follow `application/problem+json` (`type`, `title`, `status`, `detail`, `traceId`). Do not expose raw provider error objects.

| Method | Path | Function | Access |
| --- | --- | --- | --- |
| `GET` | `/healthz` | process live | public |
| `GET` | `/readyz` | database connectivity | internal |
| `POST` | `/internal/alerts` | validate Alertmanager firing/resolved batch | network-restricted + shared secret (MVP) |
| `GET` | `/v1/incidents?cursor=&limit=` | incident list, stable cursor | authenticated operator |
| `GET` | `/v1/incidents/:id` | timeline, evidence counts, status | authenticated operator |
| `POST` | `/v1/incidents/:id/acknowledge` | acknowledge a firing incident | authenticated operator |
| `GET` | `/v1/incidents/:id/events` | live SSE stream | authenticated operator |
| `POST` | `/v1/incidents/:id/investigations` | enqueue bounded investigation | authenticated operator; idempotency key |
| `GET` | `/v1/investigations/:id` | evidence and hypotheses | authenticated operator |
| `POST` | `/v1/investigations/:id/proposals` | request constrained patch | authenticated operator |
| `GET` | `/v1/proposals/:id` | immutable diff + verification report | authenticated operator |
| `POST` | `/v1/proposals/:id/approve` | approve exact version/hash | role-based approval |
| `POST` | `/v1/proposals/:id/reject` | reject exact proposal version with reason | role-based approval |
| `POST` | `/v1/proposals/:id/pull-request` | open draft PR after verification and approval | role-based approval + idempotency key |
| `GET` | `/v1/lab/status` | protected environment readiness and run state | lab operator |
| `POST` | `/v1/lab/runs` | start allowlisted scenario in configured lab | lab operator; idempotency key |
| `POST` | `/v1/lab/runs/:id/reset` | stop traffic and restore baseline | lab operator; idempotent |
| `GET` | `/v1/replay/incidents/:slug` | curated public fixture | anonymous, read-only |

## API semantics

- Lab endpoints are separately authorized and available only for the configured isolated environment. Start accepts an allowlisted scenario selector and bounded run settings; no arbitrary commands, Git refs or targets. Return 409 for a conflicting active run. Run status excludes scenario ground truth from investigator-facing contracts. Reset is safe to repeat; public replay has no lab mutation endpoints.

- All private reads and writes are scoped to the authorized project and environment. Do not treat an unguessable ID as authorization.
- Public replay uses only the replay endpoint and a sanitized recording containing presentation-compatible incident, evidence and proposal data. No live endpoint accepts anonymous replay access.
- Incident list returns `{items, nextCursor}`; use a stable sort by onset and ID, bounded limit and filters for status, service, severity and environment.
- Accepted asynchronous actions return 202 and a durable resource ID; duplicate idempotency keys with the same request return the existing result. Reuse with a different payload returns 409.
- Approval/rejection accepts expected version, diff hash, base SHA and policy version. Stale or invalid transitions return 409. PR creation rechecks all gates independently.
- SSE events contain a monotonic event ID, type and resource reference; resume via Last-Event-ID. If retention prevents resume, reload the snapshot.
- Use 401 for missing/invalid authentication, 403 for forbidden actions, 404 for unavailable resources, 413 for oversized payloads, 422 for invalid domain input, 429 for rate limits and 503 for temporary service unavailability. Never leak provider credentials.

## Example Alertmanager payload

```json
{
  "receiver": "reanimate",
  "status": "firing",
  "alerts": [{
    "status": "firing",
    "fingerprint": "f0c84c0ab123",
    "labels": {"alertname": "CheckoutHigh5xx", "service": "checkout", "environment": "demo", "severity": "critical"},
    "annotations": {"summary": "Checkout 5xx ratio above 20%"},
    "startsAt": "2026-11-19T11:00:00Z",
    "generatorURL": "http://prometheus:9090/graph"
  }]
}
```

For the MVP, `Authorization: Bearer <secret>` is required on `/internal/alerts` and body size is limited. In production, prefer private network routing, mTLS or a signed ingress with rotation; do not publish this endpoint to the public internet.

## Evidence schema (target)

```json
{
  "id": "ev-123",
  "kind": "trace",
  "source": "tempo",
  "reference": {"traceId": "...", "spanId": "...", "timestamp": "..."},
  "collectedAt": "2026-11-19T11:02:00Z",
  "summary": "downstream payment call timed out",
  "redacted": true,
  "sha256": "..."
}
```

LLM hypothesis responses must be schema-validated and must only reference evidence IDs in the active investigation. Generate the OpenAPI contract from shared schemas and test compatibility between API, worker and web clients.
