---
title: Keep AW workflows lightweight while strengthening review and handoffs
status: proposed
created: 2026-11-01
origin: user request following Compound Engineering comparison
depth: standard
related_specs:
  - docs/features/augmented-workflow/spec.md
  - docs/features/workflow-effectiveness/spec.md
---

# Workflow efficiency plan

## Problem and scope

AW should adopt consequence-based review depth, compact execution handoffs, and
explicit retirement conditions without growing the common workflow into a large
instruction pipeline. The current entry-file word limit misses transitive reads,
mode-irrelevant instructions, repeated context, and downstream skill invocations.

This is a proposal, not implementation authorization or an accepted living spec.
The current behavior source is `docs/features/augmented-workflow/spec.md`; the
measurement spec is draft and supplies context, not additional accepted scope.
Before behavior changes, reconcile the proposal into the core living spec through
`aw-spec`, preserving stable requirement IDs. Do not overwrite the active skill
consolidation plan at `docs/features/augmented-workflow/plan.md`. This directory
holds this separately scoped proposal; it does not establish a new accepted feature.

In scope: a reproducible context audit, targeted common-route reductions, review
depth, a small handoff contract, and optional retirement conditions for knowledge.
Out of scope: wholesale CE integration, automatic model routing, new agent rosters,
new mandatory planning artifacts for small fixes, new telemetry infrastructure,
publication, and changes to gate truth/authority or progress-record cleanup rules.

## Priorities and requirements

| ID | Priority | Proposed outcome | Units |
| --- | --- | --- | --- |
| R1 | P0 | Measure entry size, reachable instruction load, repeated reads, and installed inventory separately | U1 |
| R2 | P0 | Reduce unnecessary common-route reads without dropping safeguards or weakening acceptance evidence | U2, U6 |
| R3 | P1 | Select review depth by consequence; explain escalation and preserve substantive checks | U3 |
| R4 | P1 | Pass compact, scoped evidence between work and its caller without expanding authority or repeating completed stages | U4 |
| R5 | P2 | Retire conditional knowledge from active use only after its condition is verified; retain uncertainty and provenance | U5 |
| R6 | P0 throughout | Preserve living specs, immutable decisions, corroboration, configured providers, honest receipts, and explicit publication authority | U0–U6 |

Ship in small increments: U0/U1 establish intent and baseline, U2 reduces existing
cost, U3 and U4 add the highest-value behavior, U5 improves maintenance, and U6
closes each increment with evidence. U3/U4 may proceed after U1 without waiting
for unrelated refactoring in U2. U5 has no dependency on a new handoff format.

## Current context audit

See `docs/features/workflow-efficiency/context-audit.md` for all 21 skills,
measurement method, representative route estimates, and limitations. Baseline is
HEAD `d22a658` plus the observed working tree; instruction sources measured are
the repository's `skills/`, not potentially different globally installed copies.

Key findings:

- Entry files total 151,738 bytes; Markdown references total 243,223 bytes.
  These are inventory totals, not a claim that a session loads 394,961 bytes.
- `scripts/test-install.sh` enforces 2,200 words per skill entry and 1,200 words
  for the installed routing constitution. It has no route-load budget.
- `aw-capture`, `aw-refresh`, and `aw-review` load instructions for several modes
  together. `aw-synthesize-memory` embeds its schema and wiki template in its entry.
- `aw-plan` owns 85,287 reference bytes, but its software entry does not link most
  of them. Treat these as possibly stale support files, not required context.
- `aw-work` has useful lazy gates for e2e, characterization, and local continuity.
  Preserve them. Its shipping and tracker references are not linked by its entry.
- A software plan followed by document review loads at least 19,118 bytes of skill
  entries, before project evidence. A non-trivial work route including review and
  capture entries loads 33,934 bytes before optional references or project context.

## Decisions and existing patterns

- Use existing skill entrypoints and `workflow.steps` / `workflow.auxiliary` routing.
  No new top-level skill or configuration key is initially necessary.
- Keep `AGENTS.md` a routing file. Do not move deferred instructions into it to
  make skill files look smaller. Preserve inline tracking and hook independence
  per `docs/decisions/2026-07-27-keep-tracking-emit-in-skills.md`.
- Existing review can run in one context. Depth means coverage and independence,
  not a mandatory number of agents. No model selection is required.
- Reuse evidence only when target, base/HEAD, relevant live diff and criteria still
  match. A path or summary alone cannot clear a gate. Preserve local pre-push
  compliance per `docs/decisions/2026-10-10-audit-local-workflow-before-push.md`.
