---
name: aw-check-workflow-compliance
description: "Check whether completed work followed Augmented Workflow config, implementation test policy, acceptance coverage, README expectations, and review gates. Use on local changes before push and PR creation for non-trivial changes."
argument-hint: "[optional: plan/spec/ticket path or branch ref]"
---

# Check Workflow Compliance

First action, if `.scripts/aw-gate.js` exists: `node .scripts/aw-gate.js track aw-check-workflow-compliance` (silent no-op otherwise).

Review workflow-policy evidence for scoped local changes before publication. This audit does not require a push, upstream branch, or remote access. This is an accountability check, not a security sandbox, and it does not replace CI or `aw-review`.

## Inputs

`$ARGUMENTS` may be:

- blank: review the current branch/diff
- plan/spec path
- ticket/story identifier or URL
- branch/ref

Resolve and report the audit scope: local base ref/SHA, HEAD, committed range, and
included staged, unstaged, and untracked changes. Compare the intended base to
HEAD for committed changes, then inspect scoped working-tree changes separately;
do not mistake a clean worktree for an empty branch diff. Exclude unrelated user
work explicitly. An upstream is optional: use an explicit local base or verified
local default-branch ref when appropriate. If no diff scope can be determined,
report insufficient scope instead of inventing compliance. Do not fetch or push
just to make the audit runnable.

## Configuration

Read `docs/workflow/config.yml` first.

- Use `workflow.steps.check_workflow_compliance.skill` only when a repo replaces this bundled compliance step.
- Read `workflow.implementation.test_policy`; blank or missing values default to `acceptance-first`.
- Read `workflow.steps.*.skill` to understand configured replacement steps. Do not use removed legacy skill-selector fields such as `ticket_creation.skill`, `git.commit.skill`, `post_pr.ci_monitor.skill`, and `research.slack.skill` for routing if they appear in older repos; report the migration path instead.
- Read `workflow.auxiliary.*.skill` to understand configured helper skill replacements such as Slack research.
- Read `workflow.design`; when enabled, configured non-empty design hooks are expected process checkpoints at PRD review, discovery, spec review, plan review, ticket review, implementation review, and pre-PR.
- Read the `e2e` block. When `e2e.enabled` is true, changes touching `e2e.trigger_paths` (empty means unscoped) are expected to carry e2e coverage or a stated exception. A configured `workflow.auxiliary.e2e_tests.skill` says who authors the tests, not whether coverage is expected — a repo that writes e2e tests by hand is still in scope.
- Treat non-skill configuration fields as authoritative, including `git.commit.*`, `pull_request.template.*`, `post_pr.ci_monitor.provider`, and `human_review.*.reviewers`.

## Evidence To Gather

1. `AGENTS.md` and `docs/workflow/config.yml`.
2. Current branch, local audit scope, changed files, and diff. Report publication status separately using available push/upstream evidence; a tracking ref alone does not prove the current HEAD is published.
3. Relevant plan/spec/ticket artifacts when supplied or discoverable.
4. `docs/features/index.yml` and affected `docs/features/*/spec.md` files.
5. Applicable `docs/standards/index.yml` entries when present.
6. Tests/checks run, based on terminal/session context when available and changed test files in the diff.
7. README changes when setup, commands, configuration, architecture, or workflow behavior changed.
8. Evidence that `aw-review` ran, or a justified exception.
9. Evidence that enabled, configured design hooks ran at applicable checkpoints, or a justified skip.

## Checks

Report findings when:

