---
name: aw-ship
description: 'Ship only what the user requests: a local git commit, a full commit/push/PR workflow, a read-only PR description draft, or a confirmed update to an existing PR description. Use for "commit this", "save my changes", "ship this", "open a PR", "draft a PR description", or "rewrite this PR body". Local commits never push; description work never commits or pushes.'
argument-hint: "[local-commit|full-pr|description-only|description-update] [scope, PR ref, or focus]"
---

# Commit or Prepare a Pull Request

## Select Mode

Select the requested mode and authority before any command, tracking, context
expansion, or provider invocation. Load only its references. Explicit restrictions
such as "local only", "do not push", or "draft only" take precedence over broad
shipping language. If intent is ambiguous or conflicting, ask one concise question
and perform no mutation while waiting. Silence is not authorization.

- **local-commit:** "commit this", "save my changes", or explicitly local-only
  work. Read `references/commit-workflow.md`. Never push or open a PR.
- **full-pr:** an explicit commit/push/PR request, "ship this", or "open a PR".
  Read `references/full-pr-workflow.md`. A finished implementation or a configured
  next step alone does not authorize publication.
- **description-only:** "write/draft/describe this PR", or a pasted PR URL/number
  alone. Read `references/pr-description-writing.md` and the template section of
  `references/pr-application.md`; print the title/body and stop. Do not apply it.
- **description-update:** explicitly rewrite/refresh an existing PR's text with
  no commit/push intent. Read the same description reference and
  `references/pr-application.md`; verify the target, preview and obtain confirmation,
  then update only the requested title/body fields on that PR. No open target PR
  means report the blocker and stop, not create one.

In both description modes, skip all tracking, session, telemetry and metrics
calls: no capability probe either. Do not fetch, checkout, stage, commit, push,
write repo files, or invoke mutating providers. Run no review, capture, spec/README
updates, design hooks, compliance or CI workflow. Reuse existing evidence; do not
run tests, applications or screenshot/evidence capture that can mutate state.
Only description-update may mutate the explicitly authorized target PR text,
after its preview confirmation. Keep these limits across every reference and tool.

## Stage Providers

Read `docs/workflow/config.yml` if present. Preserve
`workflow.steps.commit.skill` and `workflow.steps.commit_push_pr.skill`
independently; neither stage replaces the other.

- Local commit resolves `commit` only, inside the shared commit procedure.
- Full PR resolves `commit_push_pr` first. When blank/missing, use the bundled
  full workflow, which later resolves `commit` independently for any commit work.
  When custom, pass the requested scope, permissions, workflow sequence, existing
  review/capture/design/check evidence, effective commit provider and tracking
  context. That provider owns the full workflow and must preserve the independent
  commit stage and its provider; never run the bundled workflow again afterward.
- A verified bundled self-reference to `aw-ship` enters the corresponding stage
  reference in place; never recursively reinvoke the public router. An unverified
  same-name custom skill remains a provider to resolve, not a bundled fallback.
- An unavailable custom provider or unsupported permission/sequence contract is
  a blocker. Do not silently substitute the bundle. Never recursively call an
  already active provider for the same stage.
- Description modes bypass workflow providers entirely; never invoke commit or
  commit_push_pr providers just to compose or update text.

The shared commit reference owns all bundled commit mechanics. A provider's
claimed success must be checked against real branch, hash, remote and PR state.
Configuration, tracking, and gate receipts do not enlarge user authorization.

## Tracking

Only after selecting local-commit or full-pr, probe an existing helper once:
`node .scripts/aw-gate.js shipping-tracking-schema`. Use v2 shipping events only
when it exits 0 and its trimmed stdout is exactly `2`. With an older/unsupported
helper, skip tracking, report the helper-upgrade need, and continue authorized
work. There is no generic tracking fallback. Missing helpers are a silent no-op.

When supported, generate one opaque invocation token and emit one public invocation:

```sh
node .scripts/aw-gate.js track aw-ship --stage <commit|commit_push_pr> --mode <local-commit|full-pr> --event invocation --invocation-id <token>
```

Local-commit starts at `commit`; full-pr starts at `commit_push_pr`. Immediately
before each stage actually runs, emit its effective provider:

```sh
node .scripts/aw-gate.js track <provider> --stage <commit|commit_push_pr> --mode <local-commit|full-pr> --event stage --invocation-id <token>
```

Full-pr mode persists into the nested commit stage. Bundled references use
`aw-ship` as provider. Reuse the token; no stage event for skipped commit work.
Either the coordinator or the custom provider emits a stage event, never both.
Pass the capability result and ownership; internal commit/full-PR providers
suppress their generic public tracking call, including when tracking is skipped.
If a provider cannot honor that contract, report the blocker before invoking it.
Review, compliance and other separately executed supporting skills retain their
existing gate/tracking identities. Tracking is not completion evidence.

## Tools, Questions and Return

GitHub reads/writes use `references/github-access.md`: choose MCP when available,
otherwise `gh`. Use plain git for git operations. Local-commit needs no GitHub
connection. Respect the mode even when a tool is missing; report what did not run.

Ask through the platform's available blocking question tool, or chat when it is
unavailable or errors. Never skip a required approval because a tool is missing.

Return the selected mode, actual outcomes, commit hashes/subjects when applicable,
PR URL or draft text, checks and explicit skips, remaining changes, and blockers.
Do not claim a push or PR update without verifying it. Full-PR ordering, rewrite
confirmation and post-PR monitoring are in the full workflow reference.

`aw-request-human-review` remains independently available for spec/plan sign-off
PRs; never route that request through implementation shipping. Targeted review
feedback remains `aw-resolve-pr-feedback`, outside this merger. Merging,
deployment, releases and other publication are separate actions requiring their
own authorization.
