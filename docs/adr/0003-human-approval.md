# ADR 0003 — Human-approved, diff-bound PR creation

- **Status:** Accepted for MVP
- **Date:** 2026-11-19

## Decision

No automatic production Kubernetes writes or GitHub merges. After sandbox tests pass, require authenticated approval for **exact diff SHA + base commit + policy version**, then open a draft PR. Any patch modification invalidates approval.

## Reasoning

LLM RCA and patch creation are probabilistic. Passing test suites does not imply safe deployment. Separating proposal, verification, approval and PR creation makes the workflow auditable, reproducible and safe enough for a public demonstration.
