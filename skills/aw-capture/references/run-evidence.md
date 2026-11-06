# Explicit Local Task Evidence

Use only when the user opts in to recording a task/run. This route supplements
ordinary capture; it never enables a background emitter. The installed helper
is required for structured records; if missing or `run` is unsupported, report
that limitation and continue ordinary session/learning capture without fabricating
a run record. No tracking setting is required. Do not install/upgrade automatically.

## Start

Choose a distinct final source session identifier. With the helper present:

```sh
node .scripts/aw-gate.js run start --session YYYY-MM-DD-task-slug --summary "Task attempted"
```

Keep the returned `run_id` and `session_id` explicitly in the task context. The
command writes `.aw/runs/<UUID>.json` and an existing-format source log at
`docs/sessions/<session_id>.md`. Start refuses collisions and requires the narrow
`/.aw/runs/` ignore rule. Never select a task by TTL tracking, branch or recency.
Use one writer per run; parallel tasks use distinct run/source IDs.

## During Work and Finish

Capture facts under the source log's existing sections. Live corrections cite
this final source identifier in learnings. Before finish, update the source with
actual outcomes, checks and concise correction/rework summaries. Do not copy
transcripts, private discussion, command output or credentials. The helper bounds
input but cannot detect all sensitive content or independently prove a summary.

Write a curated input at `.aw/tmp/run-report.<token>.json`, then run:

```sh
node .scripts/aw-gate.js run finish --id <run_id> --input .aw/tmp/run-report.<token>.json
```

Schema (all report keys required; unknown fields are refused):

```json
{
  "outcome": "completed",
  "summary": "Implemented the scoped change; runtime comparison remains unrun",
  "corrections_status": "reviewed",
  "checks": [
    {"name": "focused unit tests", "status": "passed",
     "evidence": {"session": "YYYY-MM-DD-task-slug", "section": "What Worked"}},
    {"name": "fresh-agent comparison", "status": "not-run", "reason": "No runtime trials executed"}
  ],
  "corrections": [
    {"kind": "correction", "topic": "source-provenance",
     "summary": "User corrected the missing source citation",
     "evidence": {"session": "YYYY-MM-DD-task-slug", "section": "Corrections Made"}}
  ]
}
```

Outcomes: `completed`, `partial`, `abandoned`, `unknown`; missing finish stays
`active`. Checks: `passed`, `failed`, `skipped`, `not-run`, `unknown`. Observed
results need a nonempty source section; unobserved checks need a reason. Check
results are **agent-reported**, not independently executed by this command.
Use `corrections_status: unknown` when the conversation was not reviewed for
corrections; an empty corrections array alone does not establish none happened.
`kind: rework` distinguishes observed repeated repair from explicit user correction.
Topic labels are explicit retrieval hints, not a claim of semantic equivalence.

Finish records a source digest and observed Git context and freezes the run.
Do not edit its evidence afterwards; new work starts a new run. Ordinary synthesis
may change `status` to processed without invalidating the digest. Source retention
must first verify an exact Git archive. Local records are not committed/backed up;
ignore rules do not prevent forced adds. Retain by default; removing an exact
local-only file needs the user's authorization. Source summaries still follow the
ordinary session-log separate-commit convention. Never commit automatically.

Return the run ID, source identifier, outcome, checks and unknowns; suggest
`aw-synthesize-memory review-runs` only when a cross-run review would be useful.
