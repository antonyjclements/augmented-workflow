# Local progress record — format version 1

Copy the fenced Markdown to `.aw/workstreams/<slug>-<random-suffix>/progress.md`.
Use a stable slug plus a short random suffix, not a branch or session name.
Replace placeholders with observed facts; use `null` for absent source links.
Read `progress-tracking.md` before creating or resuming a record.

Required header: version, workstream ID, repository identity, branch, full observed
HEAD (or `null` for an unborn repository), UTC update time, status, completion
state. Required body: goal or source reference, units when applicable, concrete
next action, relevant evidence (including not-run), and closure choice.

Coordination `status`: `active`, `blocked`, `paused`, `awaiting-human`, `closed`.
Outcome `completion_state`: `in-progress`, `ready-for-review`, `complete`, `cancelled`.
Blocked/paused records require a reason and unblock/resume condition. These axes
are independent: closed/cancelled retains unfinished scope. Optional fields include
coordinator, checkout ID, revision, extra source links and running-job references.
Preserve unknown fields and human notes; never overwrite an unsupported version.

```markdown
---
format_version: 1
workstream_id: <slug>-<random-suffix>
repository: <remote identity or local repository identity>
branch: <branch or detached>
last_observed_head: <full hash or null>
updated_at: <UTC ISO 8601 timestamp>
status: active
completion_state: in-progress
plan: null
spec: null
ticket: null
---
# <Workstream title>

## Goal
<Agreed outcome and source links; paths are repository-relative.>

## Current state and units
- U1 — implementation: pending; verification: not-run. <Scope>
<!-- Use the actual plan IDs, or T1, T2 for planless work. Keep the axes separate. -->

## Decisions and next action
Outstanding human decisions: none.
Next: <One concrete action with enough context to execute.>
Blocker / pause reason: none.
Unblock / resume condition: not applicable.

## Evidence and recent checkpoints
- <UTC time> — <unit/outcome/check>; commit: <full hash>; dirty: <paths or clean>;
  result: <passed/failed/skipped/not-run>; evidence: <log/artifact link or summary>.
<!-- Keep at most 10 recent checkpoints; retain relevant failures and evidence links
     in the current snapshot before dropping older entries. Never invent results. -->

## Human notes
<!-- Preserve human-authored text. -->

## Closure
Acceptance: pending.
Disposition: keep until explicitly chosen.
Verification summary: not-run.
Skipped checks, remaining scope, risks: <Details or none.>
Durable capture: <Links, offered capture, or none needed.>
```
