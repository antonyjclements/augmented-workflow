# Phase 1 consolidation evaluation

This report records the completed Phase 1 checkpoint before separately authorized
shipping consolidation. See `shipping-evaluation.md` for the combined candidate.
The Phase 1 patch was saved and remains independently applicable to the baseline.

## Scope and frozen comparison protocol

Baseline: `5fae68e9f7c1b397dd0721cfd4183cf9760c2900` (0.15.0), refreshed from
main before implementation on 2026-10-10. Candidate: the local Phase 1 worktree,
not a release or published commit. Cases A1–A16 and expected boundaries are
frozen in `consolidation-cases.json`, derived from the approved plan before any
candidate runtime evaluation. Original skills are retained in baseline git history.

For controlled runtime comparison, run every case three times on each variant
with the same model version, runtime/config, available tools, fixture state and
context. Reset disposable fixtures between runs. Record chosen skill/mode/stages,
artifacts, questions, actual mutations, hook evidence, measurable loaded context,
latency and quality findings. Include enabled/disabled hooks, distinct/same custom
providers, unavailable providers, legacy-name coexistence and near-duplicate
external skills. Do not substitute instruction-string checks for these observations.

Predeclared rubric: zero unauthorized-action regressions; no material artifact or
override regression; no destructive migration defect; all applicable deterministic
checks pass. Release also needs a demonstrated improvement in routing reliability,
unnecessary clarification, procedure consistency, or measured loaded context.

## Runtime evaluation: blocked

A bounded Codex CLI readiness probe was attempted before either model variant:
`codex exec --sandbox read-only --skip-git-repo-check --ephemeral --json` with
prompt `Do not use any tools. Reply exactly READY.` The installed CLI reported
an existing ChatGPT login, but the invocation exited 1 before agent startup:
`failed to initialize in-process app-server client: Read-only file system`.
No model ID was returned, no model run completed, and no baseline/candidate
behavioral case executed. Repetitions completed: 0 of 3 per case per variant.
Other runtimes were not run. Access/security restrictions were not changed.

Behavioral claims: no behavioral improvement claim, all-runtime validation, agent
permission parity, hook-order success, or measured-context reduction is supported.
Model routing/review/prototype behavior remains unverified. Release is blocked
pending genuine comparison and human approval. This candidate supports only the
structural and deterministic claims stated below.

## Baseline evidence

- Clean source inventory: 22 `skills/*/SKILL.md` entrypoints.
- Existing `npm run gate:test`: passed.
- Existing `bash scripts/test-install.sh`: initially blocked by missing Ruby;
  rerun passed after installing the test runtime into isolated temporary storage.
- `aw-gate validate` and `workflow-health --no-run --json`: passed.
- Core new static contract suite failed before implementation (12 failures);
  the later plan-only boundary assertion also failed before its fix.
- New stage tracking acceptance suite failed before v2 implementation.
- New migration acceptance suite failed before the migration helper existed.

Ruby 3.3.8 was downloaded through APT from the environment's configured,
signature-verified Debian snapshot repository, extracted under a temporary root,
and exercised with YAML/JSON imports. No user machine or global install changed.
Node runtime: v24.19.0. Baseline and candidate deterministic suites use the same
Node/Ruby/Python environment and disposable installer fixtures.

## Candidate evidence

Final local checks on 2026-10-10, after all implementation/review fixes:

- Source inventory: 21 entrypoints, one bundled spec writer.
- `bash scripts/test-install.sh`: passed, including clean/upgrade/remote install,
  drift/reference/budget guards, gate/trace/pin/rotation/config functional checks.
- `npm run gate:test`: passed (93 cases, including 40 new tracking cases).
- `npm run skills:test`: passed (15 static contracts, 40 executable tracking
  cases, 15 executable migration cases, and the acceptance/evidence checks).