- Follow `docs/standards/coding-approach.md`, `docs/standards/traceability.md`,
  and `docs/standards/guard-verification.md`. Behavior pins apply if an increment
  refactors existing enforcement; no new pin is required merely to write this plan.
- Keep reports and records distinct: a handoff is task evidence, local progress is
  continuity, a plan is execution intent, and a receipt records an actual check.

## Implementation units

### U0 — Reconcile intent before implementation (P0)

Files: `docs/features/augmented-workflow/spec.md`, its existing feature-index entry,
and any narrowly affected measurement-spec text. Use `aw-spec` for the writer.
Promote R1–R6 into accepted criteria only within the user's implementation scope;
do not convert recommendations into existing behavior. Keep new requirement IDs
stable and use the trace helper when annotations are enabled.

Verification: explicit document review against R1–R6; preserve all existing
publication, progress, provider, and gate boundaries. If a proposed change conflicts
with a decision, surface the conflict rather than editing the immutable record.

### U1 — Make the audit reproducible (P0)

Files: new `scripts/skill-context-audit.py`, new
`scripts/tests/test-skill-context-audit.py`, this audit document, and README audit
usage. Prefer Python standard library; no tokenizer or runtime dependency required.

Produce deterministic Markdown/JSON containing entry bytes and words, reference
inventory, declared read edges and their conditions, common-route unique bytes,
and repeated-read bytes separately. Resolve references from the owning skill and
track nested edges. A link is not automatically a mandatory read: retain a small
explicit route scenario definition and mark uncertain/semantic routing as unknown.
Do not pretend a regex can infer arbitrary natural-language control flow.
Keep any route definitions inside the audit tool/test fixtures initially, rather
than adding a config schema for users. Include source hashes for reproducibility.

Tests at `scripts/tests/test-skill-context-audit.py`: nested conditional references,
cycles, duplicate reads, missing targets, unlinked files, Unicode byte/word counts,
and a shared reference used by two skills. Ensure unique bytes and cumulative
bytes differ correctly. Unknown edges must remain visible; they must not count
as zero. Malformed input reports an error rather than a reassuring empty result.

Acceptance: another maintainer reproduces the inventory with one documented
command; software planning, small fix, feature work, local commit, full PR,
capture-learning, capture-solution, refresh-solutions, and synthesis each have a
declared scenario. Enabled design/e2e/pin/custom-provider branches are reported
separately, not hidden in the default estimate.

### U2 — Remove default-route waste (P0)

Files: `skills/aw-capture/SKILL.md`, `skills/aw-refresh/SKILL.md`,
`skills/aw-plan/SKILL.md`, their relevant `references/*.md`, and
`scripts/test-install.sh` only if a justified guard is added.

Start with the large multi-mode entries: retain routing, shared safety and output
rules in the entry; load only the selected mode's procedure/template. A split is
worth keeping only if the complete selected route gets smaller or demonstrably
avoids irrelevant instructions. Avoid an entry that loads every split file.
Inspect the unlinked plan/work support files for obsolete contracts and external
uses before deleting or reconnecting anything. Reconnection is a behavior change,
not housekeeping. In particular, do not revive stale menus or shipping flows.

Do not read the full workflow manual merely to parse config. Read applicable
standards through their index and relevant sections of source artifacts. Reuse
already available unchanged evidence; re-open source when freshness is uncertain,
context was lost, or an authoritative check requires it. Retain substantive
checks even when their instructions are shortened.

Verification: add representative scenario cases under
`scripts/tests/fixtures/workflow-efficiency/` for decision, learning, solution,
session, refresh-solutions and cleanup. Check preservation of output location,
schema, provider, tracking, consent, and cleanup boundaries. Run the same cases
before/after, comparing observable behavior rather than prose structure.

Initial proposed target: at least 20% fewer skill-instruction bytes for
capture-learning and refresh-solutions, including newly loaded references.
Do not increase entry-only work → review → capture or plan → document-review
baselines after U2–U4; any justified increase must show retained quality and an
explicitly reviewed budget exception. These are proposed engineering targets,
not evidence of actual token or latency improvement. Keep the existing word caps.

### U3 — Add consequence-based review depth (P1)

Files: `skills/aw-review/SKILL.md`, a focused reference only if needed,
`docs/workflow/README.md` and its installer-owned source
`skills/aw-init/artifacts/workflow-readme.md`, plus README guidance.

