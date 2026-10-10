# Shipping consolidation evaluation

## Scope and checkpoint

U8 implementation was separately authorized on 2026-10-10 after Phase 1 completed.
It authorizes consolidation into `aw-ship`, not publication of repository changes.
The original baseline is `5fae68e9f7c1b397dd0721cfd4183cf9760c2900` (0.15.0).
The preserved Phase 1 patch SHA-256 is
`329c7c4dbcc544ef18c60a3eb8edae0e75913d15830dd7d8b1383c0837e5297f`.
Its evidence remains in `consolidation-evaluation.md`; the combined candidate has
20 discoverable skills with spec and shipping stages retained independently.

## Frozen permission matrix and rubric

`shipping-permissions-cases.json` freezes S1–S18 before any candidate model trial.
Run each three times per baseline/candidate with identical model version, runtime,
configuration, tools and reset disposable fixture state. Observe actual selected
mode/providers, local/remote mutations, tracking, questions, gates/hooks, latency
and evidence limitations. Include disabled/enabled tracking, old helpers, distinct
and same providers, custom collisions, default/detached branches and unavailable
GitHub paths. The original A1–A16 spec matrix remains in force.

Release requires no unauthorized publication/mutation regression, independent
provider and artifact parity, no destructive migration defect, all applicable
deterministic checks, independent review, and genuine repeated runtime permission
evaluation. Static text assertions alone cannot satisfy this release gate. During review, S13
received explicit partial/promisor/complete-clone regression variants before any
model trial; its original prompt and expected permission boundary are unchanged.

## Runtime evaluation: blocked

The Phase 1 Codex CLI probe failed before model startup with read-only app-server
state. The same verified blocker remains; no security/access workaround was used.
No model version was returned. Completed permission trials: 0 of 3 repetitions
per case per variant. Other runtimes were not executed. Behavioral claims:
no actual model permission compliance, mode-routing reliability, or all-runtime
validation is established by this implementation.

## Baseline and candidate evidence

Phase 1 checkpoint source retains 21 entrypoints; baseline main retains 22. Source
inspection of the old shipping flow found unconditional tracking before dispatch
and a fetch instruction in PR-description preparation. These are documented
instruction-path risks, not observed model actions. New description paths exclude
tracking, fetch, checkout, repo-file writes and side-effectful evidence capture.

Acceptance tests were written before new behavior: the new shipping contract
suite initially fails without `aw-ship`; helper cases first failed on unsupported
`shipping-tracking-schema`; new migration cases first failed at missing `aw-ship`
collision protection. The actual preserved Phase 1 helper accepts generic
`tracking-schema` (including ignored extra arguments) but rejects the distinct
shipping probe with exit 2 and no filesystem writes. This justifies a separate
capability command instead of probing `tracking-schema aw-ship`.

Current focused tests cover actual helper no-write behavior for both description
mode names, including unchanged pre-existing session/log contents and mtimes,
legacy rows, stage/provider attribution, invocation correlation and unchanged
receipt requirements. These CLI tests do not execute an agent's shipping workflow.
Static skill contracts cover the router and every lazy reference separately.
Independent review reproduced a further hidden write: Git diff lazily fetches
missing blobs in a partial/promisor clone despite no explicit fetch. The corrected
description procedure inspects config only, then uses API-only evidence or blocks
for partial/promisor/uncertain clones. `shipping-readonly.test.js` runs three real
Git fixture checks: unsafe diff grows packs; config-only routing leaves packs
unchanged; complete-clone read-only diff is the permitted near miss. These tests
verify the documented recipe and negative control, not an agent following it.

Final combined evidence on 2026-10-10 after all review fixes:

- `bash scripts/test-install.sh`: passed, including the full installer/config/
  gate/trace/pin/remote-bootstrap functional suite and migration regressions.
- `npm run gate:test`: passed, 113 executable cases including 60 routing cases.
- `npm run skills:test`: passed, 15 spec and 14 shipping static contracts,
  3 real Git read-only recipe fixtures, 60 helper cases, 26 migration cases,
  and evaluation-metadata checks. Counts overlap the gate/installer suites.
- `npm run shipping:test`: independently passed static and real Git recipe tests.
- Full complete-checkpoint migrations: baseline22→combined20 and Phase1-21→20
  passed. Dry-run and repeated install left snapshots unchanged; each rollback
  restored original file bytes, executable modes and symlink targets exactly.
  Both ended with exactly 20 managed entrypoints and no unresolved directories.
- Registry validation and `workflow-health --no-run --json`: passed.
- `aw-gate trace`: passed with 35 advisory missing-code-anchor warnings. New
  requirements have test anchors written through the annotation helper; optional
  code-anchor configuration was not changed to hide warnings.
- `aw-gate pin check`, Bash/Node/Ruby syntax, source/artifact mirrors and
  `git diff --check`: passed.
- Remote main was rechecked after implementation and still matches the pinned
  baseline. No commit or remote branch was created.

Non-passing/skipped checks remain explicit:

- `aw-gate pin run` fails with the pre-existing oracle/config mismatch reproduced
  on untouched baseline main: `aw-gate-trace-disabled.pin.js` expects disabled
  tracing, while repository config enables it. Neither oracle nor config was
  weakened to make it pass.
- `aw-gate check --against worktree` reports absent review/compliance/synthesis
  freshness records in this fresh checkout. Independent reviews did run, but no
  artificial receipts were stamped. Shipping compliance/synthesis was not invoked
  solely to satisfy publication gates during local-only implementation.
- Workflow execution-trace checking is disabled by existing config; its no-op is
  not counted as proof of an executed workflow.
- Repeated model permission trials remain blocked and unrun.

Independent Phase 2 final-diff review closed with no residual P0–P3 findings.
It independently reran shipping contracts, real Git fixtures, 60 helper cases,
26 migration cases and mirrors, and verified the partial-clone regression fix.
Phase 1 independent findings remain resolved. The benefit established here is
one shared commit procedure, four explicit permission modes and safer documented
read-only recipes, not measured model routing/context/latency improvement.

## Acceptance mapping

- S1–S15 and S18: `shipping-contract.test.js` checks the instruction boundary,
  shared procedure, provider routing and downstream reference constraints.
- S5–S7, S17–S18: `skill-routing.test.js` executes real tracking/capability helpers.
- S13: `shipping-readonly.test.js` exercises real disposable partial/complete
  Git clones and the unsafe lazy-fetch negative control.
- S16: `test/installer/skill-migration.test.py` and full installer smoke checks
  execute real disposable filesystem upgrades, collisions and rollback.
- `consolidation.spec.ts` runs the focused suites and checks frozen evaluation
  metadata. Trace anchors link static/deterministic coverage, not model trials.

## Release and publication status

No commit, push, PR, merge, deployment or release was performed. No release version
is selected. Model permission evaluation remains a release blocker. The existing
trace-disabled behavior-pin oracle mismatch from Phase 1 is still separately
reported, not silently modified to produce a green result.

## Publication follow-through

This report records the pre-publication implementation checkpoint. A subsequent
explicit request on 2026-10-10 authorized committing the combined changes, pushing
the branch and opening a draft PR. That approval does not authorize merge, release
or deployment and does not remove the model-evaluation or baseline-pin limitations.
Current remote/CI results belong to the draft PR and its verified head, rather
than retroactively changing the checkpoint results above.
