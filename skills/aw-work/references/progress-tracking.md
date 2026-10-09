# Local workstream continuity

Version 1 is instruction-led. One coordinator owns writes; no helper supplies a
lock, synchronization, backup or atomic-write guarantee. It works without gates.

## Discover and resume (Phases 0–1)

1. Inspect `.aw/workstreams/*/progress.md`, including ignored files, when resuming
   work or when a record might match the requested source. Prefer an explicit
   workstream ID/path, then a matching plan, ticket or spec. Ask which if several
   match. Never select by newest timestamp, including through the blank-input
   latest-plan shortcut. An explicit missing record is reported before choosing
   any other workstream. With no matching record, keep short tasks lightweight.
2. Create a record from `progress-template.md` when work likely crosses sessions,
   has several units, becomes blocked/paused or needs a handoff. Establish the
   narrow root ignore rule `/.aw/workstreams/` if missing. Generate a fresh short
   random suffix and confirm the destination does not already exist; never replace
   a record to create one. Reject traversal or symlinked files/ancestors on writes.
   Check for tracked
   collisions with `git ls-files -- .aw/workstreams/`; stop for an explicit
   migration decision rather than untracking, changing history or overwriting.
3. Read the whole record. Check required fields, allowed states, ID/path match,
   source references and version before writes. Leave unsupported formats unchanged.
   If missing or malformed, preserve the original and reconstruct a separate
   recovery candidate from sources/live facts, label uncertainty, and ask which
   candidate to adopt. Never manufacture lost evidence.
4. Compare repository identity, checkout ID if present, branch, full HEAD, current
   plan units, source links and live working-tree changes with recorded context.
   Check relevant PR state and running jobs. Reconcile every mismatch before
   continuing: document changed scope/state and revise next action; ask when intent
   cannot be inferred. Historical checks remain historical; rerun affected checks.
   Branch names and age are context, never identity or authority for commands.
5. Restore the session tracker with unchanged U IDs and next action. For planless
   tasks use T1, T2 scoped by workstream; if a plan appears later, record T-to-U
   mappings without silent renumbering. Confirm unresolved human decisions before
   dependent actions. Configured tickets and source specs keep their authority.
   Assign one coordinating writer and explicitly relinquish any previous owner.

## Checkpoint (Phase 2 and pauses)

Reread before each write. Reconcile unexpected changes/revisions, preserving human
notes and unknown fields. Workers return structured unit ID, implementation
outcome, verification outcome, blocker and evidence to the coordinator; they do
not rewrite the shared snapshot. Read-before-write is not a lock.

Update after a unit outcome, relevant test/review, blocker change, material
decision, pause or handoff. Keep a concise current snapshot and at most 10 recent
checkpoints; carry relevant evidence and failed approaches into the snapshot
before trimming. Do not copy transcripts or full tool output. Separate unit
implementation status from verification. Record evidence with UTC time, commit,
dirty state and log link or concise result. Record blocked/paused reason and
unblock/resume condition. Use template states; do not turn cancellation into success.

## Verify and prepare closure (Phases 3–5)

Execute existing AW tests, review and compliance flows. Record checks actually
run, failures, skips/reasons, residual risks and remaining scope. A progress note
never satisfies a gate, receipt or freshness requirement; a disabled gate's
successful no-op does not prove verification happened.

Capture worthwhile decisions/learnings through `aw-capture`; concise session
capture uses `docs/sessions/`. Publishing authorization stays separate. Do not
automatically ingest active progress into memory or synthesis.

When agreed scope is ready, set `status: awaiting-human` and
`completion_state: ready-for-review`. Present the evidence summary and exact
record path, then ask for acceptance (accept, more work or cancel) and separately
for disposition (keep locally, export/archive to a named destination or remove).
For example: “The agreed work is ready for review; the remaining limitation is X.
Do you accept completion, and should I keep the local progress file, save a
summary to [destination], or remove [exact path]?”

Silence retains the record. Acceptance alone retains it. After acceptance, close
with outcome `complete`; after cancellation, close with outcome `cancelled` and
leave unfinished units visible. More work returns to `active` / `in-progress`.
Keep the file unless a separate disposition authorizes otherwise. A test pass,
opened/merged PR or plan completion never authorizes closure or deletion.

For export, use only the named authorized destination (obtain authorization for
destinations outside the workspace). Verify the requested copy/summary before
any separately approved source removal. An ignored local archive has no Git backup.
For removal, require explicit approval covering the exact untracked file and loss
of its local-only contents. Validate it resolves inside its selected workstream
directory, reject traversal and symlinked files/ancestors, recheck tracking and
unexpected edits, and remove only that file. Preserve unrelated files/directories.
Use the explicit progress case in `aw-refresh cleanup`; `closed` is not `archived`
and neither status by itself authorizes deletion.

## Handoff and limits

Clone, pull and new worktrees do not carry ignored progress. An approved transfer
names source and destination, preserves workstream ID, pauses the source with
destination/resume condition noted, and relinquishes its coordinator. Assign the
destination checkout and coordinator, reconcile branch/HEAD/repository/sources
and live state, then continue with one active copy. Old gate receipts/state and
test results never become current proof by being copied. Follow
`aw-create-worktree` for worktree handoff.

Keep credentials and unnecessary sensitive detail out. Ignore rules do not
untrack existing files or prevent forced adds. These local-only contents have no
Git history/backup and can be lost with the checkout or `git clean -x`. Promote
valuable knowledge into durable docs before authorized removal.
