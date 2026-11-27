# API Contract (target v1)

All endpoints except `/healthz`, `/readyz` and explicitly read-only Replay endpoints require authentication. All response bodies are JSON; errors follow `application/problem+json` (`type`, `title`, `status`, `detail`, `traceId`). Do not expose raw provider error objects.

| Method | Path | Function | Access |
| --- | --- | --- | --- |
| `GET` | `/healthz` | process live | public |
| `GET` | `/readyz` | database connectivity | internal |
| `POST` | `/internal/alerts` | validate Alertmanager firing/resolved batch | network-restricted + shared secret (MVP) |
| `GET` | `/v1/incidents?cursor=&limit=` | incident list, stable cursor | authenticated operator / replay read-only |
| `GET` | `/v1/incidents/:id` | timeline, evidence counts, status | authenticated operator / replay read-only |
| `GET` | `/v1/incidents/:id/events` | live SSE stream | authenticated operator |
| `POST` | `/v1/incidents/:id/investigations` | enqueue bounded investigation | authenticated operator; idempotency key |
| `GET` | `/v1/investigations/:id` | evidence and hypotheses | authenticated operator / replay read-only |
| `POST` | `/v1/investigations/:id/proposals` | request constrained patch | authenticated operator |
| `GET` | `/v1/proposals/:id` | immutable diff + verification report | authenticated operator |
| `POST` | `/v1/proposals/:id/approve` | approve exact version/hash | role-based approval |
| `POST` | `/v1/proposals/:id/pull-request` | open draft PR after verification and approval | role-based approval + idempotency key |
| `GET` | `/v1/replay/incidents/:slug` | curated public fixture | anonymous, read-only |

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

LLM hypothesis responses must be schema-validated and must only reference evidence IDs in the active investigation. Future versions add pagination/link headers and OpenAPI generation from Zod routes.
