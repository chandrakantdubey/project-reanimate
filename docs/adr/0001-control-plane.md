# ADR 0001 — Modular control plane with independent worker

- **Status:** Accepted for MVP
- **Date:** 2026-11-19

## Context

Incident ingestion must remain available while investigations perform slow provider calls and verification. A compact control plane minimizes distributed coordination while preserving clear trust boundaries.

## Decision

Use modular Fastify API + background BullMQ worker + PostgreSQL source of truth. Share TypeScript/Zod contracts. Next.js is UI-only; it does not own incident detection. Use adapters around Prometheus, GitHub and LLM providers.

## Why

Simpler to test/deploy than five microservices, keeps scheduling out of HTTP path, isolates future dangerous execution in its own runner, scales API/worker separately and avoids distributed consistency where unnecessary.

## Trade-offs

Requires Redis and Postgres; worker and API share schema and types; postpone cross-region failover and full multi-tenancy until product demand exists.
