---
title: Public AW Field Guide
status: active
created: 2026-11-16
tags: [website, documentation]
---

# Public AW Field Guide

The public site gives readers a browsable reference for adopting AW and understanding its artifacts, skills, and theory. The supplied screenshots define the article layouts and depth for Workspaces, Concepts, the opening Theory article, the aw-help skill reference, and the Living Specs, Plans, Decisions, Learnings, and Standards chapters. The public AW repository supplies the technical content.

## Acceptance Criteria

### AWFG-001 — Read and navigate the guide

The public site links to the guide. Its five navigation groups cover setup, theory, concepts, skills, and essays. Articles and their headings have shareable URLs. Desktop shows the section navigation, article, and current page outline together. Narrow screens offer access to the same navigation and outline without horizontal page overflow.

### AWFG-002 — Find a topic and choose a theme

Search covers article titles and content. A keyboard shortcut opens it, and keyboard users can open a result or dismiss the dialog. The theme follows the system by default and remembers a visitor's explicit choice.

### AWFG-003 — Understand workspace scope

The Workspaces article explains when to create a marker, how to run the resolver, how discovery stops, and how each checkout's policy applies. The example matches the public multi-repo workspace implementation and labels where that implementation is available. The article shows a folder tree, command examples, a metadata panel, and a contextual sidebar note.

### AWFG-004 — Use the guide as a complete reference

Concepts and theory articles contain explanations, consequences, examples, source links, and routes to related reading. The Concepts index maps ordinary workflow problems to the artifact or concept that addresses each problem. The opening theory article attributes Naur and explains implications for the work of people and agents. The outline links to each substantive section. Setup pages provide enough context to guide a decision or practice. Essay links open the original posts on Antony Clements’s GitHub Pages site in a new tab, including from the index, sidebar, search, and companion references.

### AWFG-005 — Read a skill as an agent reads it

Each bundled skill has a distinct header with its stage, invocation, replacement keys or direct-invocation status, and a link to the source revision. All top-level procedure sections from its bundled `SKILL.md` are readable in the guide, including lists, tables, and code. The reference data can be regenerated from a Git revision. The `aw-help` page demonstrates a concrete handoff from situation to recommendation.

### AWFG-006 — Follow an artifact through its lifecycle

Living Specs, Plans, Decisions, Learnings, and Standards follow the supplied chapter outlines. Each explains when to write the artifact, who uses it, and what changes or expires over time. Use linked excerpts from the public repo to show the actual formats and identify internal-edition workflows when they differ. Show spec and decision registries, a plan-to-delivery sequence, a decision supersession chain, the learning corroboration rules, and standards discovery and selection. Readers can follow related links and move to adjacent chapters.

### AWFG-007 — Apply the chapter depth to every concept

Each remaining Concepts chapter explains when to use the practice, how it works, and how to verify or maintain it. Every chapter links to public source evidence, shows a concrete walkthrough or excerpt, and offers related and adjacent navigation. Document public organization knowledge in the related standards and learnings chapters, identify the workspace implementation revision, and preserve existing section URLs for retained chapters.

### AWFG-008 — Install using the recommended CLI

The installation chapter recommends installing AW CLI with pipx, installing the shared skills, and initializing the target repo. Explain which directory to run the commands from and how to inspect the installation. Keep the bundled checkout installer as an alternative.

### AWFG-009 — Use the walkthroughs to make a decision

Choose the ceremony presents four linked tier cards, a concrete case for each tier, and the command for recording a workflow trace. The opening Theory chapter illustrates the crease-pattern analogy and links the five kinds of evidence to their applicable Concepts chapters. The Concepts overview recommends adoption practices for a pair, a small team, and a larger or multi-repo team. Sequential chapters link across Start here, Theory, and Concepts.

### AWFG-010 — Practice the workflow across the guide

Each bundled skill opens with a bounded example showing what to bring to the skill, what to do, and what evidence or artifact to carry forward. Its pinned procedure follows the example. Start Here, Theory, and the Skills index use public AW artifacts and execution records to show how decisions and verification pass between people and skills. Diagrams show the handoffs that readers can follow. Examples distinguish recorded checks, manual observations, and illustrative scenarios. Preserve existing section URLs and keep original essays one click away from their companion walkthroughs.

### AWFG-011 — Animate the article Wren in place

After 10 seconds of inactivity, animate a visible article-header Wren through the existing sprite cycle and return to its starting pose. The mascot's box and surrounding layout stay fixed. Use the guide's active color theme for the resting image and sprites. Interaction and theme changes restart the idle interval. Honor reduced motion and the shared footer preference.

## Verification

- AWFG-001: Open the guide from the homepage. Follow every generated page and outline link, reload a deep link, and inspect the layout at desktop, tablet, and phone widths.
- AWFG-002: Search by title and by article text. Check keyboard open, submit, dismissal, and focus restoration. Toggle the theme and reload.
- AWFG-003: Compare the rendered article with the workspace source and exercise the documented command with and without a marker.
- AWFG-004: Compare Concepts and Programming as theory building against the new reference photos. Open a setup, concept, and theory page and follow section and related links. Select an essay and check its destination and tab behavior.
- AWFG-005: Compare the skill catalog to the pinned Git tree. Verify `aw-help`’s hero, invocation, routing table and deep links, plus the separate override keys for `aw-spec` and `aw-ship`.
- AWFG-006: Check the chapter outlines, attached artifact excerpts, and adjacent navigation. Verify the decision chain and learning counters against their sources and check chapter layout, code scrolling, and outline navigation on desktop and phone.
- AWFG-007: Check chapter coverage and prior section URLs for the whole Concept group. Compare excerpts with the cited revisions and exercise chapter links and layout on desktop and phone.
- AWFG-008: Compare the recommended commands and defaults with the AW CLI source. Verify that the installation chapter presents the CLI first and the source checkout installer separately.
- AWFG-009: Check the four tier cards and previous section URLs, record a tier in an isolated fixture, and inspect the theory illustration, evidence links, adoption cards, and sequential navigation at desktop and phone widths.
- AWFG-010: Check that every skill begins with an example and retains its pinned procedure sections. Resolve links to guide sections and public source revisions. Follow a Start Here, Theory, and Skills handoff at desktop and phone widths.
- AWFG-011: Wait through a full cycle in the browser, compare the mascot box before and during playback, then verify the theme change and reduced-motion behavior.
