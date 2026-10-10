# Shared Living-Spec Writer

This is the sole bundled procedure for creating/updating a living feature spec
and its index. Load it for the direct stage or after discovery has settled enough
intent. A provider-returned spec uses the same validation checks without a second
writer pass. Keep plans, task progress, story breakdowns, and immutable decisions
separate from durable current behavior and intent.

## Source and Boundary Checks

1. Read `docs/features/index.yml` and related specs. Reuse the existing relevant
   feature and update in place; do not create a duplicate or second feature merely
   because the request uses a different title. Ask if multiple boundaries match.
2. Read clarified requirements, relevant code/tests, imported PRDs, brainstorm
   notes, product docs, and recent decisions. Resolve conflicts explicitly.
   Do not infer new requirements from a filename or code alone without identifying
   uncertainty; observed implementation is evidence, not automatically accepted intent.
3. Load applicable standards through `docs/standards/index.yml` before writing.
   Apply spec-time annotations such as `[e2e]` only under the applicable standard.
4. Establish users, intended/current behavior, key flows, acceptance examples,
   scope boundaries, non-goals, and success criteria. Resolve blocking questions;
   label non-blocking questions deferred in `Open Questions / TODOs`. Clear input
   needs no compulsory interview. Use discovery only for consequential ambiguity.
5. Confirm external PRD preservation and any applicable `prd_review` evidence
   supplied by intake. Reuse an imported source rather than importing it twice.
   A missing source or unavailable provider blocks claims that depend on it.

## Write and Reconcile

- Create or update the smallest coherent `docs/features/<feature>/spec.md`.
  Preserve existing frontmatter, metadata, created date, custom sections, and the
  repo's format; update only fields affected by this change. Do not reset the file
  to the fallback template. Preserve stable requirement IDs for unchanged intent
  and use unique IDs for new requirements, following the traceability standard.
- For each feature-bearing requirement heading created or updated, call:
  `node .scripts/aw-gate.js trace-annotate spec --file <spec> --line <heading-line> --id <ID>`.
  Use the existing ID where present. The helper owns enablement and will no-op
  when disabled; do not skip annotations by checking `trace.enabled` yourself.
  If the helper is unavailable, report the missing mechanism; do not invent
  annotation evidence. Parallel workers return annotation intents to their coordinator.
- Link source PRDs, ideation/brainstorm notes, and decision records when they exist.
- Update the matching entry in `docs/features/index.yml`, preserving its existing
  schema and unrelated entries. Create the default index shape only when absent.
- Only after the spec exists, update source PRDs under `docs/product/prds/` and
  their index with lifecycle metadata: `status: promoted`, `promoted: YYYY-MM-DD`,
  and `promoted_to: docs/features/<feature>/spec.md`. Keep each PRD body unchanged;
  only frontmatter/index metadata changes. Preserve existing source provenance
  and unrelated metadata. Do not automatically archive or delete promoted PRDs.
- Run the enabled, non-empty `spec_review` hook with the final spec path before
  human review or planning. Reuse current evidence from the producing provider;
  otherwise run the missing hook once or report the blocker. Follow the router's
  evidence contract; do not re-author a spec to obtain hook evidence.

## Default Spec Format

Use only when the repo has no applicable format:

```markdown
---
title: <Feature Name>
status: active
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags:
  - <tag>
related_decisions: []
---

# <Feature Name>

## Intent

## Users

## Current Behavior

## Key Flows

## Acceptance Criteria

## Boundaries and Non-Goals

## Open Questions / TODOs

## Decision Links
```

## Default Index Format

```yaml
features:
  - key: <feature-folder>
    title: <Feature Name>
    spec: docs/features/<feature-folder>/spec.md
    status: active
    tags:
      - <tag>
```

## Validate the Actual Output

Read the written spec, matching index entry, source PRD bodies, and lifecycle
metadata. Check evidence-backed behavior, normal and edge acceptance examples,
clear boundaries, stable IDs, applicable standards/annotations, source links,
unchanged PRD bodies, and labeled blocking/deferred questions. Verify paths are
repo-relative. Confirm the required applicable hook evidence describes this actual
output, not an older artifact. A provider's claimed path alone is insufficient.

A custom provider that returned an incomplete spec must reconcile its own output
or report the remaining gap; do not silently replace it with this writer. If
planning would still have to invent behavior, report the blocking question rather
than labeling the spec ready.

## Human Review and Handoff

Offer product/human review only when `human_review.spec.reviewers` is configured,
the change is high-risk, or the user asked for review. Otherwise finish without
an extra review question. If review is wanted, resolve the configured
`request_human_review` step (default `aw-request-human-review spec <spec path>`).
Creating a spec alone is not authorization to open a review PR.

Return the spec path, feature-index update, PRDs marked promoted, decisions worth
logging, open questions, hook evidence/blockers, and human-review status. Recommend
`aw-plan <spec path>` when planning is needed; a lightweight ready task may go to
`aw-work` only when requested, scope/success criteria/boundaries are clear, and no
meaningful technical or research questions remain.
