---
title: Consolidate spec entrypoints while preserving workflow stages
date: 2026-10-10
status: active
tags:
  - workflow
  - skills
  - specs
  - tracking
  - installer
related_specs:
  - docs/features/augmented-workflow/spec.md
supersedes:
  - docs/decisions/2026-05-28-combine-brainstorm-and-spec-creation.md
---

# Consolidate spec entrypoints while preserving workflow stages

## Context

The May split left two discoverable skills writing the same living feature spec.
The direct-versus-discovery distinction remains useful, but duplicated writers
make templates, hooks, trace annotations and artifact handoffs easier to drift.
The approved Phase 1 plan replaces those entrypoints without merging PRDs,
specs or implementation plans, and without changing publication authority.

## Decision

Use one `aw-spec` router with lazy discovery and shared spec-writing references.
Honor requested output first: PRD, plan and research have their own routes;
exploratory-only requests do not settle intent. Clear spec requests go directly
to the writer; consequential ambiguity uses discovery and existing prototype
consent rules. Keep the bundle at 21 skills without permanent alias skills.

Keep `workflow.steps.brainstorm` and `workflow.steps.create_spec` as independent
stages. Custom providers preserve their contracts and must report current hook
evidence. Valid returned specs skip duplicate writing, not unproven review.
An `aw-spec` self-reference selects the appropriate bundled reference, preventing
recursion. Stage-aware tracking distinguishes public invocation from internal
execution while preserving historical event interpretation and gate identities.

Require content-verified ownership before retiring installed skills. Preserve
customized or ambiguous directories; stop on an unowned canonical-name collision.
Preview migration and retain compatible backups for rollback. Do not promise
universal redirects for retired slash commands or overwrite customized routing.

Document review receives the actual plan path before human/ticket/work handoff.
This resolves the existing plan-review instruction mismatch without broadening
review or publication permissions.

## Consequences

There is one canonical spec writer and one fewer discoverable entrypoint.
Those are structural benefits, not proof of improved model routing or speed.
Runtime evaluation must compare pinned baseline and candidate under the same
conditions before claiming behavioral gains. Static assertions and deterministic
CLI tests prove only their own boundaries. Evidence is recorded in
`test/skills/consolidation-evaluation.md`.

The eight-item everyday menu remains a human navigation aid. `aw-commit` remains
local-only and `aw-commit-push-pr` remains the publication workflow. Shipping
consolidation is a separately approved Phase 2, not part of this decision.
No release number is selected and no publication is implied by implementation.

## Alternatives Considered

- Keep both public skills: retains duplicate discovery descriptions and writers.
- Merge all artifacts: loses PRD provenance and temporary-plan boundaries.
- Preserve alias skills: does not reduce the discoverable competing surface.
- Retire by directory name alone: risks deleting user-owned custom skills.

## Links

- `docs/features/augmented-workflow/spec.md`
- `docs/features/augmented-workflow/plan.md`
- `test/skills/consolidation-cases.json`
