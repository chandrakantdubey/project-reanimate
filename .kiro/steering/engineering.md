---
inclusion: always
---
# Engineering conventions

- Use TypeScript strict mode, typed Zod contracts at API boundaries and composition over inheritance.
- Persist authoritative incident/investigation state in PostgreSQL. Redis and SSE are delivery mechanisms, not authoritative sources.
- Every external call needs timeout, bounded retry/backoff, correlation ID and structured error handling.
- Protect DB / queue side effects with stable idempotency keys and an outbox when correctness matters.
- Model outputs must be schema-validated, bounded and linked to real evidence IDs; prompt injection from logs/code is expected.
- Write tests for state transitions, duplicate/reordered webhooks, auth failure, secrets redaction, malformed LLM outputs and PR retry behavior.
- Produce clean UX with purposeful visualization; no fabricated counters, incidents, PRs or validation results.
- Never add example production tokens/credentials to files. Keep `.env` and local runtime secrets untracked.
- Do not add autonomous write permissions to Kubernetes, GitHub merge/deploy, or host shell execution.
- Before marking a task done, run available checks, report commands and results, and identify unverified integration paths.
