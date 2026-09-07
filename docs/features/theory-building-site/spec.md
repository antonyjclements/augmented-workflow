---
title: Theory-Building Site Narrative
status: active
created: 2026-09-06
updated: 2026-09-06
tags:
  - website
  - positioning
  - narrative
  - theory-building
related_decisions:
  - docs/decisions/2026-07-24-rebrand-as-augmented-workflow.md
related_brainstorms:
  - docs/brainstorms/2026-09-06-theory-building-site-narrative.md
---

# Theory-Building Site Narrative

## Intent

The public site should position Augmented Workflow as a practice for preserving
and renewing the working theory that lets software survive change. It should
make AI-assisted development a consequence of this premise: agents can become
responsible collaborators only when they can enter, challenge, and extend the
evidence from which a team reconstructs that theory.

The narrative draws on Peter Naur's *Programming as Theory Building*: code and
documentation are necessary aids, but neither substitutes for the understanding
held and exercised by the people responsible for the system.

Source: https://pages.cs.wisc.edu/~remzi/Naur.pdf

## Users

- **Primary:** AI-native and aspiring AI-native product teams introducing agents
  into real product development.
- **Secondary:** engineering leaders accountable for long-lived software and
  individual practitioners adopting a more durable agent-assisted practice.

## Current Behavior

The `gh-pages` branch's `index.html` now leads with the continuity problem and
the evidence that helps later contributors rebuild a working theory.
`technical.html` explains the evidence model, renewal loop, deterministic
integrity checks, and accountable agent participation. The pages use
Augmented Workflow branding, reciprocal navigation, original-language Naur
paraphrases with source links, and no fixed skill counts, legacy commands, or
runtime-specific installation claims.

The pages use the approved AW monogram in navigation, the full logo lockup on
the overview page, and the supplied dark-gradient icon as the favicon. Their
palette and system-sans typography follow `docs/brand/style-guide.md`.

## Key Flows

### Overview page

`index.html` establishes the human problem before introducing the product:

1. A system's continuity depends on a working theory of its purpose,
   constraints, tradeoffs, and learned lessons.
2. That theory decays when requirements change, decisions lose their reasons,
   or a new person or agent must reconstruct the system from fragments.
3. Augmented Workflow preserves distinct, useful forms of evidence: current
   intent, decisions, learnings, and verification records.
4. People and agents use that evidence to make and justify the next change.
5. The outcome is software that a later responsible contributor can understand
   and safely evolve.

### Technical page

`technical.html` explains how the practice supports theory renewal without
claiming to encode theory completely:

1. Artifacts are theory aids, not a replacement for human judgment.
2. Living specs, decisions, learnings, and session synthesis preserve different
   kinds of evidence.
3. Review and shipping renew or challenge evidence rather than merely advancing
   a prescribed pipeline.
4. Deterministic helpers such as `aw-gate.js` collect observable evidence that
   a process was followed—artifact presence, links, freshness, and recorded
   checkpoints—while quality judgment stays with accountable people and
   agents. The page uses the hand-washing-before-dinner analogy to make that
   boundary concrete.

## Acceptance Criteria

### TBS-001 — The overview leads with continuity

`index.html` leads with the claim that code alone cannot carry a system forward
and frames the working theory of the software as the continuity problem.

### TBS-002 — The site treats evidence honestly

The site describes repository artifacts as evidence that helps contributors
reconstruct, test, and extend a working theory; it does not claim that the
repository contains or is the theory itself.

### TBS-003 — Agents are participants, not the premise

The narrative presents agents as additional participants who need context,
state uncertainty, contribute evidence, and remain accountable to review—not as
the product's sole purpose or a replacement for human judgment.

### TBS-004 — The pages have distinct jobs

`index.html` gives the human narrative of continuity, decay, practice, and
outcome. `technical.html` explains the evidence model, renewal process, and
deterministic boundary without repeating the overview.

### TBS-005 — The public brand is current

New narrative copy uses **Augmented Workflow** as the canonical product name,
consistent with the active rebrand decision. Historical or compatibility names
appear only when their context is explicit.

### TBS-006 — Naur informs rather than overwhelms

The site paraphrases the theory-building idea in original language and links to
the essay; it does not depend on long quotations or present Naur as endorsing
the product.

### TBS-007 — The site avoids obsolete product claims

The rewritten pages do not rely on stale skill counts, old commands, retired
skill names, or runtime-specific installation claims as part of their core
narrative.

### TBS-008 — The site uses direct, specific prose

The narrative avoids clichéd AI-marketing constructions and false contrasts,
including repetitive "X, not Y" phrasing. It makes its case through concrete,
precise language rather than stock claims about transformation, speed, or
automation.

### TBS-009 — The site follows the current brand system

The public pages use the approved AW assets and follow the restrained
navy/violet, system-sans visual system defined in `docs/brand/style-guide.md`.

## Boundaries and Non-Goals

- This spec covers the narrative and information architecture of `index.html`
  and `technical.html` on `gh-pages`, not changes to workflow behavior or the
  main-repository README.
- It does not prescribe the visual system; a later plan may evolve design to
  support the new narrative.
- It does not claim to automate programming judgment or to replace team
  conversation with repository artifacts.

## Open Questions / TODOs

- Whether to use a single short attributed quotation from Naur in addition to
  the paraphrase and source link.
- Which concrete customer or project example can demonstrate theory renewal
  without inventing outcomes.
- How far the visual redesign should depart from the existing presentation-deck
  format.

## Decision Links

- [Rebrand as Augmented Workflow](../../decisions/2026-07-24-rebrand-as-augmented-workflow.md)
- [Narrative brainstorm](../../brainstorms/2026-09-06-theory-building-site-narrative.md)
