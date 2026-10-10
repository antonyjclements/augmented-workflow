# GitHub Access

Choose one GitHub path before the first remote step and keep it for the run.
Git operations use plain git, not the GitHub API. Local-commit needs no GitHub
connection and never opens a remote workflow.

## Resolution order

1. **GitHub MCP tools** are the default when available. Load deferred schemas
   through the harness as needed; use their actual supported read/write methods.
2. **`gh`** is the fallback when MCP tools are unavailable. Probe cheaply with
   `gh auth status` or the required read, using the intended account/repository.
3. **Neither:** for full-pr, finish only independently authorized local work and
   plain-git push when possible; state which PR/remote step was not completed and
   why. In description modes, return only a draft justified by existing local
   evidence, or stop with the exact evidence/target-access blocker. Never commit,
   push, fetch, create a PR, or run a background workflow to repair a description
   path. Description-update cannot apply without verified target access.

Do not switch credentials/providers to evade a denial. A failed lookup is not
proof that no PR exists. Never claim the PR was created or updated after a failed
or unverified action.

## Repository and target identity

For a branch workflow, derive owner/repo from `git remote get-url origin` and
verify the intended remote and account. For an explicit PR URL, use its exact
owner/repository/number; do not silently substitute the current branch's PR.
Resolve a bare number in the confirmed current repository. Ask if target identity
is ambiguous. Existing PR updates always pass an explicit target ref/number.

Use MCP equivalents for:

| gh operation | MCP operation |
|---|---|
| `gh pr view <ref> --json ...` | Read the exact PR metadata/body/commits |
| `gh pr diff <ref>` | Read the exact PR diff/files |
| `gh repo view --json defaultBranchRef` | Read repository default-branch metadata |
| `gh pr create --draft --title T --body-file F` | Create draft PR with explicit owner/repo/head/base/title/body |
| `gh pr edit <ref> --title T --body-file F` | Update requested title/body fields on the exact PR |

An MCP body is a string, so no temp file is needed. The CLI path requires a real
temp body file as described in `references/pr-application.md`. Templates and
preview confirmations apply identically on both paths.

Description-only and description-update use read-only API metadata/diffs or
already available git objects in a confirmed non-partial/non-promisor clone.
Use API-only reads for partial/promisor clones or uncertain completeness, because
local object reads can lazily fetch. Never fetch refs in these modes. Full-pr may
fetch only as its branch/range procedure requires. Respect unavailable tools
and report partial evidence instead of inventing a range or result.
