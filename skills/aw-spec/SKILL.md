---
name: aw-spec
description: 'Create or update living feature specs from clear requirements, PRDs, existing behavior, or implementation changes; explore ambiguous product ideas before writing. Use for "create/update a spec", "document product intent", "let''s brainstorm", "what should we build", or "help me think through X". Honors exploration-only requests without committing intent. Requested PRD, plan, and research outputs go to aw-prd, aw-plan, and aw-research.'
argument-hint: "[feature idea, PRD/spec path, existing behavior, or scope; direct or exploratory intent]"
---

# Define Feature Intent

Select the requested output before ambiguity. This skill defines what; `aw-plan`
defines how; `aw-work` executes. Use repo-relative paths and the runtime's current
date. Load only references needed by the selected route. For a spec route, emit
the public tracking event after mode selection and before intake work.

## Requested Output

1. **Create/import/save a PRD:** route to the effective `prd` step (default
   `aw-prd`), even if the content is ambiguous. No automatic spec promotion.
2. **Plan:** route to the effective `plan` step (default `aw-plan`). A plan request
   does not become discovery merely because its source is an idea.
3. **Focused or report-only research:** use `aw-research` to return evidence;
   do not independently change product intent or write product documents.
4. **Trivial fix:** keep the existing direct, lightweight task path; do not
   require a spec, interview, plan, or prototype.
5. **Exploration-only, compare options, no commitment:** select exploratory mode;
   return dialogue and optional useful/requested notes, with no settled feature intent.
6. **Clear request to document/update durable intent:** select direct mode with
   no compulsory interview. Ask only about a material blocker; preserve other
   uncertainties explicitly. Existing-behavior requests require code/test evidence.
7. **Consequential ambiguity in a product/spec request:** select exploratory mode,
   resolve blocking product decisions, then write the spec when ready and authorized.

For software/product exploration without an explicit artifact request, propose
living intent once the scope is ready; an exploration-only request never implicitly
accepts a spec. Non-software exploration uses `references/universal-brainstorming.md`.
Quick factual/single-step questions can be answered directly with no artifact.

## Intake and Provenance

Read `AGENTS.md`, `docs/workflow/config.yml`, the feature index, related specs,
source artifacts, decisions, and applicable standards. Find the existing feature
before inventing another. Gather only context relevant to the selected output.

For an external PRD used to create a spec, reuse an existing imported artifact
when its provenance and contents match the intended input; an existing imported
path uses its stored version without refetching unless an update was requested.
Otherwise preserve the external source through the effective `prd` step before
spec writing or promotion. Pass the original requested outcome
and return here after intake, without starting a second spec route. Imported PRD
bodies stay unchanged. An inaccessible or unavailable source is a blocker: report
it, request an accessible source if needed, and do not invent evidence from its title.

## Stage Routing

Pass the requested output and its permission boundaries to every provider; an
exploration-only call must not write or accept a spec. Resolve stages independently
from entrypoints. Keep both
`workflow.steps.brainstorm.skill` and `workflow.steps.create_spec.skill`:

- **Direct:** resolve only `create_spec`; invoke its configured provider, or load
  `references/spec-writing.md` when blank/missing.
- **Exploratory:** resolve `brainstorm` first; invoke its configured provider, or
  load `references/discovery.md`. After discovery, if a spec is still needed and
  authorized, resolve `create_spec` independently, then invoke that provider or
  the shared writer. Different providers remain distinct and each runs once.
- **Already returned a valid spec:** validate the provider's actual artifact
  against the shared writer's output checks. Do not invoke another writer or write
  it again. Reconcile missing lifecycle/index/trace obligations with its provider;
  a path or a claimed success alone does not establish a valid spec.
- **Bundled self-reference:** an override naming `aw-spec` resolves to the selected
  bundled stage reference after confirming it is this bundled skill. Do not reinvoke
  the public router or recursively rediscover. An unverified same-name custom skill
  is a provider, not permission to bypass it.
- **Unavailable custom provider or unsupported contract:** report the exact blocker
  or limitation; do not silently substitute the bundled stage. Preserve the other
  configured stage and stop only dependent work.

