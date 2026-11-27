# Data Model and Consistency

## Core entities

| Table | Selected fields | Important invariant |
| --- | --- | --- |
| `projects` | `id`, `name`, `github_installation_id`, `repo_full_name` | GitHub integration scoped per project |
| `services` | `id`, `project_id`, `environment`, `service_name` | unique project+environment+service |
| `incidents` | `id`, `fingerprint`, `starts_at`, `service`, `environment`, `status`, `version` | unique fingerprint + alert start timestamp + environment |
| `alert_events` | `id`, `incident_id`, `event_key`, `status`, `received_at`, `payload` | event key unique; duplicate delivery no-op |
| `investigations` | `id`, `incident_id`, `state`, `attempt`, `model`, `input_hash` | each attempt persists with explicit terminal state |
| `evidence` | `id`, `investigation_id`, `kind`, `source_ref`, `captured_at`, `sha256`, `redaction` | immutable, referenced by exact id |
| `hypotheses` | `id`, `investigation_id`, `summary`, `confidence`, `support_ids`, `against_ids` | all referenced IDs must belong to investigation |
| `patch_proposals` | `id`, `incident_id`, `base_sha`, `diff_hash`, `state`, `version` | immutable patch digest after verification |
| `verification_runs` | `id`, `proposal_id`, `runner_image_digest`, `tests`, `status`, `artifact_refs` | `passed` requires all mandatory gates passed |
| `approvals` | `id`, `proposal_id`, `actor_id`, `at`, `proposal_version`, `diff_hash` | approval bound to exact verified diff |
| `pull_requests` | `id`, `proposal_id`, `repo`, `number`, `url`, `head_ref` | unique proposal and unique repo+head_ref |
| `audit_events` | `id`, `actor`, `action`, `entity`, `correlation_id`, `at` | append-only; sanitised metadata |
| `outbox` | `id`, `event_type`, `entity_id`, `payload`, `created_at`, `published_at`, `attempt` | atomic with DB transition |

`projects` and RBAC can be deferred to a single-project MVP, but the API should preserve the ability to add project IDs later. The bootstrap Drizzle schema currently implements only a subset for the first vertical slice.

## Identity and deduplication

- Alertmanager fingerprint alone is not a global incident ID; the same alert can fire multiple times.
- Incident episode key: `sha256(environment + ':' + fingerprint + ':' + startsAtUTC)`. Service is saved separately; Alertmanager fingerprints already incorporate labels but we still validate service mapping.
- Alert delivery key: `sha256(incidentEpisode + ':' + alert.status + ':' + endsAtOrNull)`; duplicate deliveries are harmless.
- PR idempotency key: `sha256(repo + ':' + base_sha + ':' + verified_diff_hash)` stored uniquely; deterministic head branch prefixed `reanimate/`.
- Use `INSERT ... ON CONFLICT DO NOTHING` followed by lookup to distinguish newly created from replay; avoid blind last-write-wins state regressions.

## Transaction / outbox

Within one SQL transaction: validate state transition, update incident, append alert/audit event, append outbox command. A dispatcher claims rows with `SELECT ... FOR UPDATE SKIP LOCKED`, enqueues BullMQ jobs using stable IDs, and marks published only after enqueue success. A reconciler periodically queries pending rows. Workers are at-least-once and idempotent; never assume exactly-once processing. External GitHub calls use read-before-write + stored receipt/branch key.

## Time and ordering

- Store `TIMESTAMPTZ` UTC and retain source timestamp separately from ingestion time.
- Per-incident `event_sequence BIGINT` monotonic within DB transaction, used for SSE resume and UI ordering.
- A resolved notification cannot implicitly revert a closed incident to firing. A subsequent `startsAt` produces a new episode.
- Approving a proposal uses `UPDATE ... WHERE version = expected_version AND diff_hash = expected_hash`.

## Retention / backup

Evidence metadata + bounded excerpts: 14 days; incident summaries: 90 days; audit: 90 days for the demo (configurable after productization). Use Postgres PITR and daily snapshots for real deployments. Redis can be rebuilt from pending outbox. Treat restore exercises as part of operational hardening.
