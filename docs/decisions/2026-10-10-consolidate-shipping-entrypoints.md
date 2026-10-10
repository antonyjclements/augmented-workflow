---
title: Consolidate shipping entrypoints with explicit mutation boundaries
date: 2026-10-10
status: active
tags:
  - workflow
  - skills
  - shipping
  - permissions
related_specs:
  - docs/features/augmented-workflow/spec.md
supersedes: []
---

# Consolidate shipping entrypoints with explicit mutation boundaries

## Context

Shipping consolidation was explicitly deferred from the spec consolidation and
then separately authorized on 2026-10-10. The Phase 1 checkpoint remains preserved.
The previous local-commit and commit/push/PR skills duplicated commit mechanics;
the full workflow also contained description-only and description-update modes.
Their permissions differ materially, so reducing entrypoints must not broaden
what a local commit or text request permits.

## Decision

Use one `aw-ship` router with lazy references and one shared commit procedure.
Retire `aw-commit` and `aw-commit-push-pr` rather than retain competing aliases.
The combined bundle has 20 entrypoints. Select the mode before side effects:

- `local-commit`: authorized local commits, no push or PR operations.
- `full-pr`: authorized commit/push/PR workflow with existing review, capture,
  spec/README, design, compliance, metrics and configured monitoring sequence.
- `description-only`: read evidence and return text without repository/PR writes.
- `description-update`: preview and confirm a specific existing PR text change;
  no commits, pushes, new PRs, publication gates or CI monitoring.

Description modes do not track, fetch, checkout, or run side-effectful evidence
capture. Existing-PR rewrite confirmation remains explicit in the full workflow.
Human sign-off PRs remain available through `aw-request-human-review`.

Preserve independent `commit` and `commit_push_pr` provider contracts, including
same-name bundled self-references without recursion. Do not use a provider whose
contract exceeds the selected mode. Missing support is an honest blocker.

Mutable shipping routes use capability-checked stage tracking. The spec protocol
and historical tracking records retain their interpretation. Installer migration
protects customized legacy shipping skills and unowned `aw-ship` collisions,
recognizes verified baseline/Phase 1 content, and retains rollback backups.
The first consolidation upgrade must run the new reviewed installer; an already
running released legacy bootstrap cannot be retroactively made safe by an archive.

## Consequences

The shared procedure removes duplicated commit mechanics and narrows read-only
paths that previously could fetch refs or append metrics. These are source and
helper-contract improvements, not proof of model compliance. Repeated controlled
runtime permission evaluation and independent review remain release requirements.
`test/skills/shipping-evaluation.md` separates deterministic, static, and unavailable
model evidence. No release version or publication authority is implied.

## Alternatives Considered

- Keep both public entrypoints: simpler routing boundary, but duplicated mechanics.
- Merge all paths into one unconditional flow: unsafe for local/text-only requests.
- Emit tracking before mode dispatch: mutates the repository during text-only work.
- Treat a shipping request as merge/deploy authority: exceeds the existing contract.

## Links

- `docs/features/augmented-workflow/plan.md`
- `test/skills/shipping-permissions-cases.json`
- `docs/decisions/2026-10-10-consolidate-spec-entrypoints.md`
