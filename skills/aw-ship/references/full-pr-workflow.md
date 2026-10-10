# Full Commit, Push and PR Workflow

Load only for authorized `full-pr`. This sequence is not reachable from local
commit or description modes. A custom `commit_push_pr` provider receives this
contract, but owns execution instead of running a second bundled workflow.
Emit the actual `commit_push_pr` stage event before beginning this procedure.

## 1. Resolve branch and PR state

Gather current git status, full working/staged diffs, branch, recent commits,
upstream and unpushed commits. Resolve the repository and default branch through
`origin/HEAD`, then the selected GitHub path. If unresolved, check `main`/`master`
conservatively and ask before risking a nonstandard default. Choose GitHub tools
using `references/github-access.md`; capture the existing PR URL/number and state.
Distinguish no open PR from an unavailable/unauthorized lookup; lookup failure
must not cause creation of a duplicate PR.

- Detached HEAD: ask to create a feature branch; if declined, stop.
- Default branch with no uncommitted or unpushed work and an up-to-date upstream:
  report no feature branch work and stop. A missing upstream requires inspection;
  do not assume it means no work.
- Default branch with work: never push it directly. Before any commit provider,
  follow `references/branch-creation.md` to preserve unpushed local commits and
  uncommitted work while making the feature branch.
- Feature branch: continue, checking that the proposed published range belongs
  to the requested work. Ask about unrelated pre-existing commits rather than
  publishing them silently.

## 2. Prepare before committing

Read workflow config, project instructions, applicable standards and the input
plan/spec. Preserve existing current evidence and disclose stale/missing evidence.

1. **Spec drift:** for changed durable behavior, workflow, API, UX or intent, read
   the feature index and affected specs. Update justified drift or report why no
   spec applies. Record resolved but missing decisions via the effective capture
   provider (default `aw-capture decision`). Do not invent new product decisions.
2. **README:** update `README.md` before committing when setup, commands,
   configuration, architecture or workflow behavior changed. A missing required
   update is a blocker unless clearly internal or no README exists.
3. **Capture checkpoint:** for non-trivial work, confirm decisions and correction
   learnings are captured, and offer reusable solved problems for `aw-capture
   solution`. Skip if trivial or already done. Keep any capture permission prompt
   concise; do not write unrelated artifacts or merge session logs into feature work.
4. **Review:** before pushing or opening a non-trivial PR, invoke the effective
   `workflow.steps.review.skill`, default `aw-review`. Use current review evidence
   when supplied; do not claim a run that did not occur. Address safe scoped
   findings, and carry accepted judgment calls/Known Residuals into the PR body.
   Unaccepted blocking findings stop shipping.
5. **Design:** when `workflow.design.enabled` is true and
   `workflow.design.hooks.pre_pr.skill` is non-empty, invoke it with the PR-ready
   artifacts before push/PR. Retain outcome evidence or a justified skip. Missing
   applicable review evidence is a blocker, not a silent bypass.

PR title conventions follow project instructions, then recent history, then
conventional commits. Shared commit mechanics resolve commit conventions/config.

## 3. Commit locally

Run `references/commit-workflow.md` for the requested changes. It resolves the
independent `workflow.steps.commit.skill`, protects staged user work, and returns
verified hashes or no commit. Never duplicate a custom provider's commits.

Changed/untracked `docs/metrics/**` is workflow exhaust, including tracking files
created at entry. Inspect it and include that exhaust in this full-PR branch,
preferably as a separate `chore(metrics): ...` commit when distinct. This narrow
rule does not authorize unrelated user files or suspicious/sensitive content in
the metrics directory. Use the same effective commit provider and shared staging
mechanics for any additional metrics commit; suppress duplicate public events and
keep the invocation token. Record a stage event only when another commit stage
actually executes.

## 4. Compliance before push

Before the first push and before composing/applying a new PR for non-trivial
changes, invoke `workflow.steps.check_workflow_compliance.skill` when configured,
otherwise `aw-check-workflow-compliance`. Supply the intended local base, committed
range and any scoped worktree changes. Run for changed behavior, workflow,
config, setup, acceptance criteria or review-gate expectations. Skip only trivial
docs-only/mechanical changes and state the skip explicitly. The audit does not
require publication or an upstream. Keep its verdict separate from push status.

