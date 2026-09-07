---
status: completed
created: 2026-09-06
origin: docs/features/theory-building-site/spec.md
depth: standard
---

# Theory-Building Site Narrative Plan

## Problem and Scope

The public `gh-pages` site still presents an older, feature-led account of the
product: spec-driven development for coding agents, a sequential workflow, and
an inventory of skills and runtimes. Its two pages substantially repeat each
other and make claims that are no longer stable.

Rebuild the two existing standalone pages around the continuity problem:
software can be changed responsibly only when a later contributor can
reconstruct and renew its working theory. Augmented Workflow should be
presented as a practice for leaving useful evidence—not as a repository that
contains the theory itself, or an autonomous process that replaces judgment.

In scope:

- Rewrite `index.html` and `technical.html` on the `gh-pages` branch.
- Establish complementary information architecture, current branding, and
  cross-page navigation.
- Use an original-language paraphrase of Peter Naur's theory-building idea and
  a source link.
- Verify copy, links, responsive layout, and the distinction between evidence
  and judgment.

Out of scope:

- Changes to workflow behavior, installers, skills, or the main-branch README.
- New site tooling, a framework, analytics, or a build pipeline.
- Invented customer evidence, endorsements, or claims of autonomous judgment.

## Requirements Traceability

- **TBS-001:** The homepage opens on continuity and the insufficiency of code
  alone, before introducing agents or product mechanics.
- **TBS-002:** Both pages call specs, decisions, learnings, and verification
  records evidence that helps participants reconstruct and challenge theory;
  neither says the repository is the theory.
- **TBS-003:** Agents appear as accountable participants who consume, question,
  and return evidence—not as replacements for people or the product's sole
  purpose.
- **TBS-004:** `index.html` owns the reader's narrative arc; `technical.html`
  explains the evidence and renewal model without replaying the homepage.
- **TBS-005:** The canonical public name is **Augmented Workflow**.
- **TBS-006:** Naur is paraphrased in original copy and linked as a source; no
  long quotation or implied endorsement is used.
- **TBS-007:** Remove old product counts, commands, retired skills, and
  runtime-specific installation claims from the narrative.
- **TBS-008:** Use direct, specific prose and avoid clichéd AI-marketing
  constructions or repetitive false contrasts such as "X, not Y."

## Relevant Existing Patterns

- `origin/gh-pages` contains only `.nojekyll`, `index.html`, and
  `technical.html`; both HTML pages are self-contained Tailwind CDN slide decks
  with embedded configuration and styles.
- The current landing page leads with "Spec-driven development for coding
  agents," cites a fixed skill count, and includes obsolete installation and
  runtime claims. The technical page repeats the context/agent premise and
  retired skill examples.
- The active product decision is
  `docs/decisions/2026-07-24-rebrand-as-augmented-workflow.md`; public copy
  must use Augmented Workflow.
- `docs/standards/coding-approach.md` favors minimal, focused changes and
  concrete verification. Since this branch has no site test harness, the
  implementation should use explicit static and browser checks rather than add
  a build system for two documents.

## Decisions

- Work from a fresh worktree based on `origin/gh-pages`, not the current main
  checkout. The current checkout contains feature-planning artifacts and is on
  a merged feature branch; the hosted pages must be changed on their own branch.
- Rebuild the two HTML files rather than editing the old slide-by-slide copy.
  This removes stale claims comprehensively and lets each page have a clear job.
- Keep each page self-contained and dependency-light: static HTML, embedded
  CSS, and the existing Tailwind CDN are sufficient. Do not add a framework or
  shared asset pipeline for two pages.
- Retain a shared visual vocabulary across pages (typography, color palette,
  cards, navigation, and responsive behavior), but do not force identical
  layouts. The overview should feel editorial and invitational; the technical
  page should feel explanatory and precise.
- Use a paraphrase plus a clearly labeled external link to Peter Naur's essay.
  Do not use a quotation unless it is later deliberately approved and verified
  against the source.
- Keep installation instructions out of the core narrative. If a final CTA
  includes a command, verify it against the then-current project documentation
  during implementation; otherwise link to the repository.

## Implementation Units

### Unit 1: Establish the `gh-pages` implementation boundary

Goal: Start from the hosted branch without mixing site work with the current
feature artifacts.

Likely files:

- `index.html`
- `technical.html`
- `.nojekyll` (unchanged)

Behavior changes:

- Fetch `origin` and create an isolated worktree from `origin/gh-pages` on a
  dedicated `codex/` branch.
- Confirm the deployed branch still has the expected three-file static shape
  before replacing page content.
- Preserve `.nojekyll` and avoid introducing generated output or a build
  dependency.

Verification:

- `git status --short --branch` shows a clean, isolated worktree before edits.
- `git ls-tree -r --name-only HEAD` confirms the expected baseline files.

### Unit 2: Rebuild the overview around continuity and theory decay

Goal: Make `index.html` answer why a team needs the practice before explaining
how it works.

Likely files:

- `index.html`

Behavior changes:

- Replace the legacy deck copy, title, navigation label, and feature inventory
  with the canonical **Augmented Workflow** identity.
- Build the homepage in this order:
  1. Hero: code alone cannot carry a system forward; introduce working theory
     as purpose, constraints, tradeoffs, and learned lessons.
  2. Theory decay: show changed requirements, lost decision rationale, new
     teammates, and new agent sessions as moments when reconstruction fails.
  3. Usable evidence: explain the distinct contribution of living intent,
     decisions, learnings, and verification records.
  4. Participation: show people and agents drawing from, challenging, and
     contributing evidence under review.
  5. Outcome and CTA: describe responsible continuity and link to the project
     and technical explanation without relying on a stale installation command.
