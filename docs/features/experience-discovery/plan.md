---
status: completed
created: 2026-09-08
origin: docs/features/experience-discovery/spec.md
depth: standard
---

# Experience Discovery Implementation Plan

## Problem and Scope

Implement the agreed discovery loop in existing AW guidance so a technically
correct result does not silently stand in for the intended human experience.
The motivating aw-cli charts are user-reported evidence, not an inspected defect
or an implementation target. Source intent is
`docs/features/experience-discovery/spec.md`; context is
`docs/brainstorms/2026-09-08-001-aw-next-directions-idea.md`.

This is a reversible workflow-guidance change. No new skill, config key, gate,
prototype framework, dependency, or telemetry schema is required. Do not build
aw-cli charts, change global installed skills, commit, or publish as part of this
plan. Implementation should use a feature branch and preserve existing local
brainstorm/spec changes and telemetry.

## Requirements Traceability

| Requirement | Implementation unit | Acceptance scenarios |
| --- | --- | --- |
| EXD-001: explicit and suggested entry | U1, U2 | S1, S2, S3, S8 |
| EXD-002: agreement before creation | U1, U2 | S1, S2, S4, S5, S8 |
| EXD-003: inspectable interpretation | U1 | S1, S6 |
| EXD-004: human reaction | U1, U2 | S6, S7, S8 |
| EXD-005: proportionate retention | U1, U3 | S3, S7, S9 |

## Relevant Existing Patterns

- `skills/aw-brainstorm/SKILL.md`: ambiguity assessment, one-question interaction,
  living-spec output, and end-of-brainstorm discovery hook. Its current “Output
  is not code” statement needs a bounded prototype exception.
- `skills/aw-work/SKILL.md`: intake already routes ambiguous work toward
  brainstorming. Add a concise reference there rather than duplicate the loop.
- `skills/aw-create-spec/SKILL.md`: direct spec creation from clear requirements
  must remain available; no change is needed for this first slice.
- `docs/workflow/README.md`: design hooks are additive; discovery runs after
  brainstorming with its artifact or final context. Preserve that timing.
- `docs/decisions/2026-07-21-add-design-team-hooks.md`: preserve additive hooks
  and their disabled-by-default configuration; do not rewrite this decision.
- `docs/features/augmented-workflow/spec.md`: umbrella workflow intent must link
  to the new focused spec when the behavior is implemented.
- `skills/aw-init/artifacts/workflow-readme.md` and
  `skills/aw-init/artifacts/field-guide.md`: installer-owned documentation sources;
  keep corresponding `docs/workflow/` copies synchronized.
- `docs/features/theory-building-site/site-narrative.feature`: precedent for
  explicitly manual acceptance scenarios. A scenario file is not a test runner.
- `scripts/test-install.sh`: installed artifacts and source parity verification.
- `docs/solutions/README.md`: no applicable solved-problem entries found.

Applicable standards: `docs/standards/coding-approach.md` (small scoped changes)
and `docs/standards/traceability.md` (requirement IDs and scenario anchors).
Behavior pinning and guard-verification standards do not apply: no behavior
preservation refactor or deterministic guard is being implemented. E2E authoring
is disabled and this change has no product UI to exercise in a browser.

## Decisions

1. Keep the loop in brainstorm, with a short intake pointer from work. This
   supports requests arriving during implementation without another workflow.
2. Suggest a prototype only for consequential experiential uncertainty. Describe
   what it would clarify and wait for agreement. A direct request to create the
   prototype is already authorization; do not ask for it again.
3. Distinguish agreement to prototype from approval of the resulting experience
   or authorization for production implementation. Silence settles neither.
4. Preserve the existing discovery hook checkpoint. Pass the interpretation,
   prototype authorization scope, any prototype reference, human feedback, and
   unresolved questions as ordinary context. Do not add a persisted state schema.
   Hook configuration is not prototype authorization. A hook must honor the same
   boundary and reuse existing feedback rather than restart discovery. If it
   exposes new uncertainty, report it and reconcile intent before downstream
   handoff; do not recursively rerun hooks.
