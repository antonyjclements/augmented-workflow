# Product and Experience Discovery

Resolve consequential ambiguity without inventing decisions or requiring an
interview for clear intent. Return clarified context/notes to the router, which
selects the effective create-spec provider; this reference never writes a living
spec or feature index. Exploration-only means no spec and no implicitly accepted
intent. For non-software tasks, load `references/universal-brainstorming.md` instead.

## Interaction and Scope

Ask one question at a time. Prefer concise single-select choices; multi-select
only for compatible sets. Use the platform blocking question tool when available
and permitted; fall back to numbered chat if unavailable/failing. Open-ended
questions are right when answers are narrative or options would bias the user.

If input is empty, ask what to explore. Resume a matching
`docs/brainstorms/*-requirements.md` only after user confirmation. Match depth to
uncertainty: brief alignment for simple low-risk work, standard discovery for
ordinary product work, deep exploration for strategic/cross-cutting/high-risk work.

Gather relevant user/repo/PRD/decision/learning context. Use `aw-research` for
focused evidence and current external facts; report inaccessible sources. Explore
only useful dimensions: actors, problem/evidence, behavior/flows, acceptance
examples, scope/non-goals, success criteria, constraints/dependencies, risks and
open questions. Suggest alternatives, challenge weak assumptions, and compare
trade-offs. Do not ask checklist questions merely to fill a template. Favor low
carrying cost over speculative future-proofing. Keep implementation details out
unless they define the requested behavior or this is inherently technical.

## Experience Discovery

Use this loop when requested, or when emotional goals, visual references, or
materially different plausible experiences leave consequential uncertainty.
Routine UI work with clear intent needs no probe. This works with design hooks
disabled or blank.

1. Make the interpretation inspectable: what should people understand, accomplish,
   and feel? Explain which observed reference qualities support those outcomes.
   State inaccessible references and evidence gaps instead of inventing them.
2. Suggest a small disposable prototype and explain what it would clarify;
   wait for agreement before creating it. Silence is not agreement. An explicit
   prototype request authorizes its stated scope; reuse that agreement. A broad
   build request alone does not authorize a separate exploratory prototype.
3. Use an available medium that tests the agreed uncertainty. If it cannot,
   explain the limitation and agree on an alternative. Do not claim an inadequate
   substitute validates the experience or expand the probe into production work.
4. Present it for a human reaction. Agreement to prototype does not approve the
   resulting experience. Functional checks or silence cannot settle experiential
   fit; a mismatch remains open until addressed or explicitly deferred.
5. Carry discoveries to the eventual writer as evidence, not a hidden acceptance
   decision. Artifacts express partial evidence of human Theory; reading them
   does not give an agent Theory. Keep unresolved assumptions visible.

If the user declines, create no prototype and do not repeat the same suggestion
without new information. Continue authorized work with uncertainty explicit.
Prototypes need not become permanent artifacts; preserve useful learning without
requiring a lasting link. Do not automatically delete existing user files. No
extra document or skill invocation is required for every change.

## Synthesis and Optional Notes

Use `references/synthesis-summary.md` when enough decisions exist to converge.
Distinguish stated choices, inferences, and exclusions. Confirm consequential
product choices before committing them to durable intent. Lightweight clear
requests can proceed without a compulsory confirmation or interview. User
revisions are not confirmation of the revised synthesis.

If useful/requested, save exploration as
`docs/brainstorms/YYYY-MM-DD-###-slug-idea.md`, creating the directory if absent.
Keep it exploratory; this is not a spec, PRD, or implementation plan. Right-size:

```markdown
# <Title>

Created: YYYY-MM-DD
Status: draft|ready-for-spec

## Problem
## Users / Actors
## Goals
## Key Flows
## Acceptance Examples
## Scope Boundaries
## Success Criteria
## Constraints and Dependencies
## Open Questions
## Deferred for Later
## PRD / Spec Handoff
```

Collapse sections for tiny work; use IDs such as `A1`, `F1`, or `AE1` when useful
for larger exploration. Load `references/visual-communication.md` only when a
workflow, comparison, or participant relationship benefits from a visual. Prose
remains authoritative. For authored PRD output, return to the effective `prd` step.

## Discovery Hook and Handoff

Run the enabled, non-empty `discovery` hook once before the writer or next stage,
using the final context/notes plus experience interpretation, prototype agreement
and scope, prototype reference if any, human feedback, and unresolved questions.
Record current evidence as defined by the router. Hook configuration does not
authorize a prototype; report unsupported behavior rather than bypass agreement.
Reconcile findings without recursively rerunning discovery or its hook.

Check that behavior and boundaries are explicit, acceptance examples cover normal
and edge flows, questions are labeled blocking versus deferred, and implementation
detail has not displaced product intent. Exploration may finish with open choices;
it must not be falsely labeled ready for planning.

Return the context/artifact path, decisions, assumptions, question status, and
hook evidence. If a spec is requested and ready, let the router resolve the
create-spec stage. Otherwise summarize and recommend one applicable next step:
continue exploring, request a PRD, explicitly promote to a spec, or finish. Do not
start planning/building while those steps would have to invent product behavior.
If the user chooses to proceed with open questions, first record each as an
explicit decision, assumption, or deferred question. No selection authorizes
publication beyond that selected step.
