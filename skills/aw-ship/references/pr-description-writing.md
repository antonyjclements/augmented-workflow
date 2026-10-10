# PR Description Writing

## The core principle

The diff is already visible on GitHub. The description exists to explain what the diff cannot show: what was impossible before and is now possible, what was broken and is now fixed, what shape changed. Cut any sentence a reader could reconstruct from the diff itself.

- Bad: "Adds `evidence-decider.ts`, modifies `aw-ship/SKILL.md` to call it, and updates two test files."
- Good: "Evidence capture now decides automatically whether a change has observable behavior. CLI tools and libraries are now eligible alongside web UIs."

If the lead sentence describes what was moved, renamed, or added rather than what's now possible or fixed, rewrite it. This applies to every section, not just the opening — restating the diff is the failure mode this skill exists to prevent.

For user-facing bugs, run an extra before/after pass before writing the mechanism: name what the user would have seen before and what they now see instead. Only then mention the technical cause or fix, and only if it helps the reviewer understand risk. A lead like "Playback hooks now ignore late async responses" is still too mechanical if the visible bug was "old videos, thumbnails, or errors could appear after switching selections."

---

## Step Pre-A: Resolve the range and base

Keep the caller's shipping mode throughout. In `description-only` and
`description-update`, never run `git fetch`, checkout, tracking, tests, apps,
evidence capture or any workflow that writes repository state. Use
`GIT_OPTIONAL_LOCKS=0` for read-only git commands so status/index reads do not
refresh the index. Use `git --no-pager diff --no-ext-diff --no-textconv` for
local diffs so configured diff/textconv programs cannot run. Use existing evidence only. Missing refs or evidence are a
blocker to a reliable description, not permission to mutate the checkout.

Before local history, diff or object reads in either description mode, inspect
configuration with read-only `git config --get extensions.partialClone` and
`git config --get-regexp '^remote\..*\.(promisor|partialclonefilter)$'`. A partial
or promisor clone may lazily fetch missing objects even through `git diff`,
`git log`, `git show` or `git cat-file`. If any partial/promisor configuration is
present or clone completeness is uncertain, use the read-only GitHub API path
only; do not run local history/diff/object reads. If that API cannot supply the
range, report an evidence blocker and stop. Do not rely only on an environment
flag that an older git may silently ignore. This prevents implicit lazy fetches
as well as explicit fetches.

Two input routes:

- **Current branch:** describe HEAD against the confirmed default/caller-supplied
  base. Resolve base from `base:<ref>`, existing `origin/HEAD`, read-only repository
  metadata, then already present `origin/main`, `origin/master`, or
  `origin/develop` refs. Ask if none resolves. Use existing objects for `git log
  <base>..HEAD` and `git diff <base>...HEAD`; disclose unverified remote freshness.
  Uncommitted work is not silently included in a committed-branch description.
- **Specific PR:** read exact PR metadata, diff and commits through the selected
  GitHub MCP/API or gh path, including `baseRefName`, `baseRefOid`, `headRefOid`,
  `url`, `body`, `title`, `state`, `isCrossRepository`, base repository and head
  owner. A PR's actual base/head are authoritative, not the local checkout.
  If state is not OPEN, report and stop. Preserve the original title/body for
  comparison before any later approved update.

CLI read equivalents:

```sh
gh pr view <ref> --json baseRefName,baseRefOid,headRefOid,url,body,title,state,isCrossRepository,headRepositoryOwner,commits
gh pr diff <ref>
```

Read-only API diff/metadata/commits are the preferred PR route for description
modes, including fork PRs or shallow clones. Already available local objects may
be used only when they match the verified PR repository, base and head exactly.
Do not diff against origin for a fork whose base belongs to another repository.
If no safe read path supplies the required evidence, report the blocker and stop;
never fall back to fetching merely to draft or update text.

Only `full-pr` may refresh refs with git fetch. Match the PR base owner/repository
to a real local remote; if none matches, use the read-only PR diff/commits path.
For a matching base remote:

```sh
git fetch --no-tags <base-remote> <base>
git fetch --no-tags <base-remote> <head>   # PR mode: verified headRefOid
```

