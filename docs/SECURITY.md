# Security and Threat Model

## Trust boundaries

1. **Anonymous/public replay viewer:** only vetted static recordings and read-only APIs; no GitHub/model/cluster credentials.
2. **Live user UI:** authenticated, CSRF-protected mutations; RBAC determines investigate/approve.
3. **Alertmanager ingest:** separately protected ingress; authenticated webhook payload still untrusted.
4. **Telemetry backends:** queries must be bounded, data may contain secrets, PII and adversarial text.
5. **Repository contents:** source, issues, commit messages and README files are untrusted model input.
6. **Model output:** treated as *suggestions*, not authority; typed schema & evidence validator required.
7. **Patch runner:** disposable, unprivileged isolated environment; no network, credentials, host sockets or kubeconfig.
8. **GitHub App:** separately scoped installation token with Contents RW and Pull Requests RW only during the authorized PR phase; metadata read and minimal extra permissions as justified.

## Threat table

| Threat | Controls | Test |
| --- | --- | --- |
| Forged alerts / incident DoS | bearer verification, private routing, 128 KB body limit, rate limiting, per-project mapping | unauthorized webhook 401; oversized 413 |
| Duplicate or replayed alert | unique event and episode key, deterministic job IDs, state guard | 10 identical deliveries => 1 incident |
| Prompt injection in log or commit | label all retrieved data as untrusted, schema-only model output, no tools for arbitrary commands, reject source-external evidence | malicious string attempts to bypass approval -> rejected |
| Secret leakage to LLM | scrub credentials and identifiers, redact telemetry excerpts, encrypt integration secrets, do not send full env/repo | synthetic secret in log absent from LLM request |
| Malicious patch exfiltration | allowlist paths, diff size cap, sandbox without egress, no docker socket, no ambient secrets | patch attempts network call -> blocked |
| Unauthorized approval | authenticated subject, RBAC, diff-hash and optimistic version binding, audit | stale/anonymous approval rejected |
| Wrong branch PR or duplicate PR | pin repository & base SHA, deterministic head branch, read-before-create | repeated retries => same PR |
| SSRF via telemetry or GitHub URLs | fixed provider hostnames/config, no user-provided arbitrary URL fetch, deny cloud metadata IPs | blocked host test |
| Dependency/supply chain attack | lockfile, provenance where available, minimal container privileges, image digests, Dependabot/CI scan | CI scan gates |

## Remediation policy (MVP)

- Allowed files: targeted checkout timeout configuration and associated tests **only**.
- Never run generative shell commands; enforce a predefined test command mapping per repository.
- Before verification, show exact diff, base SHA, changed-file list, policy checks and diff hash.
- Verification runner: nonroot, read-only root filesystem where possible, cap CPU/memory/time, isolated filesystem, egress off, no cloud credentials, no Kubernetes privileges.
- Any change to diff, base commit or policy version invalidates previous verification and approval. Recheck target-branch freshness immediately before PR creation.
- Human clicks approve and opens PR separately; no direct merge or deploy.

## Execution and authorization controls

- Treat the verification runner as hostile-code execution, not an ordinary application container. Use a dedicated isolated execution environment with enforced egress denial, no host mounts/sockets, dropped capabilities, resource limits and a pinned dependency image. Do not expose an arbitrary public execution endpoint.
- Validate canonical paths, symlinks, file types, rename/delete operations and patch size before application. Reject edits to mandatory test harnesses, dependency manifests, build scripts, workflows and runner configuration.
- Run mandatory independent regression tests, not solely tests supplied by the model.
- Check project scope, role, proposal state and verification identity server-side at every mutation. Record approval/rejection separately from PR creation.
- Public replay is exported through a redaction and secret-scanning gate and served separately from live integration credentials.

## Auth strategy

Public replay may use an **isolated read-only replay** without authentication. Live mode must use OIDC or another established auth provider prior to production exposure; no fake local user/role switcher is a security boundary. For an isolated localhost smoke test, use private development-only secrets via `.env` and never ship an open privileged endpoint.

## Audit and privacy

Append-only audit records: actor ID, action, target ID, correlation ID, timestamp, outcome and sanitized metadata. Restrict retention and access. Don't log tokens, bearer authorization or prompt bodies containing user data. Enable TLS and encryption at rest when deployed.

## Explicit prohibited MVP actions

Autonomous deployment/rollback; `kubectl apply/delete`; GitHub merge to protected branch; updating unrelated repository paths; executing remote commands from LLM output; sending private repo/cluster secrets to a model; displaying unredacted operational logs in public replay.