5. Permit a small disposable prototype only after authorization, choosing an
   available medium appropriate to the uncertainty. This is a narrow exception
   to brainstorm's code prohibition, not permission for production development.
   If the available medium cannot answer the question, explain that limitation
   and agree on an alternative; do not label an inadequate substitute validated.
6. Keep useful findings in existing spec sections. No mandatory experience
   template for every feature, numerical delight score, automatic artifact
   deletion, or mandatory permanent prototype reference.

## Implementation Units

### U1 — Add the experience loop to brainstorm

Goal: make interpretation, authorization, and human feedback explicit at the
point experiential uncertainty is explored.

Files: `skills/aw-brainstorm/SKILL.md` and
`docs/features/experience-discovery/experience-discovery.feature` (new manual
acceptance scenarios). Follow simplicity and traceability standards.

Insert concise guidance before artifact finalization. Connect understanding,
useful conclusions/actions, and emotional response to the interpretation of
references. Define suggestion, waiting, direct authorization, decline, reaction,
and unresolved mismatch behavior. Change the blanket code prohibition to allow
only an authorized disposable probe. Carry findings into existing spec sections;
preserve uncertainty when a user declines or defers exploration. Do not repeatedly
offer a declined prototype for the same unchanged uncertainty.

Tests: author S1–S7 and S9 in the exact scenario file above, then replay them in
fresh conversations loading the edited repository skill, not a stale global
copy. Inspect outputs and tool actions at each turn. Add trace anchors using
`node .scripts/aw-gate.js trace-annotate` under the repository convention. Never
claim a static wording assertion proves that the agent waits.

Dependencies: none. Verify U1 before integrating alternate entry and hook paths.

### U2 — Integrate work intake and existing design hooks

Goal: reuse the loop when a build request exposes experiential ambiguity, without
moving checkpoints or asking twice.

Files: `skills/aw-work/SKILL.md`, `skills/aw-brainstorm/SKILL.md`,
`skills/aw-init/artifacts/workflow-readme.md`, `docs/workflow/README.md`, and the
U1 scenario file. Keep the loop definition in brainstorm; work only points to it.

Add a short intake instruction to suggest discovery when relevant uncertainty
appears in a direct work request. A generic request to build a feature is not
permission to create a separate exploratory prototype. Preserve clear-request
fast paths and previously supplied authorization and feedback.

Document hook handoff context and the agreement boundary in the hook contract.
Discovery still runs once at its existing end-of-brainstorm checkpoint. Blank or
disabled hooks do not disable the core loop. An external hook that cannot honor
the contract must report that unsupported behavior rather than silently create
an unauthorized prototype. No new hook or plugin dependency is introduced.

Tests: add/replay S8 and repeat S1–S5 through work intake. Use a local test hook
fixture supplied within the scenario, with hooks off, on, and blank. Check that
invocation occurs at the existing checkpoint and that authorization/feedback is
passed through. Follow both applicable standards. Dependency: U1.

### U3 — Align durable intent and adoption guidance

Goal: describe the shipped behavior consistently without expanding the workflow.

Files: `README.md`, `docs/features/experience-discovery/spec.md`,
`docs/features/augmented-workflow/spec.md`, `docs/features/index.yml`,
`skills/aw-init/artifacts/field-guide.md`, `docs/workflow/field-guide.md`, and
`CHANGELOG.md` under the repository's applicable release entry.

Add one concise example explaining suggestion, agreement, prototype, reaction,
and spec learning. Link the focused spec from umbrella intent. Mark the focused
spec active and describe current behavior only after implementation and
verification. Preserve feature-index schema. Record the bounded code exception
and unchanged hook timing in user-facing guidance. No config migration or
installer algorithm change is needed; follow the existing release policy if
implementation is packaged into a versioned release.

Tests: inspect the example against S1, S2, S4, and S7; verify no documentation
claims that agents possess Theory or that process checks prove experiential fit.
Run `bash scripts/test-install.sh` for artifact installation/parity. Do not add
sentence-matching tests that merely mirror prose. Dependencies: U1 and U2.