- Link the Naur source in an unobtrusive, clearly attributed note and write all
  explanatory text in original language.
- Write direct, concrete copy; avoid stock AI-marketing phrasing and rhetorical
  false contrasts such as "X, not Y."
- Use editorial sections, short explanatory diagrams/cards, and a responsive
  navigation pattern that serves the argument rather than preserving the old
  presentation-deck structure.

Acceptance coverage:

- Covers TBS-001, TBS-002, TBS-003, TBS-005, TBS-006, and TBS-007.

Edge cases:

- The hero must stand without assuming the reader already uses coding agents.
- Avoid replacing one misleading absolute claim with another; evidence helps
  reconstruction and judgment, it does not guarantee understanding.
- Ensure external links use secure `https` URLs and open normally without
  JavaScript.

### Unit 3: Rebuild the technical explanation around evidence and renewal

Goal: Make `technical.html` explain the operating model without repeating the
overview or reducing programming to artifact management.

Likely files:

- `technical.html`

Behavior changes:

- Replace the old "operating model behind agentic-workflow" framing, obsolete
  skill examples, fixed counts, and abstract pattern metaphors with a focused
  technical narrative:
  1. Honest boundary: theory is exercised by capable participants; artifacts
     are aids, not a complete representation.
  2. Evidence model: living specs carry current intent; decisions retain why;
     learnings preserve corrected understanding; session/synthesis material
     separates raw context from durable knowledge; verification records expose
     what was checked.
  3. Renewal model: planning, work, review, and shipping can update, challenge,
     supersede, or corroborate evidence rather than advancing a mandatory
     conveyor belt.
  4. Deterministic boundary: automation can check presence, freshness, links,
     and traceability, while accountable participants make judgments about
     meaning and tradeoffs.
  5. Agent participation: an agent should surface uncertainty and contribute
     inspectable evidence that people can review.
- Provide a compact evidence-to-renewal diagram or equivalent structured visual
  that makes the relationship legible without claiming a linear universal
  workflow.
- Give the page its own title, introductory copy, and navigation back to the
  overview, using the same visual vocabulary but a more explanatory layout.

Acceptance coverage:

- Covers TBS-002, TBS-003, TBS-004, TBS-005, TBS-006, and TBS-007.

Edge cases:

- Do not call gates proof that a team understands its software.
- Mention concrete artifact types only when their role is accurate; avoid an
  exhaustive skill catalog that will decay as the product evolves.

### Unit 4: Remove stale claims and validate the complete public surface

Goal: Ensure the rewrite is current, internally coherent, and works as a static
site on desktop and mobile.

Likely files:

- `index.html`
- `technical.html`

Behavior changes:

- Remove remaining public instances of legacy branding except where an
  explicitly historical context is needed (none is expected in these pages).
- Remove stale commands, runtime lists, fixed skill counts, and retired skill
  identifiers from both documents.
- Verify both pages link to each other, the repository, and the Naur source
  with descriptive labels.

Verification:

- Run `git diff --check`.
- Run a small read-only Node or shell source assertion that checks both files
  for the required current brand, cross-page links, and the Naur source link;
  it should also reject the known stale terms/phrases (`Agentic Workflow`,
  `31 skills`, `npx skills add`, `/aw-init`, `aw-import-prd`, and
  `aw-log-decision`). Keep this check ad hoc unless the branch gains a durable
  test convention.
- Serve the worktree locally with a static HTTP server and inspect both pages
  in a browser at approximately 1440px, 768px, and 390px widths. Confirm that
  navigation, text hierarchy, diagrams/cards, and all page/external links are
  visible and usable without horizontal overflow.
- Read the final copy as a single narrative: it must distinguish theory from
  evidence, make agents secondary to stewardship, and leave the overview and
  technical page with non-overlapping jobs.

Acceptance coverage:

- Covers TBS-001 through TBS-007.

## Test Plan

This branch is a static three-file site with no existing test runner. Follow
the configured acceptance-first policy with concrete source and browser checks
rather than adding a framework solely for these two pages.

- Source assertions for current brand, required cross-page/source links, and
  absence of known obsolete terms and commands.
- `git diff --check` for whitespace and patch integrity.
- Local static-server browser inspection at desktop, tablet, and mobile widths.
- Link checks for overview ↔ technical navigation, GitHub/project destination,
  and the Naur essay source.
- Content review against the traceability list above, explicitly confirming the
  evidence-versus-theory boundary and the participant—not-replacement—role for
  agents.
- Copy review for clichéd AI-marketing phrasing, especially repeated false
  contrasts of the form "X, not Y."

## Risks and Open Questions

- The exact visual departure from the current slide-deck format remains open.
  Choose the least ornate design that makes the continuity narrative easier to
  scan and verify it in the browser before shipping.
- A concrete theory-renewal example could make the argument more tangible, but
  it must be factual. Omit it unless a real, attributable example is supplied.
- A short Naur quotation is intentionally deferred. The paraphrase and source
  link meet the current intent without adding attribution or copyright risk.
- The hosted branch may have changed since planning. Re-check its head and
  resolve any drift before implementation rather than blindly overwriting it.

## Deferred Work

- A shared static-site stylesheet, build system, or deployment automation.
- Additional case studies, customer stories, or a broader documentation-site
  information architecture.
- Product or installer changes prompted by future positioning work.
