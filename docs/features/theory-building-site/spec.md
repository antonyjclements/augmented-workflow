---
title: Theory-Building Site Narrative
status: active
created: 2026-09-06
updated: 2026-10-29
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

The `gh-pages` branch’s `index.html` now leads with practical continuity between sessions and links the four source essays.
`technical.html` explains the evidence model, renewal loop, deterministic
integrity checks, and accountable agent participation. The pages use
Augmented Workflow branding, reciprocal navigation, original-language Naur
paraphrases with source links, and no fixed skill counts, legacy commands, or
runtime-specific installation claims.

The overview connects shared understanding to what people should understand,
accomplish, and feel. The technical page explains experience discovery within
the renewal loop: interpret intent, suggest a disposable prototype, wait for
agreement, gather a human reaction, and preserve useful learning. It distinguishes
functional correctness from experiential fit and treats prototypes as disposable.

The pages use the approved AW monogram, Wren favicon and mascot illustrations. The shared ivory paper theme and in-place Wren animation are preserved during the content refresh.

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

`index.html` leads with giving the next session a better starting point. It makes continuity concrete through unnoticed decisions, repeated corrections, incomplete handovers, and limited evidence. The theory-building foundation remains in the supporting explanation.

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
navy/violet, system-sans visual system, extended with warm ivory paper surfaces and the approved Wren mascot.

### TBS-010 — Experience intent is made inspectable

The overview explains that people clarify what users should understand,
accomplish, and feel, and inspect the agent's interpretation before implementation.
The technical page describes the experience-discovery loop from
`docs/features/experience-discovery/spec.md`, including waiting for agreement
before a suggested prototype and honoring an explicit prototype request without
asking for permission again. Routine clear changes do not require this loop.

### TBS-011 — Experiential judgment and disposable evidence remain distinct

The technical page states that functional correctness cannot establish
experiential fit. Human feedback informs living intent; unresolved fit remains
visible. Useful learning can survive after a disposable prototype is discarded.

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


## Paper Theme and Wren Idle Motion

The overview, technical model, and usage guide share a warm paper surface with fine grain, ink typography, restrained violet accents, softly rounded edges, geometric folded corners, and diffuse shadows, and the approved Wren mascot. Existing narrative, links, and page roles remain intact. The primary AW mark remains recognizable.

### TBS-012 — Paper presentation and mascot

All three pages use the shared paper theme and include static Wren artwork. Desktop and mobile layouts remain readable without horizontal overflow.

### TBS-013 — Articulated motion in place

After 10 seconds of inactivity, one fully visible Wren plays all four sprite transitions as a complete cycle starting and ending at its original pose. The overview follows perched → gathering → alert → in flight → perched. Other mascots follow the same ordered cycle rotated to their starting pose. Playback is 8 fps for 3.5 seconds; shared endpoint frames are shown once at handoffs. The cycle plays inside the existing fixed page box, with no popup, screen crossing, translation, rotation, or bobbing. After completion the original resting artwork is restored. Idle checks repeat every 10 seconds. Interaction stops playback and restores the original resting pose.

### TBS-014 — Accessibility

Wren remains decorative and non-focusable, and static images work without JavaScript. A keyboard-accessible footer toggle remembers the visitor's motion preference. Reduced-motion preferences disable playback, including runtime preference changes. Hidden tabs suspend playback; returning begins a fresh idle interval. Motion cannot intercept pointer events or change layout.

### TBS-015 — Asset loading and consistent placement

Hero mascot boxes use a consistent 150px desktop and 100px mobile width across all three pages. Dark closing sections use the light-colored sprite sheets. Static illustrations and sprite endpoints share normalized padding, so transitions start and end consistently. All four sheets for the selected mascot’s color treatment load together only when a cycle is due. Playback begins only if the complete cycle is available. Failed loads preserve the resting artwork and permit later retry. Offscreen artwork is skipped; resize cancels motion. Current generated intermediate frames retain their illustrated shape variations; the fixed-box implementation does not claim to repair those source frames.


## Essay-Based Content Refresh

### TBS-016 — The four essays inform distinct parts of the site

- [Code Without a Theory](https://antonyjclements.github.io/posts/code-without-a-theory/): preserve engineering judgment, surface consequential choices, choose review depth by reversibility, and describe the limits of behavior pins.
- [Did you wash your hands?](https://antonyjclements.github.io/posts/did-you-wash-your-hands/): state exactly what receipts, freshness comparisons, and trace links establish. Agent-authored records do not independently prove that a review occurred or was useful.
- [Teaching the repo what you keep correcting](https://antonyjclements.github.io/posts/teaching-the-repo-what-you-keep-correcting/): capture the cause, scope, source, and useful next action behind a correction. Review lessons as conditions change; repetition alone does not establish reliability.
- [Picking up where the last agent stopped](https://antonyjclements.github.io/posts/picking-up-where-the-last-agent-stopped/): separate temporary checkpoints from durable intent, state unverified work, reconcile notes against the checkout, and deliberately transfer local progress when work moves.

The overview makes these problems accessible and links all four essays. The technical page explains mechanisms and limitations. The usage guide gives concrete correction and handover practices. Copy is original synthesis rather than long quotations. Experiments, pilot results, metrics, and claims derived from those studies are excluded at the user's explicit request. No redesign or animation change is included in this refresh.

Verification: editorial comparison against the four source articles, inspection of rendered desktop/mobile pages, local asset/link validation, and the existing regression suite. No tests are added for static prose.