Fix locally actionable findings within scope; repeat required checks, commit the
resulting in-scope changes and rerun compliance on that final scope before push.
Unresolved blocking findings stop publication. Never stamp evidence without
actual execution; a pre-push gate failure is not permission to invent a receipt
or bypass the gate. Ensure PR-body inputs are ready; composition follows below.

### Push and metrics closure

Before every push, ensure required checks and genuine review/compliance evidence
cover the final scope and run the configured deterministic gates. If later steps
change audited content, rerun affected checks and compliance before publishing
those changes, except for the bounded workflow-exhaust closure below. Handle any
separately configured freshness gates honestly; this sequence does not waive them.

**Bounded workflow-exhaust closure:** inspect the final delta since the actual
audit, including staged/untracked files and metrics emitted by the audit itself.
If the only additions are append-only, expected tracking/telemetry records under
`docs/metrics/**` from the current authorized workflow (including newly created
metric files), inspect their contents and preserve the prior substantive audit
verdict. Report closure evidence: the audit's scope/HEAD, inspected metric paths
and delta, and resulting closure commit. Do not invoke another tracked compliance
audit solely because this expected exhaust was appended. This inspection emits no
tracking, telemetry, receipt or gate stamp of its own; do not restamp a gate to
make it fresh. Include the metrics commit's own expected stage event before the
final inspection/staging, so closure does not generate another unhandled delta.
If substantive or suspicious changes appear, stop closure and rerun affected
checks and a real compliance audit after resolving them within authorization.
Configured gates still run on the final commit; gate failures block publication.
If a custom provider keeps producing new output after staging, report the blocker
rather than looping audits or bypassing its gate.

Push the confirmed feature branch to the verified intended remote:

```sh
git push -u origin HEAD
```

If clean and already pushed, this is a no-op. Verify the remote branch contains
the expected HEAD before claiming success. External credential/network/policy
failures block publication; a failed push does not undo a supported local
compliance verdict. Report both statuses, and do not claim a PR was created.
Do not force-push, rewrite history, or use another identity to evade a denial.

After the initial push and every subsequent local pre-PR workflow step, inspect:

```sh
git status --short -- docs/metrics
```

Stage only changed/untracked `docs/metrics/**`, commit it through the shared
commit mechanics as workflow exhaust and push again. This includes after PR
description composition, template loading, and any evidence workflow; perform a
final metrics check immediately before create/edit. Do not create or edit the PR
with unpushed metrics changes. If tracking the metrics commit itself appends
metrics, include that event before staging; do not start a new invocation while
closing exhaust. Unrelated changes remain untouched.

## 5. Compose and apply

Read `references/pr-description-writing.md` in full. Pass the specific existing
PR ref when present and include plan/spec links, review/design/compliance results,
tests, accepted residual findings and operational monitoring/validation context.
Do not invent validation or runtime evidence.

**Evidence decision:**

- Explicitly requested evidence: capture when authorized and feasible; if blocked
  or not useful, briefly say why.
- If you authored the change and know it is non-observable (docs, tests, CI,
  internal refactor), skip the prompt.
- Otherwise, if observable UI, CLI/API behavior, generated artifacts or workflow
  output can be captured without unavailable credentials, paid services, hardware
  or deploy-only infrastructure, ask whether to capture now, use existing evidence,
  or skip. Do not run evidence workflows before that choice.
- Preserve existing Demo/Screenshots blocks unless refresh was requested.

Read `references/pr-application.md` for templates, new draft-PR creation, or the
separate existing-PR rewrite question and preview confirmation. Existing commits
are already on the PR whether or not its description is rewritten. Declining a
rewrite skips editing only; it does not skip the configured post-push CI step.
Flush workflow metrics once more immediately before an authorized PR write.

## 6. Post-PR CI

After new PR creation or a push to an existing PR, read workflow config. If
`post_pr.ci_monitor.provider` is `manual` or missing, skip and report monitoring
disabled. Otherwise invoke `workflow.steps.monitor_pipeline.skill` with the PR URL
when non-empty; if absent, skip and report no monitor configured.

Continue the configured monitor/fix loop until checks pass, its configured maximum
attempts is reached, or blocked by external infrastructure, credentials, flakes,
quota or unrelated base-branch problems. Fix only failures caused by the current
branch and within the user's authorization. Track the exact checked HEAD, and
report remaining blockers rather than claiming readiness. No CI loop for a
text-only PR update.
