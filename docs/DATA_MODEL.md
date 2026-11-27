# Data Model and Consistency

## Core entities

| Table | Selected fields | Important invariant |
| --- | --- | --- |
| `projects` | `id`, `name`, `github_installation_id`, `repo_full_name` | GitHub integration scoped per project |
| `services` | `id`, `project_id`, `environment`, `service_name` | unique project+environment+service |
| `incidents` | `id`, `project_id`, `fingerprint`, `starts_at`, `service`, `environment`, `status`, `version` | unique project + environment + fingerprint + alert start timestamp |
| `alert_events` | `id`, `incident_id`, `event_key`, `status`, `received_at`, `payload` | event key unique; duplicate delivery no-op |
| `investigations` | `id`, `incident_id`, `state`, `attempt`, `model`, `input_hash` | each attempt persists with explicit terminal state |
| `evidence` | `id`, `investigation_id`, `kind`, `source_ref`, `captured_at`, `sha256`, `redaction` | immutable, referenced by exact id |
| `hypotheses` | `id`, `investigation_id`, `summary`, `confidence`, `support_ids`, `against_ids` | all referenced IDs must belong to investigation |
| `patch_proposals` | `id`, `incident_id`, `investigation_id`, `repo`, `base_ref`, `base_sha`, `diff_hash`, `policy_version`, `state`, `version` | immutable patch digest after verification |
| `verification_runs` | `id`, `proposal_id`, `runner_image_digest`, `diff_hash`, `base_sha`, `policy_version`, `tests`, `status`, `artifact_refs` | `passed` requires all mandatory gates passed |
| `approvals` | `id`, `proposal_id`, `actor_id`, `at`, `proposal_version`, `diff_hash`, `base_sha`, `policy_version`, `decision` | approval bound to exact verified diff |
| `pull_requests` | `id`, `proposal_id`, `repo`, `number`, `url`, `head_ref` | unique proposal and unique repo+head_ref |
| `audit_events` | `id`, `actor`, `action`, `entity`, `correlation_id`, `at` | append-only; sanitised metadata |
| `outbox` | `id`, `event_type`, `entity_id`, `payload`, `created_at`, `published_at`, `attempt` | atomic with DB transition |

A single configured project is sufficient for the MVP, but project identity and authorization are mandatory in persistence and API access. Full multi-project administration can follow later. Store proposal bodies and sanitized verification artifacts with bounded size and explicit retention.

## Identity and deduplication

- Alertmanager fingerprint alone is not a global incident ID; the same alert can fire multiple times.
- Incident episode key: `sha256(canonicalEncode([projectId, environment, fingerprint, startsAtUTC]))`. Service is saved separately; Alertmanager fingerprints already incorporate labels but we still validate service mapping.
- Alert delivery key: `sha256(incidentEpisode + ':' + alert.status + ':' + endsAtOrNull)`; duplicate deliveries are harmless.
- PR idempotency key: `sha256(canonicalEncode([repo, base_ref, base_sha, verified_diff_hash]))` stored uniquely; deterministic head branch prefixed `reanimate/`.
- Use `INSERT ... ON CONFLICT DO NOTHING` followed by lookup to distinguish newly created from replay; avoid blind last-write-wins state regressions.

## Transaction / outbox

Within one SQL transaction: validate state transition, update incident, append alert/audit event, append outbox command. A dispatcher claims rows with `SELECT ... FOR UPDATE SKIP LOCKED`, enqueues BullMQ jobs using stable IDs, and marks published only after enqueue success. A reconciler periodically checks both unpublished outbox rows and published work without a durable completion receipt or live lease, and safely republishes missing jobs. Workers are at-least-once and idempotent; never assume exactly-once processing. External GitHub calls use read-before-write + stored receipt/branch key.

## Time and ordering

- Store `TIMESTAMPTZ` UTC and retain source timestamp separately from ingestion time.
- Per-incident `event_sequence BIGINT` monotonic within DB transaction, used for SSE resume and UI ordering.
- A resolved notification cannot implicitly revert a closed incident to firing. A subsequent `startsAt` produces a new episode.
- Approve only an awaiting_approval proposal with matching expected version, diff hash, base SHA and policy version plus a valid passing verification run. Record approval and state transition atomically.

## Read models and history

Persist ordered incident events for timeline/SSE, including source occurrence time, capture time, event type and resource reference. Add indexes for project/environment/status/onset, incident/event sequence, investigation/evidence and pending outbox dispatch. Persist source failures and model attempts rather than overwriting prior evidence. A public replay is an immutable, independently sanitized export, never a live database query.

## Retention / backup

Evidence metadata + bounded excerpts: 14 days; incident summaries: 90 days; audit: 90 days for the demo (configurable after productization). Use Postgres PITR and daily snapshots for real deployments. Redis can be rebuilt from pending outbox. Treat restore exercises as part of operational hardening.