If SHA fetching is unsupported but GitHub exposes pull refs, full-pr may fetch
`refs/pull/<number>/head`; verify its OID against metadata before diffing. On
unavailable refs, unrelated histories, or offline/shallow clones, use the
selected API/gh read fallback and say that it was used. Never imply fresh local
refs when fetch failed.

If the commit list is empty, report "No commits to describe" and stop.

---

## Step A: Size the description

Match weight to weight. When in doubt, shorter wins. Subtract fix-up commits (review fixes, lint, rebase resolutions) when sizing — they're invisible to the reader. Large PRs need more selectivity, not more content.

| Change profile | Description approach |
|---|---|
| Small + simple (typo, config, dep bump) | 1-2 sentences, no headers. Under ~300 characters. |
| Small + non-trivial (bugfix, behavioral change) | 3-5 sentences. No headers unless two distinct concerns. |
| Medium feature or refactor | Narrative frame, then what changed and why. Call out design decisions. |
| Large or architecturally significant | Narrative frame + 3-5 design-decision callouts + brief test summary. Target ~100 lines, cap ~150. For PRs with many mechanisms, use a Summary table; do not create an H3 per mechanism. |
| Performance improvement | Include before/after measurements as a markdown table. |

For small + simple PRs, the value-led sentence is the entire description.
For small + non-trivial bugfixes, the 3-5 sentence target still needs a user-visible before/after lead when the bug affected UI, CLI output, workflow output, or any other user-observable behavior. Concision is not a reason to skip the visible symptom.

---

## Step B: Compose the title

`type: description` or `type(scope): description`.

- Type by intent, not file extension. When `fix` and `feat` both seem to fit, default to `fix` — adding code to remedy missing behavior is `fix`. Reserve `feat` for capabilities the user could not previously accomplish. Use `refactor`/`docs`/`chore`/`perf`/`test` when more precise.
- Scope (optional): narrowest useful label. Omit when no single label adds clarity.
- Description: imperative, lowercase, under 72 chars, no trailing period.
- Match repo conventions visible in recent commits.
- **Never use `!` or `BREAKING CHANGE:` without explicit user confirmation** — they trigger automated major-version bumps.

---

## Step C: Assemble the body

In order: opening → body sections that earn their keep → test plan if non-obvious → evidence block if one exists → Compound Engineering badge after a `---` rule.

The opening goes under `## Summary` if the body uses any `##` headings; bare paragraph otherwise. No orphaned opening paragraphs above the first heading.

**Evidence handling:** preserve any existing `## Demo` or `## Screenshots` block verbatim unless the user's focus asks to refresh it. If the caller passed a freshly captured URL or path, splice as `## Demo`. Otherwise omit. Place before the badge. Never label test output as "Demo" or "Screenshots."

**Visual aids:** reach for a diagram or table when it conveys the change faster than prose — relationships, flows, state transitions, sequences, trade-offs, before/after data, or any structure prose would have to enumerate. Mermaid and markdown tables cover most shapes; don't be limited to a particular type if a different one fits the change better. Place inline at the point of relevance. Skip for simple, prose-clear, or rename/dep-bump changes. Prose is authoritative when it conflicts with a visual.

**GitHub gotchas:** never prefix list items with `#` (GitHub auto-links `#1` as an issue ref). Use `org/repo#123` or full URL for actual references.

---

## Step D: Badge

```markdown
---

[![Augmented Workflow](https://img.shields.io/badge/Built_with-Augmented_Workflow-7C6CFF)](https://github.com/antonyjclements/augmented-workflow)
![HARNESS](https://img.shields.io/badge/MODEL_SLUG-COLOR?logo=LOGO&logoColor=white)
```

| Harness | `LOGO` | `COLOR` |
|---|---|---|
| Claude Code | `claude` | `D97757` |
| Codex | (omit `?logo=` param) | `000000` |
| Gemini CLI | `googlegemini` | `4285F4` |

**Model slug:** spaces become underscores; append context window and thinking level in parens if known. **URL-encode literal parens as `%28` / `%29`** — unencoded parens inside markdown image URLs break release-please's commit parser, which silently drops the commit from the changelog. Examples: `Opus_4.6_%281M,_Extended_Thinking%29`, `Sonnet_4.6_%28200K%29`, `Gemini_3.1_Pro`.

Skip the badge if regenerating a body that already contains it.
