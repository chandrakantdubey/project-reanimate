---
inclusion: always
---
# Product context

Reanimate is an evidence-driven incident investigator and **human-approved** remediation assistant, not a production auto-deployer.

The demo must use an authentic checkout timeout regression, real telemetry and a persisted audit trail. Public judge replay must always be labelled as replay and must not present fixture data as live.

Read `docs/PRD.md`, `docs/ACCEPTANCE.md`, `docs/SECURITY.md`, and the active `.kiro/specs/<feature>/` before implementing a feature. Update acceptance checklist only after running relevant tests.

Prefer one genuinely working end-to-end user journey over multiple fake or half-connected UI modules. Be explicit about incomplete features.
