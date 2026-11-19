# Capacity, Reliability and Cost Model

These are design envelopes and targets, **not measured benchmark results**.

## Local demo workload

- 2 simulated services, load generator at 5–20 RPS checkout; upstream can tolerate 300 ms payment latency.
- Prometheus scrapes every 5 seconds, stores roughly 4,000–20,000 time-series samples/minute depending on default runtime metrics; inspect actual cardinality before tuning.
- One expected incident in the demo, repeated Alertmanager webhooks, two concurrent worker jobs maximum.
- PostgreSQL stores compact alerts/evidence metadata, not arbitrary full logs/traces. Tempo holds trace bodies.

## Back-of-envelope at moderate scale

Assume 100 services with ~100 metric time series each (10,000 series) and 15 s scrape interval: ~667 samples/s, ~57.6M samples/day; storage depends heavily on compression, labels and retention. This argues for managed Prometheus/remote write or explicit on-prem retention, not dumping metric samples into PostgreSQL.

Assume 1,000 incident episodes/day; per-incident curated evidence 50–200 KB, then 50–200 MB/day before Postgres indexes, TOAST overhead and replication. Retain and purge on schedule. Model usage and GitHub rate limits, not API CPU, may dominate cost during bursts.

## Reliability budgets

| Operation | Target timeout | Retry | Hard limit |
| --- | --- | --- | --- |
| Alert ingestion DB transaction | 3 s | caller Alertmanager retry | webhook body 128 KB |
| Prometheus range query | 5 s | 2 attempts, jitter | 20 min max window; max 10 series |
| Trace/log backend retrieval | 5 s each | 2 attempts | 200 spans/400 lines |
| GitHub compare/deploy lookup | 7 s | 2 with Retry-After | max 10 changed candidate commits |
| LLM investigation | 30 s/call | 1–2 transient retries | max 2 analysis calls + 1 repair |
| Sandbox patch verification | 120 s | one manual retry for infrastructure | 1 CPU, 1 GiB, 128 processes (initial target) |
| GitHub PR create | 10 s | reconcile before retry | unique repo/base/diff key |

Under excess alerts, shed optional enrichments before dropping authoritative incident ingestion. Use per-tenant token buckets, bounded queue length, DLQ, warning dashboard and optional investigation pause. Critical alerts remain visible even when AI is unavailable.

## Caching and consistency

- Redis caches immutable GitHub commit/diff lookups by SHA (TTL 1 day) and telemetry query results by bounded UTC window (TTL 2 min) but never approvals or authoritative incident state.
- Postgres transactions and unique indexes enforce incident and outbox consistency. Delivery to Redis and GitHub remains at-least-once with deterministic idempotency.
- SSE consumers catch up from Postgres event sequence; Redis pub/sub is optional acceleration, never storage.
- SLO: availability target of API 99.9% after real deployment; RTO 2 hours and RPO 15 minutes for initial noncritical demo environment, to be validated with actual backups and restore test.

## Security/region topology

Single write-primary region first. If multi-region later, assign each project a home region; route mutations there and use read replicas + backup restore elsewhere. Do not attempt active-active incident mutation without conflict-resolution design. Restrict outbound adapters to allowlisted endpoints; never expose raw kubeconfig to workers.

## Monitoring the monitor

Record `reanimate_webhook_ingest_total{status}`, dedupe rate, `outbox_pending`, oldest outbox age, worker retries, investigation duration, evidence gaps, LLM token spend, failed schema checks, sandbox policy rejects, approval latency and GitHub PR failures. Add synthetic alert injection plus a heartbeat for the collector/worker. Avoid raw evidence in structured logs.