- A configured `workflow.steps.<step>.skill` appears ignored without explanation.
- A configured `workflow.auxiliary.<key>.skill` appears ignored without explanation.
- `workflow.design.enabled` is true and an applicable configured design hook appears ignored without explanation.
- A removed legacy skill-selector field is used as the active routing source.
- The effective implementation test policy is missing from the work summary, PR inputs, or handoff evidence.
- Acceptance criteria from the linked spec, plan, or ticket are not mapped to automated tests or explicit manual checks.
- `e2e.enabled` is true, the diff touches `e2e.trigger_paths`, and the change carries neither e2e coverage nor a stated exception.
- Workflow/setup/configuration behavior changed but `README.md` was not updated or consciously skipped.
- Required spec/code review gates are missing for non-trivial behavior or workflow changes.
- PR body inputs are not ready to include policy, tests/checks, acceptance coverage, decisions, and residual risks.

Severity guidance:

- `P1`: likely to ship work that violates repo workflow policy or lacks required acceptance/test evidence.
- `P2`: meaningful gap in traceability, documentation, review, or migration guidance.
- `P3`: advisory cleanup or clarity issue.

## Output

Findings first, ordered by severity:

```text
Workflow compliance findings:
- [P1] <title>
  location: <path/section>
  evidence: <what shows the gap>
  impact: <why it matters>
  suggested fix: <specific action>
```

If no findings:

```text
Workflow compliance: pass
Residual risk: <brief note>
```

Always include:

- effective test policy
- acceptance coverage summary
- e2e coverage status when `e2e.enabled` is true, otherwise omit it
- README status
- review gate status
- audited base/HEAD and included committed/worktree scope
- publication status, separate from the compliance verdict: verified pushed HEAD,
  not pushed, or unknown/unavailable (state the evidence and its limits). No
  upstream or unavailable remote evidence is not itself a compliance finding.

## Fixture-Style Dry Run

Use this scenario when validating the skill instructions:

- Config contains `workflow.implementation.test_policy: acceptance-first`.
- Config contains `workflow.steps.work.skill: ""` and no legacy skill-selector fields.
- Source spec has two acceptance criteria.
- Diff adds or updates tests that map to both acceptance criteria.
- Local branch has no upstream and has not been pushed; an explicit local base makes the committed and worktree diff scope verifiable.
- Diff changes `docs/workflow/config.yml`.
- README is missing the corresponding workflow config update.

Expected result:

- No missing-test finding.
- No missing-push finding; publication status is reported as not pushed, independently of the README finding.
- One README finding explaining that workflow configuration changed without user-facing docs.
- Effective test policy reported as `acceptance-first`.
- Acceptance coverage reported as covered by tests.

Also dry-run the same complete local evidence without the README gap: expect a
compliance pass with publication still not pushed. Repeat with unavailable remote
access: expect the same verdict and publication unknown/unavailable. Removing test
or required review evidence must still produce a finding; removing a verifiable
local base/scope must report insufficient scope, not a pass.

## Freshness Gate

Only after the compliance review completes (reporting, not fixing), if `.scripts/aw-gate.js` exists, stamp the freshness gate in two steps so the stamp carries proof the check ran:

1. Write the receipt from your report: `node .scripts/aw-gate.js receipt check_workflow_compliance --summary "<one line: compliance verdict and any gaps found>"`.
2. Record: `node .scripts/aw-gate.js record check_workflow_compliance`.

When `gates.require_receipt` is on, `record` refuses to stamp without the fresh receipt from step 1 and consumes it (single-use). Never stamp the gate without running this check — `--no-receipt` exists only for bootstrap. The gate state is git-ignored, but enabled telemetry can append tracked `docs/metrics/**` files; the initial tracking command can also write workflow exhaust. Report this generated tracking/telemetry exhaust accurately and leave its publication to the authorized shipping workflow's bounded closure. A deterministic pre-push/CI `aw-gate.js check` then enforces that compliance ran recently. See `docs/workflow/README.md`.

## Rules

- Do not mutate files unless the user explicitly asks for fixes.
- Do not claim compliance when local scope is insufficient or required test or review evidence is missing. Missing publication evidence does not invalidate an otherwise supported local compliance verdict.
- Do not hide external blockers such as credentials, network, remote policy, or unavailable tools.
- Keep findings actionable and scoped to workflow compliance.
