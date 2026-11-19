# Design — Evidence-backed AI Investigation

Use a deterministic gatherer with adapters: Prometheus (queries), Tempo (trace identifiers), Loki (bounded logs) and GitHub (deployed SHA, compare diff). Normalize into evidence JSON + SHA256. Redact before model. The LLM receives immutable evidence metadata and bounded text with explicit instructions to treat retrieved content as untrusted. Output uses a discriminated union: `hypotheses` or `insufficient_evidence`.

Do not derive evidence refs from model text; validate against DB IDs and source timestamps. Distinguish correlation from verified causation. A second evaluator may challenge top hypothesis when budget allows. Persist input digests, model ID, token counts and decision before exposing results. Reference `docs/SECURITY.md`.
