# Design — Live Incident Detection

## Chosen components

Fastify `/internal/alerts` accepts Alertmanager webhooks using Zod and bearer auth; Postgres stores `incidents`, `alert_events` and `outbox`; worker uses BullMQ to collect bounded Prometheus evidence. Next.js renders persisted REST state.

Alert episode identity is hash(environment, fingerprint, startsAtUTC); source timestamps and arrival timestamps are separately stored. SQL uniqueness makes repeat delivery safe. All side effects use deterministic keys.

## Schema and sequence

See `docs/DATA_MODEL.md` for table definitions, `docs/ARCHITECTURE.md` for sequence. In transaction, insert alert episode if missing, insert event if missing, mutate lifecycle using validated transition guard, and insert outbox command on first firing event. A dispatcher delivers outbox rows to BullMQ; worker retries with backoff and upserts evidence.

## Auth and failure isolation

Bearer token matched in timing-safe comparison, bounded JSON body, rate limiting at ingress, nonpublic route. Return non-2xx if DB unavailable so Alertmanager retries. Do not acknowledge successful webhook before DB commit. API must never wait for Prometheus or LLM.

## Testing

Unit tests for episode identity, transition guard and webhook schema. Integration tests against disposable Postgres for concurrent duplicates. End-to-end under Compose for Prometheus rule firing, API delivery and UI rendering. No 'happy path only' tests.
