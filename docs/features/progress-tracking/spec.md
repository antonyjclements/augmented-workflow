---
title: Local Workstream Progress Tracking
status: active
created: 2026-10-09
updated: 2026-10-09
tags:
  - workflow
  - continuity
related_decisions: []
---

# Local Workstream Progress Tracking

## Intent and Users

Give agents and humans a short, checkout-local execution record for work that
crosses sessions. Plans own decisions; configured tickets keep their authority;
progress owns continuity. Ordinary short tasks retain the lightweight path.

## Acceptance Criteria

### PROG-001 — Local installation

Default and gate-enabled installs add exactly one `/.aw/workstreams/` ignore
rule, including on reinstall and when `.gitignore` lacks a final newline.
Records remain ignored and untracked while templates and durable docs remain
trackable. Tracked files under this directory stop installation before repository
files are changed, with an explicit migration message. Never untrack them silently.

### PROG-002 — Accurate resume

Resolve an explicit ID/path first, otherwise a matching plan, ticket, or spec.
Ask when several candidates match; never choose by recency. Reconcile repository,
checkout when recorded, branch, HEAD, sources, working-tree changes, jobs, and PR
state before acting. Restore stable U IDs or workstream-local T IDs and next action.
Unsupported versions remain unchanged; corrupt originals are preserved while a
separate recovery candidate marks uncertainty. Historical results are not current proof.

### PROG-003 — Safe checkpoints

Use a versioned Markdown record at `.aw/workstreams/<slug>-<suffix>/progress.md`.
Include context, goal/source, next action, evidence, closure choice, and separate
coordination and completion states. Blocked/paused records name a reason and unblock
condition. One coordinator rereads before writes, reconciles unexpected revisions,
preserves human notes and unknown fields, and keeps bounded checkpoints. Unit
implementation and verification outcomes are separate. T-to-U mapping is explicit.

### PROG-004 — Human closure and cleanup

Verification and review still run through existing AW flows. Prepare closure as
`awaiting-human` / `ready-for-review`, with checks, skips, risks, remaining scope,
and worthwhile knowledge offered through `aw-capture`. Acceptance and disposition
are separate choices. Silence or completion alone retains the file. Cancellation
does not complete unfinished units. Removal requires approval for the exact file
and loss of local-only contents, safe path/symlink checks, and verified export when
requested. `closed` does not authorize archived-artifact cleanup. Active progress
is never automatically ingested into memory or synthesis.

### PROG-005 — Deliberate handoff

Fresh clones and worktrees do not inherit records. An authorized transfer names
source/destination, preserves identity, pauses the source, relinquishes its
coordinator, assigns destination context/ownership, and revalidates sources and
evidence. Only one copy actively coordinates; old gate state is never transferred
as current verification.

## Boundaries and Non-Goals

Version 1 is instruction-led and works without gate scripts. No synchronization,
locking helper, runtime parser, automatic deletion, secret storage, or backup is
provided. Read-before-write is not a lock. Git ignore does not protect against
forced staging, `git clean -x`, or checkout loss.

## Sources

User-supplied *Progress tracking for Augmented Workflow*, 9 October 2026;
implementation references: `skills/aw-work/`, `skills/aw-init/`,
`skills/aw-refresh/`, and `skills/aw-create-worktree/`.

## Open Questions

None for version 1. A lock/revision helper is deferred.
