# Local Development — bootstrap stage

**Current limitation:** not yet executed in a registry-enabled Docker environment. These are target commands that need M0/M1 integration testing, not a promise that a full stack runs today.

## Prerequisites

Node.js >=22, pnpm >=10, Docker Engine/Compose, Git, and Kiro IDE/CLI. Keep this isolated from work/production infrastructure.

## Setup plan

1. Run `node scripts/bootstrap-local.mjs` to create `.env` and the mounted Alertmanager secret with random credentials. Do not commit `.env`.
2. Install with `pnpm install`, commit generated `pnpm-lock.yaml`, run `pnpm typecheck` and `pnpm test`.
3. Start PostgreSQL and Redis using `docker compose up -d postgres redis` (when Compose file is validated).
4. Generate and apply Drizzle migrations (`pnpm db:generate`, `pnpm db:migrate`).
5. Start API, web and worker via `pnpm dev` in root, or workspace filters.
6. Start Prometheus + Alertmanager; ensure receiver has authorized path to API. In local Linux Docker this may require `host.docker.internal:host-gateway`.
7. Start demo checkout, generate traffic, and verify test alert webhook and incident UI.

## Operational checks

- `curl localhost:4000/healthz` -> `ok: true`.
- `curl localhost:4000/readyz` -> DB ready, or service unavailable.
- `curl localhost:4000/v1/incidents` -> persisted rows or empty JSON list.
- Prometheus `/targets`: checkout target up.
- Alertmanager active alert appears only during regression.
- Invalid bearer on `/internal/alerts` -> HTTP 401.

No default demo password/token should be considered secure outside local development. Production deployment requires isolated network access and real authentication.
