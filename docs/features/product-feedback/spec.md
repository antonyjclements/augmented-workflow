---
title: Product Feedback Triage
status: active
created: 2026-10-21
updated: 2026-10-21
tags: [workflow, feedback, triage]
related_decisions: []
---

# Product Feedback Triage

## Intent

Help maintainers reconcile product partner and tester feedback with accepted intent
and delivery evidence before handing it to existing AW execution skills.

## Current Behavior and Key Flow

`skills/aw-feedback/SKILL.md` owns bounded intake, concern reconciliation,
disposition and handoff. It reuses `aw-research` for Slack access and existing
specification, debugging and implementation routes. There is no new required gate.

## Acceptance Criteria

### AWFB-001 — Evidence and intent

Separate observations, expectations, proposals and decisions. Preserve provenance,
build/environment context and uncertainty. Conflicting feedback must not silently
supersede accepted intent or establish an unsupported cause.

### AWFB-002 — Actionable reconciliation

Reuse existing concern identifiers; distinguish duplicate symptoms from proven
duplicates. Split ready scope from policy blockers and return a reasoned disposition,
next action and observable acceptance. Repeat intake surfaces changes without
creating another backlog of unchanged concerns.

### AWFB-003 — Delivery and acceptance

Keep local, merged, deployed, distributed and tester-confirmed evidence distinct.
Tests or release availability cannot substitute for required device acceptance.

### AWFB-004 — Optional sources and permissions

Optional `feedback.sources.github.repositories` and `feedback.sources.slack.channels`
provide defaults. Explicit scope takes precedence; missing config works with supplied
sources. Slack research preserves the existing enterprise override. Configuration
never grants publication, scheduling, implementation or product-decision authority.
Triage returns drafts unless further action is authorized; authorized writes require
fresh destination context and verification.

## Boundaries

No new tracker, background monitor, implementation engine or mandatory config.
No external mutations or automatic product-intent changes during read-only triage.

## Verification

See [validation.md](validation.md) for four motivating examples and scope checks.
These are maintainer walkthroughs, not independent model-runtime evaluations.
