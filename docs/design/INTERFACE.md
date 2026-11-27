# Product Experience — Mission Control

## Experience principles

Reanimate is an incident investigation workspace, not a generic analytics dashboard. The primary experience answers five questions: what broke, who or what is affected, what evidence explains it, what should change, and what has actually been verified?

Use progressive disclosure: show a clear incident summary first, then make detailed evidence, code and test output accessible without losing context. Keep observed facts, hypotheses and actions visually distinct.

## Information architecture

| Route | Screen | Purpose |
| --- | --- | --- |
| / | Product entry | Explain the workflow; enter replay, explore the Shop or sign in to live mode. |
| /lab | Incident Lab | Protected isolated run controls, readiness, traffic and reset. |
| /shop | Reanimate Shop | Browse sample products and submit synthetic checkout; private/local by default. |
| /incidents | Mission Control | Active and resolved incidents, service/environment filters and integration status. |
| /incidents/:id | Incident Room | Incident summary, chronological timeline, evidence and investigation. |
| /incidents/:id/proposals/:proposalId | Remediation Review | Inspect exact diff, checks, test artifacts, approval and draft PR state. |
| /replay/:slug | Replay | Recorded incident with the same evidence-reading experience and no write actions. |
| /settings | Integration Settings | Private connection status, project scope and permissions; configuration UI may follow the MVP. |

Private screens require authentication; public replay is a separate data boundary. Navigation retains the selected project/environment and incident context. Deep links must open the referenced record or display a meaningful unavailable state.

## Reanimate Shop and Incident Lab

The Shop is a compact functional storefront, not a second full product: product selection, synthetic checkout and actual success/error response. Show a clear no-real-payments label.

The Lab shows readiness, active run, bounded traffic, elapsed duration, measured service status and start/reset controls. Scenario selection is visible only to the lab operator and remains outside investigator context; incident views use neutral titles until evidence supports a diagnosis. Disable conflicting actions during preparation/reset, show failures honestly and link to the incident once it exists. A public viewer can choose recorded scenarios without starting live workloads or writes.

## Mission Control

- Header: product identity, mode, environment, connection health and last refresh.
- Incident list: severity, affected service, lifecycle, onset, investigation progress and last event.
- Filters: lifecycle, service, environment and severity; default to active incidents.
- Summary: counts derived from stored records, never fabricated usage statistics.
- Service topology when trace-derived topology is available; otherwise show service list and dependencies supported by evidence.

## Incident Room

Desktop layout: incident header, left timeline, central evidence workspace and right investigation panel. Use a single-column reading order on narrow screens with tabs or drawers for evidence and hypotheses.

- Header: incident title, severity, service, environment, start time, lifecycle and investigation progress.
- Timeline: alert firing/resolution, deployment events, evidence timestamps, investigation stages, approval and PR events. Distinguish occurrence from collection time.
- Evidence tabs: metrics, traces, logs and changes. Selecting an item opens its timestamp, source, bounded data excerpt and redaction/availability details.
- Hypothesis cards: summary, qualitative confidence, linked supporting and contradictory evidence, alternatives and limitations. Clearly label AI interpretation.
- Investigation actions: request/retry when eligible, with visible progress and budget/failure messages.
- Remediation entry: enabled only when evidence and policy permit a proposal.

## Remediation Review

Display repository, target branch, base SHA, immutable diff hash, affected files and unified diff. Include verification status, mandatory policy checks, test results, sanitized artifacts and timestamps. Approval and PR creation are distinct actions; changing the patch, base or policy invalidates approval. Rejection records a reason without opening a PR.

Show the confirmed PR URL only after GitHub returns a receipt. Failed or uncertain external operations remain visible and can be reconciled. A validated patch is not a recovered service.

## Replay experience

Provide a scenario selector for both authentic recordings; each can be inspected with its own timeline, evidence and outcome. Historical scenario description must not be used as live investigation input.

Use a persistent read-only banner with recording time and scenario description. Allow navigation, evidence filtering and inspection of recorded checks. Never connect replay to live credentials, mutate incidents or invoke models. Recorded approval and PR actions are historical artifacts, not executable controls.

## State and interaction design

| Condition | Experience |
| --- | --- |
| Loading | Preserve layout with meaningful skeletons. |
| No incidents | Explain healthy/empty state and available filters. |
| Source unavailable | Show source-specific gap and last successful collection. |
| Insufficient evidence | Explain what is missing and available next actions. |
| Verification failed | Display failed checks and allow a revised proposal. |
| Awaiting approval | Show immutable review details; restrict actions to authorized users. |
| PR creation uncertain | Show reconciliation state, not duplicate submission. |
| Incident resolved | Keep investigation and audit history accessible. |

## Visual system

Use near-black graphite surfaces, restrained green for healthy, amber for warnings, crimson for firing and violet for AI interpretation. Pair color with icons and readable labels. Use layered panels, clear information hierarchy, precise charts and compact technical typography. Avoid decorative logs, invented statistics and gratuitous animation.

Body text targets 14–16 px; secondary text at least 12 px. Use monospace for code, SHAs and identifiers. Support visible focus, keyboard navigation, WCAG AA contrast, reduced motion, screen-reader labels, accessible table alternatives to charts, and 360 px mobile widths.

## Acceptance

Every displayed value comes from persisted data, a measured signal or an explicitly labelled recording. The interface remains usable during partial failures, preserves selection on refresh, prevents duplicate actions, and never claims recovery or PR creation before confirmation.
