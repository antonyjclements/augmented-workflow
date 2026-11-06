# Local run evidence evaluation

## Frozen comparison

Representative improvement: allocate an actual final session identifier during
live learning capture, then reuse it at wrap-up. Baseline is `d22a65857f22fb3b0f03f194456ca7070a7e2508`; candidate
is this local worktree. The ten cases in `run-evidence-cases.json` freeze the
hypothesis, prompts, setup, three repetitions per variant and rejection criteria.

Before trials, save the candidate diff and content digest, full baseline commit,
model ID/version, runtime/config, tool list, available skills and fixture contents.
Use disposable repositories; create equivalent fixture states for baseline and
candidate. Substitute only the reviewed capture/synthesis/helper candidate. Start
a fresh agent context for every case/repetition, with the same tools, policy and
model settings. Alternate variant order and retain every output, not just passes.
For R2 continue the corresponding R1 fixture with its explicit source context.
For R6 supply both run IDs and the selected target; recency is not authority.

Score actual files/citations, duplicate sources, source inspection, assertions of
checks, questions, unauthorized writes and review proposal quality against each
case's expected behavior. Record elapsed time and added capture work where the
runtime exposes them; unknown is not zero. Predeclared acceptance: zero fabricated
citations/results or unauthorized mutation; improved R1/R4 provenance with no
R2/R3/R6 regression. R7/R8/R9/R10 must preserve uncertainty and adoption boundaries.
Reject a change that merely produces more artifacts without improving provenance.

## Fresh-agent runtime status

**Not-run: 0 of 60 paired case trials executed** (10 cases × 3 repetitions × 2
variants). No fresh-agent runtime was launched for this implementation. Behavioral
improvement, proposal quality and cross-runtime reliability are unverified.
A readiness probe or deterministic test is not a model trial. No permission or
runtime settings were relaxed to obtain results. Human adoption of a review's
proposal must wait for its concrete diff and evaluation evidence.

## Deterministic evidence

`node test/gate/run-evidence.test.ts` executes disposable real Git repositories
against the shipped CLI: lifecycle and stable IDs, collision refusal, input/path/
symlink exclusions, unsupported transcript fields, check evidence/reasons, capture
unknowns, distinct-session recurrence, explicit scope, terminal immutability,
read-only review, changed/missing source exclusion and exact archived-source
recovery after retention. Tracking and gates are disabled in these fixtures.
These are executable helper tests, not evaluation of model behavior.

`node test/skills/run-evidence-contract.test.ts` checks instruction contracts and
the frozen comparison protocol. It does not prove an agent follows instructions.
Final execution results and broader suite outcomes are reported in the delivery
summary and local workstream record, rather than pretending they are runtime trials.

## Receipt limitation

The current `verifyReceipt` implementation checks gate, summary and age but does
not compare `receipt.commit` to the current commit or fingerprint the working
tree. The first slice does not use receipts as outcomes. Run start/finish records
capture observed HEAD, index/tracked/untracked content fingerprint and dirty state;
these are non-atomic report-time observations, not proof of when a reported check
ran. Ignored files are excluded; unavailable fingerprinting records null.
A disposable current-code probe wrote a receipt at one commit, created a newer
commit and a dirty edit, then called `record review`: it exited 0, retaining the
old receipt commit under the new recorded commit. This confirms the separate
revision-binding defect is still present; it was not inferred from the old report.
The separate receipt enforcement issue remains outside this change's scope.

## Implementation validation and limits

The focused CLI suite passed 16 cases, including injected violations (empty source
sections, wrong-session citations, unsafe/symlinked paths, unsupported transcript
fields, unignored local storage, missing/changed sources) and near-misses (unknown
capture, clean completed run, one occurrence, independent parallel tasks). The
fingerprint test holds Git dirty state constant and changes untracked content:
the fingerprints differ; identical content in equivalent fixtures matches.
Four instruction contracts passed; these are explicitly not runtime evaluations.

The current installer smoke suite fails on the untouched baseline and candidate:
`managed consolidated bundled skills: expected '20', got '21'`. No assertion was
weakened. A targeted installation used temporary repo/skills/learnings directories,
disabled user skill links and stubbed only the unrelated `aw upgrade` bridge.
It verified the actual installed helper, both new lazy references and `/.aw/runs/`;
the CLI cases passed against that installed helper. This establishes installation
of this slice, not a full installer-smoke pass or real aw-cli integration.

At the initial implementation handoff, no commit, push, PR, merge, deployment,
background process or permissions change had been performed. The original
checkout's unrelated changes remain untouched.

Final broader checks: `npm run gate:test`, `npm run skills:test`,
`npm run shipping:test`, `aw-gate validate`, `aw-gate trace`, `aw-gate pin check`,
Node/Bash syntax and `git diff --check` passed. Trace reports 43 advisory missing
code-anchor warnings (code anchors are not required). Review covered code, plan,
spec, source privacy/identity, negative cases and installed behavior; no unresolved
in-scope findings. Workflow compliance audited the exact local diff against the
baseline with the acceptance/check mapping in the plan. No publication was attempted.

`aw-gate workflow-check` is disabled here: its exit 0 is a skip, not verification.
At that uncommitted handoff, `aw-gate check --against worktree` exited 1: the review gate compares the uncommitted
worktree to recorded HEAD even after actual local review, and synthesis has no
freshness record in this checkout. Normal memory synthesis was not run solely to
stamp that gate. The gate's warning about generated metrics is also retained.
These limitations block a claim of green publication gates, not the explicit
local helper results. `pin run` was not needed for this additive slice; `pin check`
passed and no pinned subject or oracle was changed.

## Authorized publication

The user subsequently approved publication directly to main. The implementation
is integrated with the latest main before publication; the frozen experimental
baseline above remains unchanged. Fresh-agent trials remain not-run. Publication
checks are rerun on the integrated commit, and genuine review/synthesis/compliance
passes provide the configured freshness evidence. The baseline installer-count
failure remains a disclosed limitation, not a claimed pass.
