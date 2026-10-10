---
generated: 2026-10-10
sessions_synthesized: 0
---

# Project Context Wiki

> Generated 2026-10-10 by aw-synthesize-memory from 0 session logs and current source artifacts. Do not edit manually.
> If older than 30 days or behind unprocessed sessions, verify against docs/features/, docs/decisions/, and docs/learnings/; rerun synthesis.

## Active Features

- **Spec-Driven Augmented Workflow** (active): portable skills, safe installer migrations, configurable gates, and durable knowledge. `docs/features/augmented-workflow/spec.md`
- **Local Workstream Progress Tracking** (active): ignored checkout-local continuity, explicit handoff and human closure; progress is not gate evidence or automatic synthesis input. `docs/features/progress-tracking/spec.md`
- **Experience Discovery** (active): inspect interpretation, obtain agreement before suggested prototypes, and gather human feedback. `docs/features/experience-discovery/spec.md`
- **Theory-Building Site Narrative** (active): artifacts help people reconstruct understanding; functional checks cannot establish experiential fit. `docs/features/theory-building-site/spec.md`
- **Workflow Effectiveness Measurement** (draft): evaluate compounding through repeat-correction and capture rates. `docs/features/workflow-effectiveness/spec.md`

## Recent Decisions

- **Audit local workflow compliance before push** (2026-10-10): separate local evidence from publication; no artificial receipts. `docs/decisions/2026-10-10-audit-local-workflow-before-push.md`
- **Consolidate shipping entrypoints** (2026-10-10): aw-ship distinguishes local commits, publication, and description modes with explicit mutation boundaries. `docs/decisions/2026-10-10-consolidate-shipping-entrypoints.md`
- **Consolidate spec entrypoints** (2026-10-10): aw-spec preserves independent discovery/writing provider contracts and content-verified migration ownership. `docs/decisions/2026-10-10-consolidate-spec-entrypoints.md`
- **Keep tracking inline** (2026-07-27): deployment environments cannot rely on lifecycle hooks. `docs/decisions/2026-07-27-keep-tracking-emit-in-skills.md`
- **Add opt-in skill tracking** (2026-07-27): local, session-grouped JSONL supports workflow analysis without outbound services. `docs/decisions/2026-07-27-add-opt-in-skill-tracking.md`

## Top Learnings

- **Verify current repository state**: inspect actual code, configuration, and decisions before assessment. `docs/learnings/2026-07-02-verify-repo-state-before-evaluating.md`
- **Blank ticket skill is an opt-out**: skip external ticketing when its configured skill is blank. `docs/learnings/2026-05-24-blank-ticket-skill-is-opt-out.md`

## Tentative Learnings

Pending corroboration; visibility only, not authority.

- **Review the diff before stamping the gate**. `docs/learnings/2026-07-27-review-the-diff-before-stamping-the-gate.md`
- **Offer session capture manually**. `docs/learnings/2026-07-27-offer-session-capture-manually-hook-may-not-have-run.md`
- **Installed reference docs are spec output**. `docs/learnings/2026-07-27-installed-artifacts-are-spec-output-not-spec-source.md`
- **Record every configured gate**. `docs/learnings/2026-07-14-record-every-configured-gate.md`
- **Use explicit UTF-8 for Ruby processing**. `docs/learnings/2026-07-14-use-explicit-utf8-for-ruby-doc-processing.md`

## Known Dead Ends

- Hook-only tracking cannot work in environments forbidding hooks; preserve inline emission.
- A push prerequisite for local compliance creates a circular pre-push dependency.
- Name-only skill retirement risks deleting customized content; verify ownership.

## Useful Sources

- `docs/workflow/config.yml`: configured steps and gates.
- `docs/standards/guard-verification.md`: prove guards fail when expected.
- `scripts/test-install.sh`: installation and drift checks.
- `.scripts/aw-gate.js`: receipts, validation, tracking, and retention.