Select and report depth, reason, reviewed scope, evidence, and omitted concerns:

| Depth | Trigger | Required treatment |
| --- | --- | --- |
| Lightweight | Bounded change whose likely failure is local and readily observable | One pass over actual diff, correctness and applicable standards; relevant test evidence |
| Focused | Behavior can fail silently outside the edited area; CI/check logic or lifecycle boundaries change | Lightweight coverage plus explicit failure scenarios and a fresh adversarial pass when available |
| Full | Auth, money, data-loss/migration, public contracts, or cross-cutting architectural risk | All applicable domain concerns, acceptance mapping, integration/rollout evidence, independent challenge when available |

Line count is a signal, never a downgrade rule. A one-line bypass of a failing
guard cannot take lightweight. Existing explicit quick-review delegation to the
harness stays valid for low-risk work; high-risk quick requests report the
uncovered checks and cannot yield a full-review claim. Explicit depth requests
can increase rigor; skipping a required concern needs a visible exception.

Keep current report/autofix permissions unchanged in this increment. Lack of an
independent reviewer must be reported, not replaced by a fabricated second opinion.
Use a deliberate separate failure-scenario pass where possible, label it as the
same reviewer, and block full completion if required evidence remains unavailable.
Record depth in the existing receipt summary; do not change gate schemas merely
to add a label. Receipt freshness does not prove review quality.

Verification: scenario fixtures for typo, local bug, one-line auth bypass,
silent CI pass, API contract, migration, large mechanical diff, unavailable peer,
and explicit quick review of risky code. Check severity/evidence and authority,
not exact phrasing. Include one intentionally introduced defect per risk class.

### U4 — Define compact execution handoffs (P1)

Files: `skills/aw-work/SKILL.md`, `skills/aw-check-workflow-compliance/SKILL.md`,
`skills/aw-ship/references/full-pr-workflow.md`, and the workflow manual/source.
Extend the existing Artifact Handoff Contract; do not introduce a parallel state
store, mandatory JSON file, new dispatcher, or routine re-reading of all manuals.

Use one compact envelope, emitted only when passing work to a consumer:

```yaml
status: complete | partial | blocked
source: plan/spec/ticket path or identifier
scope: base, HEAD, relevant live-diff identity and included files
result: short behavior summary and artifact paths
evidence: requirement/unit -> command or manual check, result, exception
remaining: blockers, uncertainty, deferred scope
next: intended consumer/action and existing authority limits
```

Omit inapplicable fields, use paths for large artifacts, and keep ordinary
handoffs near 300 words; never truncate failing evidence to meet that target.
Preserve effective test policy, README status and review/check evidence where
the next consumer needs them. A blocked return names the unresolved criterion.
No status or next-action field grants commit, publication, cleanup or deletion
authority. A custom provider that cannot return required evidence reports the
missing fields rather than fabricating success; accept equivalent legacy prose
when the consumer can verify it, so this is additive rather than a breaking API.

Consumer checks actual scope and artifacts before reusing evidence. Changed files,
new acceptance criteria, missing evidence or lost scope invalidate the affected
checks. Reuse does not waive independently configured freshness gates. Repeat only
invalidated stages, preserving separate review and compliance responsibilities.

Verification: scenario fixtures for successful/partial/blocked work, missing
evidence, unchanged return, changed HEAD, dirty tracked and untracked files,
custom provider with legacy prose, unavailable provider, unauthorized publication,
and one failed check among many passes. Confirm current scope is verifiable even
without a git commit and that an unchanged handoff does not rerun discovery.

### U5 — Add retirement conditions to conditional knowledge (P2)

Files: `skills/aw-capture/SKILL.md`,
`skills/aw-capture/references/solution-doc.md`, `skills/aw-refresh/SKILL.md`,
`skills/aw-synthesize-memory/SKILL.md`, `docs/solutions/README.md`, and its
installer-owned source `skills/aw-init/artifacts/solutions-readme.md`.

Add optional `retire_when` prose to learning/solution metadata: observable
condition, source to inspect, and the evidence that would make the guidance
obsolete. Example: retire a workaround only after the consuming repo uses a
fixed dependency version and a reproducer confirms the original failure is gone.
Never execute embedded commands just because a knowledge file names them.

