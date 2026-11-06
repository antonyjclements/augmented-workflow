---
generated: 2026-11-05
sessions_synthesized: 0
---

# Project Context Wiki

> Generated 2026-11-05 by aw-synthesize-memory from 0 session logs and current source artifacts. Do not edit manually.
> If older than 30 days or behind unprocessed sessions, verify against docs/features/, docs/decisions/, and docs/learnings/; rerun synthesis.

## Active Features

- **Product Feedback Triage** (active): reconcile partner reports with accepted intent and release evidence; publication requires authorization. `docs/features/product-feedback/spec.md`
- **Spec-Driven Augmented Workflow** (active): portable skills, safe installer migrations, configurable gates, and durable knowledge. `docs/features/augmented-workflow/spec.md`
- **Local Workstream Progress Tracking** (active): ignored checkout-local continuity and explicit human closure; progress is not gate evidence or synthesis input. `docs/features/progress-tracking/spec.md`
- **Experience Discovery** (active): inspect interpretation, obtain prototype agreement and gather human feedback. `docs/features/experience-discovery/spec.md`
- **Theory-Building Site Narrative** (active): artifacts help reconstruct understanding; functional checks cannot establish experiential fit. `docs/features/theory-building-site/spec.md`
- **Workflow Effectiveness Measurement** (broader programme draft): explicit local run evidence and manual improvement review are implemented; runtime comparisons remain unrun and proposals require human adoption approval. `docs/features/workflow-effectiveness/spec.md`

## Recent Decisions

- **Audit local workflow compliance before push** (2026-10-10): separate local evidence from publication; no artificial receipts. `docs/decisions/2026-10-10-audit-local-workflow-before-push.md`
- **Consolidate shipping entrypoints** (2026-10-10): distinguish commits, publication and description modes. `docs/decisions/2026-10-10-consolidate-shipping-entrypoints.md`
- **Consolidate spec entrypoints** (2026-10-10): preserve discovery/writing providers and verified migration ownership. `docs/decisions/2026-10-10-consolidate-spec-entrypoints.md`
- **Keep tracking inline** (2026-07-27): lifecycle hooks are unavailable in some environments. `docs/decisions/2026-07-27-keep-tracking-emit-in-skills.md`
- **Add opt-in skill tracking** (2026-07-27): local session-grouped JSONL supports analysis without outbound services. `docs/decisions/2026-07-27-add-opt-in-skill-tracking.md`

## Top Learnings

- **Verify current repository state** before assessment. `docs/learnings/2026-07-02-verify-repo-state-before-evaluating.md`
- **Blank ticket skill is an opt-out** of external ticketing. `docs/learnings/2026-05-24-blank-ticket-skill-is-opt-out.md`

## Tentative Learnings

Pending corroboration; visibility only, not authority.

- **Review before stamping**. `docs/learnings/2026-07-27-review-the-diff-before-stamping-the-gate.md`
- **Offer session capture manually**. `docs/learnings/2026-07-27-offer-session-capture-manually-hook-may-not-have-run.md`
- **Installed reference docs are spec output**. `docs/learnings/2026-07-27-installed-artifacts-are-spec-output-not-spec-source.md`
- **Record every configured gate**. `docs/learnings/2026-07-14-record-every-configured-gate.md`
- **Use explicit UTF-8 for Ruby**. `docs/learnings/2026-07-14-use-explicit-utf8-for-ruby-doc-processing.md`

## Known Dead Ends

- Hook-only tracking fails where hooks cannot run; preserve inline emission.
- Requiring a push before compliance creates a pre-push dependency cycle.
- Name-only skill retirement risks deleting customized content.

## Useful Sources

- `docs/workflow/config.yml`: configured steps and gates.
- `docs/standards/guard-verification.md`: prove guards fail when expected.
- `scripts/test-install.sh`: installation and drift checks.
- `.scripts/aw-gate.js`: evidence, validation, tracking and retention.
