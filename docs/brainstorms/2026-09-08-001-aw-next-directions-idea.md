# Where AW Goes Next

Created: 2026-09-08
Status: draft

## Problem and Evidence

AW already provides intake, living intent, implementation routing, review,
verification, and memory artifacts. The next investment should make that existing
system more useful in everyday work. This is an exploratory shortlist, not an
approved roadmap or feature contract.

- `README.md` positions the repository as the shared memory boundary.
- `docs/features/theory-building-site/spec.md` emphasizes helping later
  contributors reconstruct understanding from evidence.
- `docs/features/workflow-effectiveness/spec.md` records a small historical
  consuming-repo sample where capture happened but synthesis was not evidenced.
  This is a hypothesis-generating observation, not a current adoption survey.
- `docs/learnings/2026-07-27-offer-session-capture-manually-hook-may-not-have-run.md`
  documents failed and duplicate hook-driven capture attempts.
- `CHANGELOG.md` already describes shipped audit-trail and derived-state
  validation. Those should not be presented as new capabilities.

## Candidate Directions

### 1. Close the memory loop

For practitioners repeatedly correcting agents: make capture, synthesis, and
later application form one reliable experience. A correction should retain its
origin, appear when relevant to later work, and be reconsidered when evidence
changes. Extend existing capture and synthesis rather than adding another store.

Acceptance examples: a correction made before session wrap-up remains traceable;
a relevant lesson is surfaced in a later task; repeated wrap-up does not duplicate
the record; contradictory evidence is shown rather than silently reconciled.

Success: fewer repeated corrections alongside stable correction capture, and
less unprocessed memory. Avoid claiming success from artifact counts alone.

Risk: unsolicited capture and synthesis can add interruption and noise.

### 2. Give each task a focused evidence briefing

For a new human or agent entering an established feature: answer what the system
is meant to do, why its constraints exist, and what remains uncertain, with links
to relevant specs, decisions, and lessons. Build on the wiki and indexes.

Acceptance examples: a task receives a concise relevant briefing; conflicting
sources are identified; missing evidence is explicit; a stale wiki does not
override a current source. A briefing is evidence for judgment, not proof of
understanding.

Success: less time reconstructing context and fewer corrections caused by
overlooked constraints, evaluated on representative tasks.

Risk: this becomes another generic summary unless relevance is demonstrated.

### 3. Explain workflow health and the next useful action

For adopters who installed AW but are unsure whether it is working: provide a
small health report with evidence and a prioritized next action. Build on
validation, tracking, and the existing effectiveness draft.

Acceptance examples: distinguish disabled tracking from no activity; distinguish
recorded checkpoints from demonstrated quality; identify a synthesis backlog;
an empty repository gets an honest insufficient-evidence result.

Success: users resolve the most consequential workflow gap without reading the
whole field guide. No leaderboard, productivity score, or external analytics
service in the initial scope.

Risk: measuring compliance can distract from whether work improves.

### 4. Make the smallest useful AW path effortless

For solo developers and new adopters: guide a real task through the smallest
appropriate workflow and introduce additional capabilities when they earn their
cost. Extend existing triage and help rather than create a parallel workflow.

Acceptance examples: a documentation fix stays lightweight; a consequential
behavior change brings in the relevant intent and checks; users can see why a
step applies without learning all skill names first.

Success: faster first useful outcome and fewer unnecessary interruptions, while
preserving required checks for consequential changes.

Risk: more routing rules could create the very complexity this aims to remove.

## Proposed Priority

The discussion shifted priority toward making an agent's interpretation of the
intended human experience inspectable before implementation. Different human
understandings, missed rationale, and difficulty judging results have equal
weight and are related. Memory supports human understanding; it is not Theory
held by an agent.

The user's example is `aw metrics` in the aw-cli project: technically correct
charts missed the intended emotional response despite visual references. The
desired experience combines visual pleasure with easily drawing meaningful
conclusions about AW's effectiveness and how its parts fit together. This is
user-reported evidence; the implementation has not been inspected here.

Selected direction: interpret intent, propose a disposable prototype, obtain
agreement, gather a human reaction, and preserve useful learning in the spec.
Users can request exploration directly; agents can suggest it when experiential
uncertainty warrants it. Agent suggestions must wait for agreement before any
prototype is created. See `docs/features/experience-discovery/spec.md`.

## Scope Boundaries

No implementation, new platform, external service, automatic scheduling, or
approved product behavior is implied by these notes. No new skill is assumed
necessary. Existing immutable decisions remain unchanged.

## Open Questions

- Deferred to planning: how this loop integrates with existing discovery and
  design hooks without creating redundant checkpoints.
- Deferred: broader distribution, cross-repo rollout, and comparative outcome
  studies until the first useful loop is demonstrated.

## Spec Handoff

The selected direction is captured in `docs/features/experience-discovery/spec.md`.
Measurement work should reconcile with
`docs/features/workflow-effectiveness/spec.md` rather than duplicate it.