## Test Plan

Effective policy: `acceptance-first`. Write the manual acceptance scenarios before
editing skill guidance, then run them against the changed skill. Record observed
actions, human feedback where required, and any unavailable checks in the
implementation report. The scenario file must identify itself as manual.

1. **S1 — Suggest then wait:** request meaningful, exciting metrics with references.
   Expect an interpretation and bounded proposal; withhold a reply and verify no
   prototype creation. Agree, then verify a probe within that scope.
2. **S2 — Direct authorization:** explicitly request a small prototype. Expect no
   redundant approval question, and no production implementation inferred.
3. **S3 — Routine change:** request an obvious spacing fix with clear intent.
   Expect no forced prototype or extra discovery artifact.
4. **S4 — Decline:** decline the offered probe and request continued requirements
   work. Expect no prototype, no repeated offer, and unresolved assumptions kept
   visible without claiming experiential validation.
5. **S5 — Resume:** supply prior explicit agreement and its scope in the continued
   context. Expect reuse of that agreement. Missing or ambiguous authorization
   must not be invented from the existence of a reference or configured hook.
6. **S6 — References and missing capability:** explain which reference qualities
   support insight and pleasure. If the reference cannot be accessed or the
   prototype cannot test the uncertainty, expect an explicit limitation, not
   invented interpretation or an unsupported claim of success.
7. **S7 — Human mismatch:** a prototype is functionally correct; the human says it
   feels wrong. Expect the mismatch to remain open, then useful corrections to
   inform intent. Passing tests and silence must not close the question.
8. **S8 — Hook and alternate entry:** repeat through work intake and with a
   configured discovery hook. Expect one existing hook checkpoint, no duplicate
   authorization question, and no implied permission from hook configuration.
   A hook finding that challenges intent is reconciled before handoff.
9. **S9 — Retention:** useful learning survives independently of the disposable
   prototype. Existing user files are not deleted; no permanent link to a removed
   prototype is required to understand the requirement.

Mechanical checks after implementation: `git diff --check`,
`node .scripts/aw-gate.js validate`, `node .scripts/aw-gate.js trace`, and
`bash scripts/test-install.sh`. Run the narrow checks first. Existing unrelated
trace failures must be reported separately, not fixed by expanding this scope.
No browser suite or gate-unit suite is needed unless implementation introduces
changes to those surfaces.

## Risks and Open Questions

- Skill instructions influence agent behavior; these changes cannot guarantee
  compliance across every runtime. Replay evidence supports bounded claims only.
- Third-party hook behavior can conflict with the boundary. The contract and
  scenario cover handoff; do not claim to enforce arbitrary external skills.
- The runtime-installed brainstorm skill is older than the repository version:
  its discovery-hook timing differs. Implementation and verification must use
  repository sources and preserve the latest documented checkpoint.
- No blocking product decisions remain for this scope. Prototype medium is chosen
  per task; actual experiential success still requires a human reaction.

## Deferred Work

Aw-cli redesign, new design tooling, automated experience scoring, cross-runtime
benchmark infrastructure, changes to PRD retention policy, and broader memory or
metrics work. No automatic scheduling or new global skill installation.

## Handoff

Document review (2026-09-08): checked clarity, scope, EXD-001–EXD-005 coverage,
acceptance scenarios, implementation feasibility, standards, and hook
compatibility. No blocking findings remain. Mechanical registry validation and
whitespace checks passed. Behavioral replay and install tests are implementation
checks and have not run for this planning-only change.

Implement sequentially U1 → U2 → U3 through
`aw-work docs/features/experience-discovery/plan.md`. No tickets are required by
the current configuration. Run plan review before implementation, code/workflow
review after implementation, and configured compliance before any requested PR.
Design hooks are disabled and no human plan reviewers are configured, so no
additional human-review PR is required for this reversible guidance change.
Do not interpret authorization to plan as authorization to implement.
