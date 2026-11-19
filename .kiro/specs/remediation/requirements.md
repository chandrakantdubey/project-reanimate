# Feature Requirements — Verified Remediation PR

- THE SYSTEM SHALL limit patch creation to the demo checkout timeout config and its tests in the MVP.
- WHEN a patch is proposed, THE SYSTEM SHALL pin base commit SHA, patch digest and policy version.
- BEFORE approval, THE SYSTEM SHALL run predefined tests in an ephemeral no-network/no-secret runner and persist exit codes and artifacts.
- A failed required check SHALL block ready state and PR creation.
- ONLY an authenticated operator may approve the exact verified diff hash and request draft PR creation.
- A modified diff SHALL invalidate verification and approval.
- Repeated PR jobs SHALL produce no duplicate PRs.
- THE SYSTEM SHALL NOT merge, deploy, rollback or change live Kubernetes resources.
