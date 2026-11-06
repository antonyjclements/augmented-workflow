---
status: completed
created: 2026-11-06
origin: user-request
spec: docs/features/workflow-effectiveness/spec.md
depth: lightweight
---
# Local evidence and manual improvement review

## Problem and Scope
Implement the bounded first slice, preserving the existing session/learning loop.
No automatic worker, knowledge promotion, shipping, or broader metrics programme.

## Requirements and Existing Patterns
WFE-001 through WFE-004 in the living spec. Reuse the dependency-free shipped
`skills/aw-init/artifacts/aw-gate.js` and its self-hosted copy, `aw-capture`,
`aw-synthesize-memory`, and the existing session identifier citation convention.
Applicable standards: `docs/standards/coding-approach.md`,
`docs/standards/traceability.md`, `docs/standards/guard-verification.md`.
Test policy: acceptance-first. Each unit maps to the checks below.

## Decisions
Allocate the final source identifier early instead of introducing transient UUID
citations. Keep an independent explicit run UUID; TTL tracking cannot identify a
task. Store curated task evidence locally; existing session logs own provenance.
Exact topic grouping retrieves candidates; a human/agent review judges meaning.
Keep the CLI read-only on review and reject unsupported input rather than guessing.

## Implementation Units
- U1: helper start/finish/review commands and installer ignore rule (WFE-001/002).
  `test/gate/run-evidence.test.ts`: lifecycle, collisions, parallel IDs, invalid
  fields and paths, symlinks, evidence sections, empty capture, missing/changed/
  archived source, immutable terminal runs, tracking-disabled, no shell execution.
- U2: capture provenance and opt-in synthesis review (WFE-002/003).
  `test/skills/run-evidence-contract.test.ts`: lazy routing, early real source,
  reuse at wrap-up, active/uncommitted retention, proposal and approval boundaries.
- U3: usage and frozen evaluation scenarios (WFE-004).
  `test/skills/run-evidence-cases.json` and `run-evidence-evaluation.md` distinguish
  executed helper checks from fresh-agent trials; no behavioral claim without runs.

## Verification and Review
Run focused CLI/contract suites, gate/skills/installer suites and install smoke,
validate/trace, syntax and whitespace checks. Review this plan before code and
final diff against the spec before compliance. No human reviewers are configured;
this opt-in local feature requires no separate pre-implementation sign-off.

## Risks and Deferred Work
Agent summaries can misdescribe events. Digests establish identity, not truth.
Unknown capture and missing sources limit coverage. Local records are not backed
up. Fresh-agent comparison requires an available authorized runtime; unrun trials
block claims, not delivery of the mechanism. Broader outcome joins, semantic
clustering, dashboards, rate metrics, scheduling and automatic adoption are deferred.

## Handoff
Implement through `aw-work docs/features/workflow-effectiveness/plan.md`.
