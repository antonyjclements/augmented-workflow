# Shared Commit Mechanics

This is the sole bundled commit procedure for `local-commit` and `full-pr`.
It never pushes or opens a PR. The full workflow owns those later steps.

## 1. Gather context and scope

Read `docs/workflow/config.yml` and the relevant project instructions. Reuse
current, already supplied context; otherwise gather:

```sh
git status
git diff HEAD
git diff --cached
git branch --show-current
git log --oneline -10
git rev-parse --abbrev-ref origin/HEAD 2>/dev/null || echo DEFAULT_BRANCH_UNRESOLVED
```

Include requested untracked files when assessing the diff. Distinguish the
requested change from unrelated user work, including already staged changes.
Agree the file-level commit set before invoking any commit provider. Never sweep
in unrelated staged files: if the index contains them, stop and ask how to isolate
the requested commit without disturbing that work. Check for credentials, `.env`,
build outputs, and other accidental files. Do not reset, discard, or unstage user
work without authorization.

If there is no in-scope change, report that there is nothing to commit. In
`local-commit`, stop; in `full-pr`, return without a commit-stage event and let the
caller assess the existing branch commits. No provider runs for a skipped stage.

Resolve the remote default branch by stripping `origin/` from `origin/HEAD`.
For `DEFAULT_BRANCH_UNRESOLVED` or bare `HEAD`, use already available repository
metadata, or the selected GitHub path in full-pr; otherwise conservatively treat
`main` and `master` as default candidates. If a nonstandard default cannot be
resolved safely, ask rather than assuming the current branch is safe.

## 2. Branch safeguards before any commit provider

- **Detached HEAD:** ask whether to create a feature branch. If accepted, run
  `git checkout -b <branch-name>` and recheck the branch. If the user declines,
  require an explicit choice to commit on detached HEAD in `local-commit`;
  explain that it will not be attached to a branch. In `full-pr`, stop if declined.
- **On main, master, or the resolved default branch:** never commit there.
  In `local-commit`, automatically create a feature branch from current HEAD;
  no fetch is needed and no existing local commits are discarded. In `full-pr`,
  the caller first follows `references/branch-creation.md` to handle a fresh
  remote base, unpushed local commits, and worktree collisions.
- **Feature branch:** keep it. Always confirm the selected branch before staging.

## 3. Determine convention and effective commit provider

Resolve `workflow.steps.commit.skill` independently even inside the bundled
full-PR route. A verified bundled `aw-ship` self-reference enters this procedure
in place; never reinvoke the router. An unavailable custom provider is a blocker,
not permission to bypass it. Follow the router's tracking ownership contract.

Convention priority:

1. `git.commit` config: `format`, `scope_required`, `template`, `allowed_types`,
   and `examples`. A required scope must be non-empty; replace placeholders with
   actual values.
2. Project instructions already loaded.
3. The ten recent commits when they show a clear convention.
4. Conventional commits: `type(scope): description`, using `feat`, `fix`, `docs`,
   `chore`, `refactor`, `test`, `ci`, `build`, `perf`, or `style`.

Removed `git.commit.skill`: tell the user to migrate it to
`workflow.steps.commit.skill`; do not support both config shapes.
For ambiguous fix/feature intent, prefer `fix` when restoring broken or missing
behavior. Reserve `feat` for a capability users could not previously accomplish.
Use an imperative, value-led subject; add a body explaining motivation or
trade-offs for non-trivial changes. Never introduce `!` or `BREAKING CHANGE:`
without explicit user approval because release automation may treat it as major.

## 4. Group, stage, and commit

Choose obvious logical file-level groups, generally two or three at most. When
ambiguous, one commit is fine. No `git add -p` or hunk splitting. Keep session-log
and synthesis commits separate from feature/fix commits.

Immediately before the actual commit stage, emit its stage event with the
effective provider, selected mode, and invocation token. For a custom provider,
pass the authorized file set, staged/unstaged diff, branch, recent commits,
configured format/template/types/examples, PR intent, and strict mode limits.
It must return commit hashes or the exact commit message to use, plus what it
actually changed. If it returns verified hashes, do not commit those changes
again. If it returns only a message, use it with the bundled staging mechanics.
A custom commit provider must never push or open a PR, even inside full-pr.
Do not invoke an already active provider for the same stage recursively; report
an unsupported provider cycle or contract before any additional mutation.

For the bundled mechanics, stage named files only. Avoid `git add -A` and
`git add .`; they include unrelated or sensitive work. Inspect `git diff --cached`
again and verify that every staged file is authorized before committing:

```sh
git add -- file1 file2 file3
git diff --cached --stat
git commit -m "$(cat <<'EOF_MESSAGE'
type(scope): explain the value

Optional motivation and trade-offs.
EOF_MESSAGE
)"
```

Only `full-pr` has a workflow-exhaust rule for `docs/metrics/**`, described in
`references/full-pr-workflow.md`. Local commits do not inherit remote metrics
sweeps; keep incidental tracking changes unstaged unless explicitly included.
Follow enabled commit gates; a failed gate is a blocker, not permission to bypass
hooks, fabricate receipts, or silently launch a broader workflow.

## 5. Verify and return

Run `git status` after each commit to verify the result, and read the actual
hash(es), subject(s), and changed-file set. Verify provider results the same way.
For `local-commit`, stop after reporting hashes, subjects, branch, checks and
remaining changes. Never push or create a PR. Do not run compliance or CI in
local-commit, and do not launch review, capture, README/spec changes, evidence
capture, or the full workflow merely to satisfy a shipping checklist.
For `full-pr`, return verified results to the caller's push step.