`references/spec-writing.md` is the sole bundled living-spec writer. Discovery
returns clarified context/notes to it; no discovery reference owns a second
spec template or spec/index mutation procedure. Custom providers remain replaceable
and must preserve the same artifact, provenance, permission, and evidence contracts.

## Tracking the Selected Route

After selecting direct/exploratory mode, probe an existing helper once with
`node .scripts/aw-gate.js tracking-schema`. Emit v2 events only when it exits 0
and its trimmed stdout is exactly `2`. An older/unsupported helper must receive
no v2 tracking commands: skip tracking, report the helper-upgrade need, and
continue the authorized work. Global skills can be newer than another repo's
helper. Missing helpers remain a silent no-op. Pass this capability result to
internal providers; they must not fall back to a generic public tracking call.

When supported, generate one opaque invocation ID (for example a UUID) and record
one public invocation:

```sh
node .scripts/aw-gate.js track aw-spec --stage <brainstorm|create_spec> --mode <direct|exploratory> --event invocation --invocation-id <token>
```

Direct starts at `create_spec`; exploratory starts at `brainstorm`. Before each
stage actually executes, record it with the effective provider's name:

```sh
node .scripts/aw-gate.js track <provider> --stage <brainstorm|create_spec> --mode <direct|exploratory> --event stage --invocation-id <token>
```

Reuse the token throughout; exploratory mode persists into a later `create_spec`
stage. For bundled references, the provider is `aw-spec`. Give a custom provider
this stage context and tell it to replace its generic public tracking call with
the stage event. Either the coordinator or provider emits that event, never both.
If the provider cannot honor this contract, report the limitation before execution;
do not silently count another public invocation. Do not emit stages that were
skipped. Output-only redirects above do not emit an `aw-spec` invocation.
PRD preservation inside this route is an internal `prd` stage, using the same
mode/token and the actual PRD provider (default `aw-prd`):

```sh
node .scripts/aw-gate.js track <prd-provider> --stage prd --mode <direct|exploratory> --event stage --invocation-id <token>
```

Pass tracking ownership to intake so its generic public call is suppressed too.
A reused source with no intake execution emits no extra `prd` stage. Missing
helper or disabled tracking is a no-op; tracking is not completion evidence.

## Hook Ownership and Evidence

Only enabled, non-empty hooks run (`workflow.design.enabled` and the corresponding
`workflow.design.hooks.<key>.skill`). Order and ownership:

1. `prd_review`: the PRD intake provider, after authored/imported source preservation
   and before discovery or spec creation. PRD import-only runs no spec hook.
2. `discovery`: the discovery stage, after exploration and before the shared writer
   or spec handoff. Direct mode never fabricates a discovery checkpoint.
3. `spec_review`: the spec-producing stage/shared writer, after final spec output
   and before human review or planning.

Pass hook context and current evidence between stages. Evidence names the hook,
provider, artifact path or discovery context, artifact version/hash or inspected
state, checkpoint order, actual outcome/findings, and remaining blockers. A spec alone is not evidence
that its review ran. Skip a duplicate hook only with applicable current evidence;
otherwise run the missing hook once or report its blocker. A custom brainstorm
returning a spec must still account for discovery and spec-review evidence in that
order before handoff; report incompatible ordering rather than claiming it passed. Do not restart the writer merely to run a missing hook.

Reconcile hook findings within the authorized scope. Do not recursively rerun
hooks or stages; if changes invalidate evidence, report the specific outstanding
review instead of claiming a clean handoff. Hook configuration does not authorize
a prototype, and hook output does not approve the experience for the user.

## Boundaries and Return

Spec/discovery work does not authorize implementation, publication, deletion, or a
separate prototype. Never commit, push, or open a PR merely because a spec is ready.
Retain human-review conditions and prototype consent from the selected reference.

Return the selected mode and executed stages, artifact paths (or no artifact),
source provenance/lifecycle changes, major decisions, blocking versus deferred
questions, hook evidence or skips/blockers, human-review status, and one appropriate
next step. Recommend `aw-plan <spec path>` only when planning will not invent
product behavior. Do not start tickets, implementation, or publication without
an instruction authorizing that step.
