---
name: aw-init
description: "Install the augmented-workflow repo-local files into any target repository. Use when the user says initialize augmented workflow, install AGENTS.md/CLAUDE.md, setup this repo for augmented workflow, or wants the workflow directory structure created."
argument-hint: "[optional target repo path]"
---

# Initialize Augmented Workflow

First action, if `.scripts/aw-gate.js` exists: `node .scripts/aw-gate.js track aw-init` (silent no-op otherwise).

Install repo-local augmented-workflow files into a target repository.

## Bundled Files

- `scripts/install.sh` installs the workflow.
- `artifacts/AGENTS.md` is the portable agent routing file.
- `artifacts/CLAUDE.md` contains `@AGENTS.md` for Claude Code compatibility.

## Workflow

1. Resolve the target repo. Use the user-provided path or the current working directory. For the first spec/shipping consolidation migration, obtain the reviewed new checkout/archive separately and execute its installer. Never bootstrap this migration with an already-installed pre-consolidation (including 0.15.0) `install.sh --remote` or `upgrade.sh --refresh-skills --remote`: old running functions can overwrite custom skills. See the safe checkout recipe in `docs/workflow/README.md`.
2. Preview skill ownership, collisions and preserved routing before upgrading. Python 3 is required for content-verified skill migration:

```bash
<skill-dir>/scripts/install.sh --repo <target-repo> --dry-run
```

Resolve reported collisions without overwriting user-owned skills. Then run the bundled installer:

```bash
<skill-dir>/scripts/install.sh --repo <target-repo>
```

3. The bundled installer is the source of truth. It installs skills globally when a skills source is available, links supported runtimes, and installs repo-local artifacts.
   - When running from an installed `aw-init` skill without a local `augmented-workflow` clone, use `--remote`.
   - Use `--source-url` to pin a GitHub branch/tag archive or internal mirror.
4. Exact pinned bundled `AGENTS.md`/routing files refresh with backups. Customized or unverified `AGENTS.md` and `CLAUDE.md` require confirmation or explicit `--force`; non-interactive runs preserve them. Report preserved stale routes.
5. After install, summarize changed/preserved files, managed skill count, unresolved custom routing, and the printed backup path. Exactly 20 managed skills does not mean ambiguous preserved directories disappeared.
6. If rollback is authorized, use `--rollback-skills <printed-backup-path>` with the same target/skills directory. This restores the owned bundle and metadata only; restore separately backed-up changed repo routing/config as one compatible set. Never reset specs, PRDs, decisions, or unrelated user files.

## Rules

- Do not overwrite customized/unverified `AGENTS.md` or `CLAUDE.md` without user confirmation. Byte-identical verified bundled files may refresh with recoverable backups during the authorized upgrade.
- Keep `AGENTS.md` and `CLAUDE.md` at the repo root.
- Preserve existing docs indexes and workflow config unless explicitly forced. `--force` does not bypass content ownership or canonical-name collisions for `aw-spec` or `aw-ship`. Keep `brainstorm`/`create_spec` and `commit`/`commit_push_pr` providers independent; report ambiguous retired-name references instead of guessing a rewrite.
- If the repo already has feature specs, recommend `aw-refresh features`.
- If the repo has an external PRD to import, recommend `aw-prd` as the first workflow step.
- If the user wants to author a PRD from an idea or notes, recommend `aw-prd`.
