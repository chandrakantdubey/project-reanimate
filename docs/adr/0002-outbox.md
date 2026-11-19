# ADR 0002 — Transactional outbox before claiming delivery guarantees

- **Status:** Proposed for M1; NOT implemented in starter
- **Date:** 2026-11-19

## Context

A naive `INSERT incident` followed by `queue.add` loses work if the process crashes between operations.

## Decision

Create an outbox row in the incident DB transaction. Dispatcher polls pending outbox with `FOR UPDATE SKIP LOCKED`; enqueue jobs with deterministic IDs; mark sent only after BullMQ success. Worker must be idempotent and reconcile external side effects.

## Consequences

Introduces a lightweight polling dispatcher and extra table. Greatly improves recoverability and observability. Not exactly-once: dual failures can create repeated jobs, which must be harmless.
