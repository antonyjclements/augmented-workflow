---
title: Audit local workflow compliance before push
date: 2026-10-10
status: active
tags:
  - workflow
  - shipping
related_specs:
  - docs/features/augmented-workflow/spec.md
supersedes:
  - docs/decisions/2026-06-07-add-workflow-compliance-check.md
---

# Audit local workflow compliance before push

## Context

The original compliance decision required a pushed branch. A pre-push freshness
gate can require that same audit, creating a circular prerequisite. The user
explicitly requested removing the skill's push prerequisite on 2026-10-10.

## Decision

Audit a verifiable local committed/worktree scope without requiring a push,
upstream, or remote access. Report publication evidence separately from the
compliance verdict. Missing required test/review evidence and insufficient local
scope still block a compliance pass.

Full-PR shipping runs the genuine audit before push, repeating affected checks
when substantive audited content changes. Expected append-only workflow metrics
receive a bounded, untracked closure inspection rather than a recursive audit;
final configured gate failures still block. Publication requires successful push verification
and remains independently authorized. Never manufacture freshness receipts.

This supersedes only the prior decision's push prerequisite, timing, and coupling
of push failure to compliance. Its other workflow checks remain unchanged; the
original decision is preserved as historical evidence.

## Consequences

Offline and unpublished work can be audited. Pre-push enforcement can consume
real audit evidence without a bootstrap bypass. A valid local compliance result
does not assert that publication succeeded.
