# A Theory-Building Narrative for the Site

Created: 2026-09-06
Status: ready-for-spec

## Problem

The `gh-pages` site frames Augmented Workflow chiefly as spec-driven development
for coding agents. It over-indexes on its inventory of skills, workflow stages,
and configuration. That framing is both stale and too narrow: it makes agents
the subject and documentation the solution.

Peter Naur's *Programming as Theory Building* supplies the stronger premise:
software survives change when responsible people retain and renew a working
theory of how it supports the real-world problem. Code and documents are
necessary aids, but they do not replace that theory.

Source: https://pages.cs.wisc.edu/~remzi/Naur.pdf

## Audience

Primary: **AI-native and aspiring AI-native product teams** — teams introducing
agents into real product development and looking for a practice that improves
stewardship, rather than merely accelerating code generation.

Secondary readers:

- Engineering leaders responsible for software that must outlive individual
  contributors and AI sessions.
- Individual practitioners who need a credible way to make agent-assisted work
  more legible and durable inside an existing team.

## Narrative Position

Lead with **continuity**:

> Software survives change only when its working theory survives.

Augmented Workflow gives people and agents durable evidence from which they can
rebuild, test, and extend that working theory. Agents are not the headline;
they are the stress test and an additional participant in the practice.

Supporting themes:

- **Agency:** an agent can act responsibly when it can enter and extend the
  team's working theory rather than reconstructing intent from a prompt.
- **Craft:** programming remains a practice of judgment, explanation, and
  stewardship; the workflow does not promise to automate those things away.

## Homepage Arc (`index.html`)

1. **Claim — theory is the continuity problem.**
   Hero: "Code is not enough to carry a system forward." Explain that each
   meaningful change relies on a working theory of purpose, constraints,
   tradeoffs, and prior learning.
2. **Failure — theory decays.**
   Show the familiar breaks: a new teammate, a new agent session, a changed
   requirement, or an old decision nobody can explain. The issue is not merely
   stale documentation; it is lost ability to justify and safely change the
   system.
3. **Practice — leave usable evidence.**
   Present living specs, decisions, learnings, and reviews as distinct evidence
   types that help a future contributor reconstruct and challenge the theory.
4. **Participation — people and agents work from the same evidence.**
   An agent reads the same intent and history, returns its reasoning into the
   repository, and is held to the same review and verification expectations.
5. **Outcome — software that can be understood again.**
   Close on responsible continuity, not faster output: a later contributor can
   understand why the system is shaped as it is and make the next change with
   judgment.

Suggested hero copy:

> **Code is not enough to carry a system forward.**
>
> Every meaningful change depends on a theory: what the software is for, why it
> works this way, which tradeoffs matter, and what reality has taught the team.
> Augmented Workflow keeps the evidence for that theory available to the people
> and agents responsible for the next change.

## Technical Page Role (`technical.html`)

The technical page should not repeat the homepage. It should answer: *how does
the theory remain reconstructable without pretending it can be fully captured?*

1. **An honest boundary:** theory lives in capable participants; repository
   artifacts are aids, not a complete substitute.
2. **Evidence model:** living specs state current intent; decisions preserve
   why; learnings retain corrections; session/synthesis artifacts separate raw
   context from corroborated knowledge.
3. **Renewal model:** work, review, and shipping update or challenge the
   evidence; they are not a conveyor belt of mandatory documents.
4. **Deterministic boundary:** use code for integrity and visibility, not to
   simulate judgment. Gates can show missing evidence; they cannot prove that a
   team understands the system.
5. **Agent participation:** agents can traverse the evidence, state uncertainty,
   and contribute new evidence, while humans remain accountable for judgment.

## Copy Guardrails

- Do not claim the repository *contains* or *is* the shared theory.
- Do not describe the workflow as an autonomous process engine or a prescribed
  pipeline.
- Avoid feature counts, absolute claims, and stale runtime-specific installation
  instructions in the narrative body.
- Prefer "evidence," "reconstruct," "justify," "renew," and "stewardship" to
  generic "memory," "context," and "automation" language.
- Avoid clichéd AI-marketing constructions and false contrasts such as repeated
  "X, not Y" phrasing. Make the argument with direct, specific prose.
- Treat AI as a participant with a need for context and accountability, not as
  the reason the practice exists.

## Scope Boundaries

- This work repositions and rewrites `index.html` and `technical.html` on the
  `gh-pages` branch; it does not change product behavior or the main README.
- The site should paraphrase Naur's ideas and link to the essay; do not rely on
  long quotations.
- Visual design can evolve to serve the narrative, but this brief does not yet
  prescribe a visual system or implementation plan.

## Success Criteria

- A reader can explain the product without mentioning a skill count or a fixed
  workflow sequence.
- The distinction between durable evidence and human judgment is explicit.
- The homepage and technical page have complementary, non-overlapping jobs.
- Agent participation feels like a consequence of the thesis, not the thesis
  itself.
- An aspiring AI-native team can see a credible path from its current fragmented
  context to a more responsible practice; the site does not assume maturity.

## Open Questions

- Should the public brand be consistently "Augmented Workflow," "Agentic
  Workflow," or explicitly support both during the transition?
- Should the site include a short, attributed Naur quotation, or use only the
  paraphrase and source link?

## Spec Handoff

Promote this brief to a living site narrative spec before implementation. The
spec should settle the brand name, primary reader, page-level acceptance
criteria, and the level of visual redesign.
