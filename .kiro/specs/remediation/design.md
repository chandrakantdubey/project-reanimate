# Design — Verified Remediation

The worker generates a constrained unified diff against pinned base SHA. A deterministic policy validator checks changed-file allowlist, max diff lines, file types and dangerous patterns before sandbox checkout. Sandbox uses isolated container image digest, unprivileged UID, `--network none`, limited CPU/mem/PIDs, no credentials, no docker.sock and no writable host mounts. Predeclared test matrix runs; signed artifact metadata stores exit codes and resulting digest.

After approval on proposal version/diff SHA, GitHub App creates a deterministic branch and **draft** PR. Read existing branch/PR before write, persist receipt and retry idempotently. Replay mode cannot call write endpoints. See `docs/adr/0003-human-approval.md`.
