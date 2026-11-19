# Interface Design Brief — Mission Control

## Principle

The interface must make causality legible. Think incident forensic workstation, not a generic SaaS dashboard and not fake hacker terminal. Every visible statistic is connected to an API, artifact or clearly labelled example. Avoid template section labels, filler marketing copy and decorative logs.

## Information architecture

- **Mission Control:** service topology, actionable open incidents, current environment, recent deployment health.
- **Incident room:** timeline (left), evidence canvas (center), investigation summary / decisions (right).
- **Diff review:** changed files, precise code diff, test matrix, policy checks, audit history and separate approval button.
- **Replay Mode:** curated dataset, explicit banner and guided scenario, read-only.
- **Settings:** integration health and permissions, hidden from public replay.

## Motion and interaction

Subtle transitions between alert -> evidence -> hypothesis -> proposal; highlight graph edges on hover; click a trace to reveal exact spans, not an arbitrary popup. Show skeletons for async loading and errors if data unavailable. Never animate a status that is not backed by real state.

## Typography & accessibility

Minimum 12 px secondary text; target 14–16 px body; keyboard-accessible graph and timeline; visible focus rings; AA contrast; support reduced motion. Monospace reserved for SHAs, trace IDs, commands and short metrics. Layout must work at 360 px mobile and laptop/desktop widths.

## Visual direction

Near-black graphite surfaces with restrained phosphor-green for healthy states, amber for warning, crimson for firing, violet for AI *interpretation* only. Prefer layered panels, timeline depth and crisp engineering visuals over oversized cards. Keep semantic colors consistent and don't rely on color alone.

## Concrete UI acceptance

- First paint shows accurate pending/empty state; never fake incidents.
- Every incident state uses human-readable text and timestamp.
- At 360 px no horizontal page overflow; graphs can intentionally scroll within a labelled region.
- A proposed PR is never displayed as opened before GitHub confirms creation.
- Public replay is visibly labelled on every route.