Evaluate conditions during explicit maintenance/synthesis for scoped candidates,
not during every plan/work invocation. Missing condition preserves legacy
behavior. Age alone, an inaccessible URL, or an upstream closed issue is not
proof that the consuming repo no longer needs a workaround. Report unknown
conditions with the missing evidence; do not retire on inference.

For verified retirement, remove guidance from active retrieval/wiki and record
reason, checked date, evidence and successor when one exists. Preserve the file
as historical knowledge in this increment; physical deletion continues through
existing explicit maintenance/cleanup rules. Add a retired status only after
checking all index/wiki consumers. Active filters must exclude retired entries
without losing them from historical indexes. Do not apply this mechanism to
immutable decisions, living specs, local progress, or standards promotion.

Verification: fixtures for absent/met/unmet/unknown conditions, upstream fixed
but local dependency old, contradictory regression evidence, offline check,
malicious command text, existing tentative expiry, retired active learning,
and wiki/index filtering. Confirm corroboration rules and cleanup authority remain
unchanged; retirement does not automatically promote or delete anything.

### U6 — Verify each increment and document limits (P0 throughout)

Run targeted fixture checks and the context audit first, then
`bash scripts/test-install.sh` when skill/install/docs behavior changes.
The effective policy is `acceptance-first`: map R1–R6 to scenario evidence,
automate mechanical checks, and keep semantic review judgments as explicit
manual/agent-evaluation results. Add the shared evaluator instructions at proposed
`scripts/tests/fixtures/workflow-efficiency/README.md`: each case records its
input tree/diff, prompt, expected routing, required evidence, prohibited actions,
and observed result. Run the same cases against baseline and candidate skills;
include high-risk defect detection and low-risk over-escalation in the rubric.
Run the mechanical audit tests with
`python3 scripts/tests/test-skill-context-audit.py`. Do not make prose-matching
tests stand in for behavioral evidence. Report evaluation variability and any
unavailable runs; do not claim the fixture files alone prove agent behavior.

For added/changed guards, inject the exact violation and demonstrate failure,
then cover a near miss and an excluded case per Guard Verification. Keep helper
source and installed output synchronized if an increment touches `.scripts`.
Complete actual code/doc review and workflow compliance before any requested PR;
verify README and installer-source consistency. Do not ship a context reduction
that silently drops risk coverage. Publish nothing without a user request.

## Default workflow rules and evaluation

- Trivial edits keep the direct path; no automatic spec, plan, handoff file,
  compliance pass or peer reviewer is added.
- A contained fix uses work and targeted verification; review depth follows its
  consequence. Capture only justified knowledge, with the existing permission
  rules. Multi-session work alone loads progress guidance.
- Feature work selects applicable standards, performs one scoped review, and
  hands existing evidence to an authorized shipping step. Compliance remains a
  separate local audit before publication; it does not require redoing review.
- Memory retirement checks run during maintenance. Disabled design/e2e/pin and
  unconfigured providers add no reference reads for those capabilities.
- Measure unique instruction bytes and cumulative reads, tool calls and elapsed
  time where observable. Label tokenizer estimates, caching effects, unavailable
  provider data and unmeasured runtime load. Report quality outcomes beside cost.

## Risks and open questions

- Static route analysis cannot establish what a host actually loads. U1 must
  separate declared scenarios from observed session traces; no runtime token
  savings claim is justified by file sizes alone.
- Reference extraction can hide growing total routes. Judge complete scenarios,
  preserve existing budgets, and initially report route growth rather than add a
  new hard CI budget before calibration.
- Handoff freshness for uncommitted/untracked changes needs a cheap reproducible
  identity; choose the mechanism in U4 from existing scope helpers. Never treat
  matching HEAD alone as unchanged work.
- Retirement status requires checking all consumers. Prototype the filter on
  fixtures before writing real knowledge files; no bulk migration is planned.
- Peer review availability varies. Independent model execution remains deferred;
  a second provider is optional and must not become a common-path prerequisite.

## Handoff

Document review: checked scope, priorities, requirement-to-unit coverage,
implementability, context-load claims, test strategy and permission boundaries.
Clarified the shared scenario evaluation procedure during review. No blocking
document findings remain. Implementation-time choices are explicitly listed
above; no runtime quality or token-cost benchmark was performed in this planning run.

Plan and audit are ready for review. Implementation starts with U0/U1 only when
requested; then ship each accepted increment independently. Keep this proposal
separate from the existing consolidation workstream. No local progress record is
needed for this planning-only task. No commits, PRs, provider integrations or
knowledge retirements are authorized by writing this document.