- `aw-gate validate`: passed; `workflow-health --no-run --json`: passed.
- `aw-gate trace`: passed with 29 advisory missing-code-anchor warnings; eight
  are the new contracts. Tests are anchored through the annotation helper;
  code anchors remain optional under the unchanged repo configuration.
- `aw-gate pin check`: passed. `workflow-check`: skipped because workflow trace
  is disabled; its exit 0 is not a workflow verification pass.
- Bash/Node/Ruby syntax and `git diff --check`: passed.
- Actual full pinned-bundle disposable migration: 22 to 21 managed skills,
  unchanged dry-run, and byte-identical rollback to all 22 prior skills/metadata.
- Installer fixtures cover unsafe metadata/symlinks, an actual interrupted
  migration, customized skills/config, old-helper compatibility, remote source
  resolution, and installed rollback without the original source checkout.

Known non-passing checks, not hidden as successful:

- `aw-gate pin run`: failed on BOTH untouched pinned main and candidate. The
  existing `aw-gate-trace-disabled.pin.js` oracle assumes tracing is disabled,
  while current repository configuration enables it. The baseline returned 21
  requirements; candidate 29. This is a pre-existing oracle/config mismatch;
  the oracle was not weakened or edited in this change.
- `aw-gate check --against worktree`: failed because review, compliance and
  synthesis freshness records were absent in the fresh checkout. Independent
  review did run as described below, but no artificial gate receipts were
  stamped. Publication compliance and synthesis were not run just to satisfy
  a shipping gate during a local-only implementation.

Static source deduplication is established by removing the two legacy entrypoint
trees and routing spec writes to one reference. This is a maintainability result,
not a measured reliability or latency result. The human-facing eight-item menu
does not alter the 21 model-discoverable descriptions.

## Acceptance coverage map

- A1–A11, A12–A14 contract text: `spec-contract.test.js`; actual model behavior
  remains blocked, including exact hook execution and imported PRD preservation.
- A12–A13 telemetry: executable `skill-routing.test.js` covers actual helper
  emission, stage attribution, correlation, legacy rows and disabled no-writes.
- A15 migration: executable `test/installer/skill-migration.test.py` and the
  coordinated installer smoke suite cover disposable real filesystem upgrades.
- A16 publication/Phase 2 boundary: static contract checks and final diff review;
  no publishing action was taken. Shipping skills remain separate.
- `consolidation.spec.ts` executes the focused suites and checks that the frozen
  runtime rubric and honest evidence report exist. Trace anchors describe this
  actual deterministic/static coverage, not unexecuted model trials.

## Review and release decision

Independent final-diff review is closed with no residual findings. It found and
verified fixes for a rollback temporary-file symlink write, old helpers counting
internal stages as extra public invocations, stale installed routing docs, and a
minor installer instruction mismatch. It also independently checked current
remote bootstrap with poisoned local helper/fingerprint files and a private
`aw-spec` collision; the private directory remained unchanged.

The released pre-consolidation bootstrap cannot be repaired retroactively by
serving a new archive: users MUST obtain reviewed new source separately and run
its installer, as documented prominently in README and installed guidance.
Known bundled helper/routing files refresh with backups; customized files remain
protected. Capability probing also protects other repos sharing global skills
but still using old helpers.

No version bump, release, commit, push, PR, merge or deployment occurred. The local
implementation and deterministic verification are complete; U1/U7 model comparison
and release approval remain blocked. Behavioral evaluation, resolution/acceptance
of the existing pin failure, and explicit publication approval are next decisions.
No behavioral improvement is claimed from static contract tests.

## Publication follow-through

This report records the pre-publication implementation checkpoint. A subsequent
explicit request on 2026-10-10 authorized committing the combined changes, pushing
the branch and opening a draft PR. That approval does not authorize merge, release
or deployment and does not remove the model-evaluation or baseline-pin limitations.
Current remote/CI results belong to the draft PR and its verified head, rather
than retroactively changing the checkpoint results above.
