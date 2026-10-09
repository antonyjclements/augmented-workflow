# Progress Tracking Verification

Date: 2026-10-09. Policy: `acceptance-first`. Scope: instruction-led version 1.
Implementation is on `codex/local-progress-tracking`. Human acceptance received;
the user subsequently authorized committing and pushing directly to `main`.

## Automated checks

- `bash scripts/test-install.sh`: passed after implementation. Covers default
  install without gates, gate-enabled install, both reinstall paths, exact rule
  count, final-newline preservation, ignored/untracked sample, trackable template
  and docs, root-only scope, allowed nearby tracked files, and forced-tracked
  collision refusal with guidance/ignore/record/index preserved.
- Red test before implementation: the default ignore assertion failed because
  the installer created no workstream ignore rule.
- Guard negative test: forced-add of a progress file makes installation exit
  nonzero with `tracked workstream collision` and `explicit migration decision`.
  The nearby tracked `.aw/other.md` is accepted before this injection.
- Tracking drift guard: temporarily appended a line to the generated
  `docs/workflow/tracking.md`; the suite exited 1 with the expected self-hosted
  drift message. Restored the file immediately.
- `bash -n skills/aw-init/scripts/install.sh scripts/test-install.sh`: passed.
- `git diff --check`: passed.
- `node .scripts/aw-gate.js validate`: passed (derived state and learning audit).
- `node .scripts/aw-gate.js trace --base origin/main`: exited 0 with existing
  EXD/TBS code-anchor warnings. New untracked spec/tests are also checked manually;
  no claim that this command alone validates untracked acceptance coverage.
- Shipping trace subsequently exposed missing discoverable anchors after the new
  spec was committed. `progress-tracking.feature` now links installer scenarios
  and explicitly manual lifecycle walkthroughs to PROG-001 through PROG-005.
  These anchors claim coverage, not automated behavioral replay.
- Spec and actual local record YAML frontmatter parse as mappings; the record
  matches the exact ignore rule and remains outside the Git index.

## Lifecycle scenario review

These are manual contract walkthroughs against the shipped instructions, not
automated executions of future agent sessions. No runtime lifecycle helper exists.

| Requirement / scenario | Reviewed behavior and evidence |
| --- | --- |
| PROG-002: explicit ID/path; two matching plans; no record | `aw-work` Phase 0 checks records before plan selection; discovery in `references/progress-tracking.md` prioritizes explicit selection, asks among matches, prohibits recency selection and leaves short tasks lightweight. |
| PROG-002: changed branch/HEAD/plan/dirty files, PR or running job | Discovery compares live context before acting, reconciles mismatches, and reruns affected checks; old observations remain historical. |
| PROG-002: newer version or corrupt/missing selected record | Unsupported records stay unchanged; recovery creates a separate uncertain candidate and preserves the original. |
| PROG-003: stable U IDs, planless T IDs and later plan | Template separates implementation/verification; discovery restores IDs and requires explicit T-to-U mapping. |
| PROG-003: human notes, unexpected revision, parallel worker update | Coordinator rereads/reconciles, preserves unknown fields/notes and accepts structured worker reports; workers never rewrite the snapshot. No lock is claimed. |
| PROG-003: blocked or paused, long checkpoint history | Template requires reason/resume condition; checkpoint instructions bound history to 10 entries while retaining relevant failures/evidence in the snapshot. |
| PROG-004: passed test, merged PR or disabled gate returns success | Closure still runs AW verification/review; actual checks and skips are recorded. Notes and no-op gates cannot establish proof or authorize closure. |
| PROG-004: silence, acceptance only, cancellation | Retain by default. Only acceptance closes as complete; cancellation closes as cancelled with unfinished scope visible. Disposition remains separate. |
| PROG-004: export then remove; traversal, symlink or tracked record | Verify authorized export before separately approved removal; cleanup rereads, rejects unsafe paths/tracked collisions, and deletes only the exact approved file. |
| PROG-004: default archived scan or memory synthesis | Explicit progress cleanup is excluded from generic scans/`all`; `closed` is not archived cleanup permission. No automatic ingestion of active progress. |
| PROG-005: new worktree and authorized transfer | Worktree guidance forbids automatic copy, names both paths, checks destination collisions, preserves ID/notes, pauses/relinquishes source and revalidates destination with one coordinator. Old gate proof is not imported. |

## Review and compliance

Full tracked diff and new spec/plan/reference files reviewed sequentially for
correctness, testing, maintainability, standards, agent access, relevant learnings,
and adversarial data-loss cases. Added creation collision/path checks during review.
No remaining actionable code or document findings.

Acceptance mapping: PROG-001 has installer regression tests; PROG-002 through
PROG-005 have the explicit contract walkthroughs above. Installed guidance was
regenerated via the installer into a scratch repo, then only affected generated
files copied back. Source/output drift and skill/routing word budgets pass through
the install suite. README updated. Design and e2e are disabled in repository config.

Implementation checks pass. Direct push to `main` is authorized; pre-push gates
and remote state are checked before shipping. Gate stamps record the review,
separately from the human's acceptance and shipping authorization.

## Limits and follow-up

No lock, atomic-write helper, synchronization or backup is implemented. Manual
contract checks do not prove how every future agent will follow instructions.
No live destructive cleanup, real external export or autonomous cross-session
agent drill was run. Those operations need the human's specific choices; the
instruction-led scope does not justify performing them just to test the guidance.
The human accepted completion. The local record is retained by default; export
or removal was not requested. No new durable decision beyond the supplied proposal
required capture; the agreed behavior is retained in the spec.
