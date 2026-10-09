---
status: completed
created: 2026-10-09
origin: docs/features/progress-tracking/spec.md
depth: lightweight
---

# Local Progress Tracking Plan

## Scope and Decisions

Implement the proposal's instruction-led first release. No multiwriter helper or
automatic cleanup. Keep execution state outside this plan. Test policy:
`acceptance-first`. Standards: coding-approach, traceability, guard-verification.

## Implementation Units

### U1. Lifecycle and template

Files: `skills/aw-work/SKILL.md`, `skills/aw-work/references/progress-*.md`,
`skills/aw-plan/references/plan-template.md`, `skills/aw-refresh/SKILL.md`,
`skills/aw-create-worktree/SKILL.md`.
Define version 1, discovery/reconciliation, stable IDs, coordinator checkpoints,
verification, human closure, safe cleanup and explicit handoff. Use a lazy reference
to respect skill word budgets. Verify resume/checkpoint/closure/handoff requirements
with the scenario matrix in `docs/features/progress-tracking/verification.md`.

### U2. Installer and regression tests

Files: `skills/aw-init/scripts/install.sh`, `scripts/test-install.sh`.
Add the narrow ignore rule independently of gates and reject tracked collisions
before repository mutation. Tests cover default/gates/reinstall, newline handling,
ignored/untracked record, tracked templates/docs, and collision refusal with no
file changes, including a nearby tracked path that must remain allowed.
Run `bash scripts/test-install.sh`; demonstrate the collision guard fails on bad input.

### U3. Installed guidance and acceptance

Files: `skills/aw-init/artifacts/{AGENTS.md,workflow-readme.md,field-guide.md,tracking.md}`,
their installed copies, `README.md`, feature registry and verification report.
Regenerate guidance using the installer in a scratch destination and copy only
affected generated outputs, preserving local config. Run drift/registry/word-budget
checks through the install suite, inspect the full diff, and perform workflow
compliance review. No commit or push is authorized.

## Risks and Handoff

Instruction-led lifecycle checks validate guidance, not autonomous agent compliance.
Ignored records have no Git backup. Keep unsupported/corrupt originals and human
notes intact. Progress has no authority over gate evidence.
