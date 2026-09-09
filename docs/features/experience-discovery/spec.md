---
title: Experience Discovery
status: active
created: 2026-09-08
updated: 2026-09-08
tags:
  - discovery
  - human-experience
  - prototyping
related_decisions: []
---

# Experience Discovery

## Intent

Help people inspect and correct an agent's interpretation of an intended human
experience before investing in implementation. Theory exists in human minds and
can differ between team members. Artifacts express partial evidence of that
understanding; an agent does not possess Theory by reading them.

Use AI to supplement human weaknesses, expose assumptions, and make results
inspectable. Preserve useful requirements, standards, and learnings without
claiming to capture the entirety of human intent. Prototypes and implementation
plans may be disposable once their purpose is served.

Source: `docs/brainstorms/2026-09-08-001-aw-next-directions-idea.md`.

## Users

People shaping product experiences with coding agents, including teams whose
members may hold different interpretations of the desired outcome.

## Current Behavior

The repository's brainstorm skill defines the experience-discovery loop and
work intake routes relevant uncertainty into it. The loop does not depend on
design hooks. Configured discovery hooks retain their final brainstorm
checkpoint and receive interpretation, agreement scope, feedback, and unresolved
questions. Hook configuration is not prototype authorization; hooks reuse prior
context and report unsupported behavior. New findings are reconciled before
handoff without recursive hook calls.

Manual acceptance scenarios are recorded in
`docs/features/experience-discovery/experience-discovery.feature`. Controlled
agent-conversation results are recorded in
`docs/features/experience-discovery/replay-results.md`. These behavioral samples
do not prove universal agent compliance or experiential fit. Global installed
skills have not been refreshed by this change.

The motivating user report concerns aw-cli metrics: charts were technically
correct but missed the intended combination of visual pleasure, meaningful
insight, and seeing how AW's parts work together, despite supplied references.

## Key Flows

1. Establish what people should understand, accomplish, and feel.
2. Explain the agent's interpretation of references and the uncertainty that a
   prototype would help resolve.
3. If exploration was not explicitly requested, suggest it and wait for agreement.
4. Once authorized, create a small disposable prototype that tests the uncertainty.
5. Obtain a human reaction before treating experiential intent as settled.
6. Carry useful discoveries into living intent; retain only artifacts with an
   ongoing purpose.

## Acceptance Criteria

### EXD-001 — Two entry points

An explicit user request for experience exploration can start the loop. Otherwise,
an agent may suggest it when emotional goals, references, or materially different
plausible experiences leave important uncertainty. Routine UI changes alone do
not require a prototype.

### EXD-002 — Agreement precedes a suggested prototype

The suggestion explains what the prototype would clarify. The agent waits for
user agreement before creating it. Silence is not agreement. An explicit request
to create a prototype already supplies authorization within its stated scope.
If the user declines, the agent does not create a prototype or claim that the
unresolved experiential assumptions were validated.

### EXD-003 — Interpretation is inspectable

The agent connects intended understanding, useful actions, and emotional response
to its interpretation of relevant references. References alone do not establish
that this interpretation matches the human's intent.

### EXD-004 — Human reaction supplies experiential evidence

The prototype tests the stated uncertainty and is presented for a human reaction.
Functional correctness or process checks alone cannot settle experiential fit.
If feedback shows a mismatch, that mismatch remains explicit until addressed or
consciously deferred by the user.

### EXD-005 — Preserve learning with proportionate ceremony

Useful discoveries update living intent. Disposable artifacts need not become
permanent records. Existing user work is not deleted merely because it was used
as a prototype. The loop fits existing discovery rather than requiring every
change to produce a new document or new skill invocation.

## Boundaries and Non-Goals

- No automatic prototype creation from an agent suggestion.
- No assertion that agents or artifacts possess human Theory.
- No replacement of human experience judgment with passing tests.
- No implementation or redesign of aw-cli metrics in this brainstorm.
- No mandatory prototype for every UI change.

## Open Questions / TODOs

- Ongoing verification: rerun relevant conversation scenarios when the discovery
  instructions or hook contract change.
- Deferred to each use: choose prototype medium and scope for the uncertainty.
- Evaluation: test on a real change whether the loop exposes an interpretation
  mismatch before full implementation. The motivating example suggests benefit;
  it does not yet demonstrate it.

## Decision Links

No immutable decision record created. This spec captures the agreed direction
and repository guidance; it does not claim human-review completion.
