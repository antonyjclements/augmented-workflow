---
name: aw-prd
description: "Create or import a PRD under docs/product/prds/. Routes by source: authored PRD from idea/notes/brainstorm → create mode; external PRD from pasted content/file/URL → import mode. Use when the user says create, draft, write, import, or save a PRD."
argument-hint: "[create|import] [idea, notes, file path, URL, or pasted content]"
---

# PRD

First action, if `.scripts/aw-gate.js` exists: `node .scripts/aw-gate.js track aw-prd`
(silent no-op otherwise). For an internal `prd` stage with inherited mode,
invocation ID, and tracking ownership from `aw-spec`, suppress that public call:
emit `node .scripts/aw-gate.js track aw-prd --stage prd --mode <direct|exploratory> --event stage --invocation-id <token>`
only if this provider owns tracking and the caller verified `tracking-schema` 2;
if the caller already emitted it or reported unsupported tracking, do not emit.
Never fall back to a public event for an internal call. Reuse the token and mode.

Create or import a product requirements document and store it under `docs/product/prds/`.
Honor the requested output: create/import-only produces no spec, plan, prototype,
or implementation. When invoked by `aw-spec` to preserve input for an explicitly
requested spec, return the PRD path and intake evidence to that same route; do not
start a second spec-writing invocation.

## Mode Routing

- User says "create", "draft", "write", or "author" a PRD → **Create**
- User provides pasted content, a local file path, or a URL → **Import**
- Ambiguous: ask one question — "Are you writing a new PRD from your own notes, or importing an existing document?"

## Storage

- PRDs live under `docs/product/prds/`.
- `docs/product/prds/index.yml` is the entrypoint.
- PRDs are **source artifacts**, not living truth. Do not rewrite old PRDs to match shipped behavior.
- Durable product thesis belongs in `docs/product/vision.md`; durable feature behavior belongs in `docs/features/<feature>/spec.md`.

## Lifecycle Statuses

- `draft`: authored PRD still being shaped
- `imported`: external PRD preserved as-is
- `ready-for-spec`: stable enough to promote into a living spec
- `promoted`: a living spec has been created from this PRD
- `superseded`: replaced before promotion
- `archived`: safe for `aw-refresh cleanup` to remove from the working tree

---

## Create

Create an authored PRD from an idea, brainstorm, notes, or clarified product direction.

### Template Selection

Use the first available template:

1. Repo-local `docs/product/prds/template.md`
2. Bundled `references/prd-template.md`
3. Compact fallback: title, problem, users, goals, flows, requirements, acceptance examples, boundaries, success criteria, open questions, spec handoff

When using a template: preserve section order; omit sections only when explicitly marked optional; remove template guidance comments from the final PRD; do not invent answers for required sections — ask or mark as open questions.

### Workflow

1. Resolve the input: idea or notes in prompt (use directly); brainstorm/spec/PRD path (read it); blank input (ask what PRD to create).
2. Read the selected PRD template.
3. Gather relevant repo context as needed: existing specs, product docs, decisions, and standards.
4. Clarify blocking product gaps one question at a time. Preserve non-blocking uncertainty as open questions.
5. Create or update the PRD in `docs/product/prds/YYYY-MM-DD-<slug>.md` with `status: draft`.
6. Update `docs/product/prds/index.yml` without disrupting its existing schema.
7. Run the applicable `prd_review` checkpoint described below before recommending the next step.
8. Recommend the next step.

### Rules

- A PRD may propose future behavior. A spec describes current durable intent.
- PRDs are editable while `draft`. Once `ready-for-spec` or `promoted`, avoid body edits; record changed direction in the spec, a new PRD, or a decision.
- Keep implementation plans, task lists, and ticket breakdowns out of the PRD.
- Link source artifacts and decisions when they informed the PRD.

---

## Import

Persist external product input as a historical source artifact.

### Workflow

1. Search the PRD index and source provenance before importing. Reuse an existing imported artifact when its source and stored version match the intended input; do not duplicate an import or infer identity from its filename alone. A supplied imported path uses its stored contents without refetching the original unless the user requested an update. Do not conflate newly supplied changed content with an older import from the same source.
2. Resolve any source still needed:
   - Pasted content: use it directly
   - Local file: read it
   - URL or Google Doc: use available browser/document tools
   If the requested source is unavailable and no accessible intended import exists, report the blocker and ask for an accessible export; never reconstruct it from a title.
3. For a new import, preserve source provenance: URL/path, import date, author/source when known.
4. Convert to clean markdown without changing meaning.
5. Create `docs/product/prds/YYYY-MM-DD-<slug>.md` with `status: imported`, or retain the reused source artifact unchanged.
6. Update `docs/product/prds/index.yml` only as needed, preserving its existing schema and unrelated entries.
7. Run the applicable `prd_review` checkpoint described below before returning to the caller or recommending `aw-spec`.

### Rules

- Preserve the PRD as input, including ambiguity and open questions.
- Do not rewrite the imported PRD into living truth — that belongs in the spec.
- After a spec is created from the PRD, only update frontmatter/index lifecycle metadata (`status: promoted`, `promoted: YYYY-MM-DD`, `promoted_to`). Keep the PRD body unchanged.
- Do not remove imported PRDs just because they were promoted. Removal requires `status: archived` and cleanup through `aw-refresh cleanup`.
- Avoid storing secrets, customer-private data, or credentials; redact only when necessary.

---

## PRD Review Checkpoint

If `workflow.design.enabled` is true and `workflow.design.hooks.prd_review.skill`
is non-empty, run that hook after source preservation and before discovery/spec
creation. Reuse current evidence for an unchanged existing artifact; otherwise
run the missing hook once or report its blocker. Return the hook/provider, PRD
path, artifact version/hash or inspected state, outcome/findings, and unresolved
blockers. Do not infer review from a file's existence. This checkpoint never runs
`discovery` or `spec_review`; the corresponding stages own those hooks. PRD
import-only runs no spec hook and never automatically promotes intent.

## Default Formats

**PRD file:**

```markdown
---
title: <PRD Title>
status: draft|imported
created: YYYY-MM-DD
source: authored|<url-or-path-or-pasted>
tags: []
---

# <PRD Title>

<Content>
```

**Index:**

```yaml
prds:
  - path: docs/product/prds/YYYY-MM-DD-<slug>.md
    title: <PRD Title>
    status: draft
    created: YYYY-MM-DD
    source: authored
    tags: []
```

---

## Output

Report: PRD path · template used (create mode) · source provenance/reused import (import mode) · index changes · PRD-review evidence or skips/blockers. When spec promotion is requested, hand off to `aw-spec <prd path>`: exploratory for consequential scope/trade-off ambiguity, direct for clear intent. Otherwise recommend that next step without starting it.
