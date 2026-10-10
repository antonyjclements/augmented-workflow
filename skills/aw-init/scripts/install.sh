#!/usr/bin/env bash
set -euo pipefail

DEFAULT_REMOTE_SOURCE_URL="https://github.com/antonyjclements/augmented-workflow/archive/refs/heads/main.tar.gz"

usage() {
  cat <<'USAGE'
Install augmented-workflow globally and into a target repository.

Usage:
  install.sh [--repo PATH] [--skills-dir PATH] [--learnings-dir PATH] [--force] [--dry-run] [--rollback-skills BACKUP] [--skip-skills] [--skip-skill-links] [--skip-repo] [--with-gates] [--remote] [--source-url URL]

Defaults:
  --repo          current directory
  --skills-dir    ~/.agents/skills
  --learnings-dir ~/.agents/learnings
  --source-url    https://github.com/antonyjclements/augmented-workflow/archive/refs/heads/main.tar.gz
  skill links     ~/.claude/skills, ~/.codeium/skills, ~/.windsurf/skills

What it does:
  1. Installs skills globally when a skills source is available.
  2. Installs AGENTS.md and CLAUDE.md into the repo root.
  3. Symlinks Claude Code, Codeium, and Windsurf skill dirs to the global skills directory when safe.
  4. Creates repo-local docs/product/prds, docs/brainstorms, docs/features, docs/standards, docs/decisions, docs/learnings, docs/sessions, and docs/workflow config if missing.
  5. Writes .augmented-workflow-version.
  6. Creates global ~/.agents/learnings/index.yml if missing.
  7. Installs .claude/hooks/log-session.sh and merges a Stop hook into .claude/settings.json for automatic session logging (Claude Code only).
  8. With --with-gates, installs the deterministic .scripts/aw-gate.js helper (freshness gates, telemetry, org-knowledge sync) and gitignores its per-checkout state.
  9. Gitignores /.aw/workstreams/ for local progress records, with or without gates.
  10. Prints recommended next steps.

Customized repo files are preserved unless --force is passed. Exact known baseline
routing/helper files refresh with backups to keep them compatible with new skills.
User-owned or customized skills are preserved; an aw-spec or aw-ship name collision stops installation.
--force never bypasses skill ownership checks. Python 3 is required for skill migration.
--dry-run previews skill changes and preserved repo files without writing the installation.
--rollback-skills BACKUP restores only the verified skill transaction; restore separately
backed-up repo routing/config as the same compatible set. No repo files are changed.
Use --remote or --source-url when running from an installed aw-init skill without a local augmented-workflow clone.
USAGE
}

repo_dir="$(pwd)"
skills_dir="${AUGMENTED_WORKFLOW_SKILLS_DIR:-$HOME/.agents/skills}"
learnings_dir="${AUGMENTED_WORKFLOW_LEARNINGS_DIR:-$HOME/.agents/learnings}"
force=0
dry_run=0
rollback_skills=""
skip_skills=0
skip_skill_links=0
skip_repo=0
with_gates=0
refresh_existing_helper=0
gate_installed=0
use_remote=0
source_url="${AUGMENTED_WORKFLOW_SOURCE_URL:-}"
remote_tmp_dir=""

cleanup() {
  if [ -n "$remote_tmp_dir" ] && [ -d "$remote_tmp_dir" ]; then
    rm -rf "$remote_tmp_dir"
  fi
}
trap cleanup EXIT

while [ "$#" -gt 0 ]; do
  case "$1" in
    --repo)
      [ "$#" -ge 2 ] || { echo "Missing value for --repo" >&2; exit 2; }
      repo_dir="$2"
      shift 2
      ;;
    --skills-dir)
      [ "$#" -ge 2 ] || { echo "Missing value for --skills-dir" >&2; exit 2; }
      skills_dir="$2"
      shift 2
      ;;
    --learnings-dir)
      [ "$#" -ge 2 ] || { echo "Missing value for --learnings-dir" >&2; exit 2; }
      learnings_dir="$2"
      shift 2
      ;;
    --force)
      force=1
      shift
      ;;
    --dry-run)
      dry_run=1
      shift
      ;;
    --rollback-skills)
      [ "$#" -ge 2 ] || { echo "Missing value for --rollback-skills" >&2; exit 2; }
      rollback_skills="$2"
      shift 2
      ;;
    --skip-skills)
      skip_skills=1
      shift
      ;;
    --skip-skill-links)
      skip_skill_links=1
      shift
      ;;
    --skip-repo)
      skip_repo=1
      shift
      ;;
    --with-gates)
      with_gates=1
      shift
      ;;
    --remote)
      use_remote=1
      if [ -z "$source_url" ]; then
        source_url="$DEFAULT_REMOTE_SOURCE_URL"
      fi
      shift
      ;;
    --source-url)
      [ "$#" -ge 2 ] || { echo "Missing value for --source-url" >&2; exit 2; }
      source_url="$2"
      use_remote=1
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
skill_dir="$(cd "$script_dir/.." && pwd)"
artifact_dir="$skill_dir/artifacts"
source_dir="$(cd "$script_dir/../../.." && pwd)"

fetch_remote_source() {
  local url="$1"
  remote_tmp_dir="$(mktemp -d "${TMPDIR:-/tmp}/augmented-workflow-source.XXXXXX")"
  local archive="$remote_tmp_dir/source.tar.gz"
  local extract_dir="$remote_tmp_dir/extract"
  mkdir -p "$extract_dir"

  case "$url" in
    file://*)
      cp "${url#file://}" "$archive"
      ;;
    /*|.*)
      cp "$url" "$archive"
      ;;
    *)
      command -v curl >/dev/null 2>&1 || {
        echo "remote source requires curl for URL: $url" >&2
        exit 1
      }
      curl -fsSL "$url" -o "$archive"
      ;;
  esac

  tar -xzf "$archive" -C "$extract_dir"

  local candidate
  candidate="$(find "$extract_dir" -maxdepth 3 -type d -name skills -print -quit)"
  if [ -z "$candidate" ]; then
    echo "remote source did not contain a skills directory: $url" >&2
    exit 1
  fi

  source_dir="$(cd "$(dirname "$candidate")" && pwd)"
  skill_dir="$source_dir/skills/aw-init"
  artifact_dir="$skill_dir/artifacts"
  echo "remote source: $url -> $source_dir"
}

resolve_source() {
  if [ "$use_remote" -eq 1 ]; then
    fetch_remote_source "$source_url"
  fi

  local version_file="$source_dir/aw-version.txt"
  if [ ! -f "$version_file" ]; then
    echo "missing workflow version source: $version_file" >&2
    echo "Run from a current augmented-workflow source tree or use --remote/--source-url." >&2
    exit 1
  fi
  AUGMENTED_WORKFLOW_VERSION="$(sed -n '1p' "$version_file" | tr -d '[:space:]')"
  if [ -z "$AUGMENTED_WORKFLOW_VERSION" ]; then
    echo "empty workflow version source: $version_file" >&2
    exit 1
  fi

  if [ ! -d "$artifact_dir" ]; then
    echo "missing installer artifacts: $artifact_dir" >&2
    echo "Run from a local augmented-workflow clone or use --remote/--source-url." >&2
    exit 1
  fi
}

is_verified_repo_file() {
  local dest="$1"
  command -v python3 >/dev/null 2>&1 || return 1
  python3 - "$skill_dir/scripts/bundled-skill-fingerprints.json" "$repo_dir" "$dest" <<'PYTHON'
import hashlib, json, pathlib, sys
manifest, repo, dest = map(pathlib.Path, sys.argv[1:])
try:
    relative = str(dest.absolute().relative_to(repo.absolute()))
    data = json.loads(manifest.read_text())
    expected = [data.get('repo_files', {}).get(relative)] + data.get('repo_file_history', {}).get(relative, [])
    verified = dest.is_file() and not dest.is_symlink() and hashlib.sha256(dest.read_bytes()).hexdigest() in expected
except (OSError, ValueError):
    verified = False
sys.exit(0 if verified else 1)
PYTHON
}

backup_changed_file() {
  local src="$1"
  local dest="$2"
  if [ -f "$dest" ] && ! cmp -s "$src" "$dest"; then
    local backup
    backup="$(mktemp "$dest.bak-XXXXXX")"
    cp -p "$dest" "$backup"
    echo "Backup: $backup"
  fi
}

check_helper_compatibility() {
  # Consolidated skills require current spec/shipping stage and mode support.
  # Do not run an unverified helper to infer ownership or capability. Exact known
  # baseline and Phase 1 helpers refresh together with their routing artifacts.
  local dest="$repo_dir/.scripts/aw-gate.js"
  [ -e "$dest" ] || [ -L "$dest" ] || return 0
  if [ ! -L "$dest" ] && { cmp -s "$dest" "$artifact_dir/aw-gate.js" || is_verified_repo_file "$dest"; }; then
    refresh_existing_helper=1
    echo "helper compatibility: verified bundled helper will be refreshed with backup when changed"
  elif [ "$with_gates" -eq 1 ] && [ "$force" -eq 1 ] && [ ! -L "$dest" ]; then
    refresh_existing_helper=1
    echo "helper compatibility: explicit --with-gates --force replacement will be backed up"
  else
    echo "helper compatibility review required: $dest is customized or unverified; no install files changed." >&2
    echo "Reconcile it with the current bundled helper, or explicitly replace it using --with-gates --force. Preserve your custom code first." >&2
    exit 1
  fi
}

prompt_overwrite() {
  local dest="$1"

  if [ "$force" -eq 1 ] || [ ! -e "$dest" ] || is_verified_repo_file "$dest"; then
    return 0
  fi

  if [ ! -t 0 ]; then
    echo "preserve: $dest (use --force to overwrite)"
    return 1
  fi

  printf 'Overwrite existing %s? [y/N] ' "$dest" >&2
  local answer
  read -r answer
  case "$answer" in
    y|Y|yes|YES)
      return 0
      ;;
    *)
      echo "preserve: $dest"
      return 1
      ;;
  esac
}

copy_prompted() {
  local src="$1"
  local dest="$2"
  mkdir -p "$(dirname "$dest")"
  if prompt_overwrite "$dest"; then
    backup_changed_file "$src" "$dest"
    cp "$src" "$dest"
    echo "write: $dest"
  fi
}

copy_agents_prompted() {
  local src="$1"
  local dest="$2"
  local temp_file
  temp_file="$(mktemp "${TMPDIR:-/tmp}/augmented-workflow-agents.XXXXXX")"
  sed "s/AUGMENTED_WORKFLOW_VERSION=[^ ]*/AUGMENTED_WORKFLOW_VERSION=$AUGMENTED_WORKFLOW_VERSION/" "$src" > "$temp_file"
  copy_prompted "$temp_file" "$dest"
  rm -f "$temp_file"
}

install_agentic_workflows() {
  if ! command -v aw >/dev/null 2>&1; then
    if [ ! -t 0 ]; then
      echo "agentic workflows skip: aw-cli is not installed (run: pipx install git+https://github.com/antonyjclements/aw-cli.git)"
      return 0
    fi

    printf 'aw-cli is not installed. Install it with pipx now? [y/N] ' >&2
    local answer
    read -r answer
    case "$answer" in
      y|Y|yes|YES)
        if ! command -v pipx >/dev/null 2>&1; then
          echo "agentic workflows skip: pipx is required to install aw-cli" >&2
          return 0
        fi
        pipx install git+https://github.com/antonyjclements/aw-cli.git
        hash -r
        ;;
      *)
        echo "agentic workflows skip: aw-cli was not installed"
        return 0
        ;;
    esac
  fi

  # Use the source already resolved by this installer, including extracted pinned
  # archives. Upgrade handles repo migration without invoking this installer again.
  # Never fall back to legacy init: it can overwrite customized repo files.
  # Legacy aw-cli accepts upgrade/source/repo but lacks the safe preview flag.
  # Probe the full plan first; never invoke its mutating upgrade on probe failure.
  if ! aw upgrade --source "$source_dir" --repo "$repo_dir" --dry-run; then
    echo "agentic workflows failed: requires aw-cli with same-source upgrade support and --dry-run (aw upgrade --source PATH --repo PATH --dry-run), plus Ruby for config migration." >&2
    echo "No legacy aw init fallback was attempted. Earlier installer steps may already have changed files; review them before retrying with a compatible CLI." >&2
    return 1
  fi
  if ! aw upgrade --source "$source_dir" --repo "$repo_dir"; then
    echo "agentic workflows upgrade failed; no legacy init fallback was attempted. Review the output before retrying." >&2
    return 1
  fi
  echo "agentic workflows: upgraded $repo_dir from $source_dir"
}

write_file_if_missing() {
  local dest="$1"
  local content="$2"
  mkdir -p "$(dirname "$dest")"
  if [ -e "$dest" ] && [ "$force" -ne 1 ]; then
    echo "preserve: $dest"
    return 0
  fi
  printf '%s\n' "$content" > "$dest"
  echo "write: $dest"
}

ensure_standard_index_entry() {
  local index_file="$repo_dir/docs/standards/index.yml"
  local standard_path="$1"
  local title="$2"
  shift 2

  mkdir -p "$(dirname "$index_file")"
  if [ ! -f "$index_file" ]; then
    printf 'standards: []\n' > "$index_file"
    echo "write: $index_file"
  fi

  if grep -Fq "path: $standard_path" "$index_file"; then
    echo "preserve: $index_file ($standard_path already indexed)"
    return 0
  fi

  if grep -Fxq "standards: []" "$index_file"; then
    local temp_file
    temp_file="$(mktemp "${TMPDIR:-/tmp}/augmented-workflow-standards-index.XXXXXX")"
    sed 's/^standards: \[\]$/standards:/' "$index_file" > "$temp_file"
    mv "$temp_file" "$index_file"
  fi

  # Appending is only valid when the file is a block sequence under a top-level
  # `standards:` key and that list runs to the end of the file. A flow sequence
  # or another top-level key after the list would turn into invalid YAML, and
  # this index is what routes every agent to the applicable standards — so an
  # unrecognized shape is left alone and reported rather than appended to.
  local last_line
  last_line="$(grep -v '^[[:space:]]*$' "$index_file" | tail -n 1)"
  if ! grep -q '^standards:[[:space:]]*$' "$index_file" ||
    ! printf '%s\n' "$last_line" | grep -q '^\([[:space:]]\|standards:[[:space:]]*$\)'; then
    echo "skip: $index_file (unrecognized shape — add $standard_path manually)"
    return 0
  fi

  # Without this a file that does not end in a newline splices the first
  # appended line onto the last existing one.
  if [ -s "$index_file" ] && [ -n "$(tail -c 1 "$index_file")" ]; then
    printf '\n' >> "$index_file"
  fi

  {
    printf '  - path: %s\n' "$standard_path"
    printf '    title: %s\n' "$title"
    printf '    tags:\n'
    for tag in "$@"; do
      printf '      - %s\n' "$tag"
    done
  } >> "$index_file"
  echo "index: $standard_path -> $index_file"
}

install_skills() {
  command -v python3 >/dev/null 2>&1 || {
    echo "Skill migration requires python3; no skills were changed." >&2
    exit 1
  }
  local args=(--source "$source_dir/skills" --target "$skills_dir" --version "$AUGMENTED_WORKFLOW_VERSION")
  if [ "$dry_run" -eq 1 ] || [ "${1:-}" = "--dry-run" ]; then
    args+=(--dry-run)
  else
    args+=(--apply)
  fi
  [ -z "$rollback_skills" ] || args+=(--rollback "$rollback_skills")
  python3 "$skill_dir/scripts/migrate-skills.py" "${args[@]}"
}

report_preserved_routing() {
  local file
  local current_artifact
  for file in "$repo_dir/AGENTS.md" "$repo_dir/CLAUDE.md" "$repo_dir/docs/workflow/config.yml" \
    "$repo_dir/docs/workflow/README.md" "$repo_dir/docs/workflow/field-guide.md" \
    "$repo_dir/docs/workflow/tracking.md" "$repo_dir/docs/standards/e2e-coverage.md"; do
    [ -f "$file" ] || continue
    case "${file#"$repo_dir/"}" in
      AGENTS.md) current_artifact="$artifact_dir/AGENTS.md" ;;
      CLAUDE.md) current_artifact="$artifact_dir/CLAUDE.md" ;;
      docs/workflow/config.yml) current_artifact="$artifact_dir/config.yml" ;;
      docs/workflow/README.md) current_artifact="$artifact_dir/workflow-readme.md" ;;
      docs/workflow/field-guide.md) current_artifact="$artifact_dir/field-guide.md" ;;
      docs/workflow/tracking.md) current_artifact="$artifact_dir/tracking.md" ;;
      docs/standards/e2e-coverage.md) current_artifact="$artifact_dir/e2e-coverage.md" ;;
    esac
    cmp -s "$file" "$current_artifact" && continue
    if grep -Eq 'aw-(brainstorm|create-spec|commit(-push-pr)?)([^[:alnum:]-]|$)' "$file"; then
      if is_verified_repo_file "$file"; then
        echo "routing refresh: verified baseline $file will be refreshed with a backup when changed"
        continue
      fi
      echo "routing review required: $file references retired bundled names."
      echo "Preserve custom providers; use aw-spec or aw-ship only for verified bundled references. Stage keys brainstorm/create_spec and commit/commit_push_pr remain independent."
      grep -nE 'aw-(brainstorm|create-spec|commit(-push-pr)?)([^[:alnum:]-]|$)' "$file"
    fi
  done
}

link_skill_dir() {
  local link_path="$1"
  mkdir -p "$(dirname "$link_path")"

  if [ -L "$link_path" ]; then
    local current_target
    current_target="$(readlink "$link_path")"
    if [ "$current_target" = "$skills_dir" ]; then
      echo "skill-link preserve: $link_path -> $skills_dir"
      return 0
    fi
    if [ "$force" -eq 1 ]; then
      rm "$link_path"
      ln -s "$skills_dir" "$link_path"
      echo "skill-link: $link_path -> $skills_dir"
      return 0
    fi
    echo "skill-link preserve: $link_path -> $current_target"
    return 0
  fi

  if [ -e "$link_path" ]; then
    echo "skill-link preserve existing non-symlink: $link_path"
    return 0
  fi

  ln -s "$skills_dir" "$link_path"
  echo "skill-link: $link_path -> $skills_dir"
}

install_skill_links() {
  mkdir -p "$skills_dir"
  link_skill_dir "$HOME/.claude/skills"
  link_skill_dir "$HOME/.codeium/skills"
  link_skill_dir "$HOME/.windsurf/skills"
}

check_workstream_collisions() {
  # Ignore rules cannot untrack existing data. Check before any install writes,
  # including --force, so migration remains an explicit human decision.
  if git -C "$repo_dir" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    local tracked
    tracked="$(git -C "$repo_dir" ls-files -- .aw/workstreams/)"
    if [ -n "$tracked" ]; then
      echo "tracked workstream collision in $repo_dir/.aw/workstreams/:" >&2
      printf '%s\n' "$tracked" >&2
      echo "Stop for an explicit migration decision; no files were untracked or overwritten." >&2
      exit 1
    fi
  fi
}

install_workstream_ignore() {
  local gitignore="$repo_dir/.gitignore"
  local entry='/.aw/workstreams/'
  if [ ! -f "$gitignore" ] || ! grep -Fqx "$entry" "$gitignore"; then
    # Preserve a final entry even when the existing file lacks a newline.
    if [ -s "$gitignore" ] && [ -n "$(tail -c 1 "$gitignore")" ]; then
      printf '\n' >> "$gitignore"
    fi
    printf '%s\n' "$entry" >> "$gitignore"
    echo "gitignore: $entry"
  fi
}

install_repo_files() {
  mkdir -p "$repo_dir"
  install_workstream_ignore

  copy_agents_prompted "$artifact_dir/AGENTS.md" "$repo_dir/AGENTS.md"
  copy_prompted "$artifact_dir/CLAUDE.md" "$repo_dir/CLAUDE.md"

  write_file_if_missing "$repo_dir/.augmented-workflow-version" "$AUGMENTED_WORKFLOW_VERSION"
  write_file_if_missing "$repo_dir/docs/product/prds/index.yml" "prds: []"
  copy_prompted "$artifact_dir/prd-template.md" "$repo_dir/docs/product/prds/template.md"
  write_file_if_missing "$repo_dir/docs/features/index.yml" "features: []"
  # Every bundled standard is indexed through the same idempotent helper, so a
  # repo installed before a standard existed gains its entry on upgrade. A
  # hand-written index keeps its own entries; the helper only adds what is
  # missing.
  write_file_if_missing "$repo_dir/docs/standards/index.yml" "standards: []"
  copy_prompted "$artifact_dir/coding-approach.md" "$repo_dir/docs/standards/coding-approach.md"
  ensure_standard_index_entry "docs/standards/coding-approach.md" "Coding Approach" implementation simplicity code-quality
  copy_prompted "$artifact_dir/traceability.md" "$repo_dir/docs/standards/traceability.md"
  ensure_standard_index_entry "docs/standards/traceability.md" "Spec Traceability" specs tests workflow
  copy_prompted "$artifact_dir/behavior-pinning.md" "$repo_dir/docs/standards/behavior-pinning.md"
  ensure_standard_index_entry "docs/standards/behavior-pinning.md" "Behavior Pinning" testing workflow characterization
  copy_prompted "$artifact_dir/e2e-coverage.md" "$repo_dir/docs/standards/e2e-coverage.md"
  ensure_standard_index_entry "docs/standards/e2e-coverage.md" "End-to-End Coverage" testing specs workflow
  write_file_if_missing "$repo_dir/docs/decisions/index.yml" "decisions: []"
  write_file_if_missing "$repo_dir/docs/learnings/index.yml" "learnings: []"
  # docs/solutions/ is index-free and self-describing (same as brainstorms and
  # sessions), so the README is the only thing to install. Without it, the
  # directory aw-capture solution writes to and aw-refresh solutions maintains
  # did not exist in installed repos.
  copy_prompted "$artifact_dir/solutions-readme.md" "$repo_dir/docs/solutions/README.md"
  copy_prompted "$artifact_dir/workflow-readme.md" "$repo_dir/docs/workflow/README.md"
  copy_prompted "$artifact_dir/field-guide.md" "$repo_dir/docs/workflow/field-guide.md"
  copy_prompted "$artifact_dir/gates.md" "$repo_dir/docs/workflow/gates.md"
  copy_prompted "$artifact_dir/org-knowledge.md" "$repo_dir/docs/workflow/org-knowledge.md"
  copy_prompted "$artifact_dir/tracking.md" "$repo_dir/docs/workflow/tracking.md"
  copy_prompted "$artifact_dir/metrics-readme.md" "$repo_dir/docs/metrics/README.md"
  copy_prompted "$artifact_dir/config.yml" "$repo_dir/docs/workflow/config.yml"
}

install_gate_script() {
  local dest="$repo_dir/.scripts/aw-gate.js"
  local src="$artifact_dir/aw-gate.js"
  if [ ! -f "$src" ]; then
    echo "gates skip: aw-gate.js not found at $src"
    return 0
  fi
  mkdir -p "$repo_dir/.scripts"
  if prompt_overwrite "$dest"; then
    backup_changed_file "$src" "$dest"
    cp "$src" "$dest"
    chmod +x "$dest"
    echo "write: $dest"
  fi

  # The freshness state file and org cache are per-checkout, never committed.
  local gitignore="$repo_dir/.gitignore"
  for entry in ".aw-gate-state.json" ".aw/receipts/" ".aw-org-cache/" ".aw/tmp/" ".aw/workflow-trace.jsonl" ".aw/pin/" ".aw/session"; do
    if [ ! -f "$gitignore" ] || ! grep -Fqx "$entry" "$gitignore"; then
      printf '%s\n' "$entry" >> "$gitignore"
      echo "gitignore: $entry"
    fi
  done

  # Telemetry and tracking logs are append-only and git-tracked; the union merge
  # driver keeps both sides' lines instead of conflicting when branches merge.
  local gitattributes="$repo_dir/.gitattributes"
  for attr_line in "docs/metrics/events*.jsonl merge=union" "docs/metrics/skills*.jsonl merge=union"; do
    if [ ! -f "$gitattributes" ] || ! grep -Fqx "$attr_line" "$gitattributes"; then
      printf '%s\n' "$attr_line" >> "$gitattributes"
      echo "gitattributes: $attr_line"
    fi
  done
}

install_global_learnings() {
  write_file_if_missing "$learnings_dir/index.yml" "learnings: []"
}

install_claude_hooks() {
  if ! command -v python3 >/dev/null 2>&1; then
    echo "hooks skip: python3 not available for .claude/settings.json merge"
    return 0
  fi

  local hook_src="$source_dir/skills/aw-init/hooks/log-session.sh"
  if [ ! -f "$hook_src" ]; then
    echo "hooks skip: log-session.sh not found at $hook_src"
    return 0
  fi

  local hook_dest="$repo_dir/.claude/hooks/log-session.sh"
  mkdir -p "$(dirname "$hook_dest")"
  if prompt_overwrite "$hook_dest"; then
    cp "$hook_src" "$hook_dest"
    chmod +x "$hook_dest"
    echo "write: $hook_dest"
  fi

  local settings_file="$repo_dir/.claude/settings.json"
  mkdir -p "$(dirname "$settings_file")"

  local result
  result=$(python3 - "$settings_file" '$CLAUDE_PROJECT_DIR/.claude/hooks/log-session.sh' <<'PYEOF'
import json, sys

settings_path = sys.argv[1]
hook_cmd = sys.argv[2]

try:
    with open(settings_path) as f:
        settings = json.load(f)
except Exception:
    settings = {}

hooks = settings.setdefault("hooks", {})
stop_hooks = hooks.setdefault("Stop", [])

already_present = any(
    any(h.get("command") == hook_cmd for h in entry.get("hooks", []))
    for entry in stop_hooks
)

if not already_present:
    stop_hooks.append({"hooks": [{"type": "command", "command": hook_cmd}]})
    with open(settings_path, "w") as f:
        json.dump(settings, f, indent=2)
        f.write("\n")
    print("merged")
else:
    print("already-present")
PYEOF
  )

  case "$result" in
    merged)          echo "write: $settings_file (Stop hook added)" ;;
    already-present) echo "preserve: $settings_file (Stop hook already present)" ;;
    *)               echo "hooks warning: unexpected result merging $settings_file: $result" ;;
  esac
}

if [ -n "$rollback_skills" ]; then
  # Rollback needs its installed helper and journal, not a source checkout or
  # network fetch. The transaction supplies its previous version/identity.
  AUGMENTED_WORKFLOW_VERSION="rollback"
  install_skills
  exit 0
fi

resolve_source

report_preserved_routing

if [ "$skip_repo" -ne 1 ]; then
  check_workstream_collisions
fi

if [ "$skip_skills" -ne 1 ]; then
  if [ "$skip_repo" -ne 1 ]; then
    check_helper_compatibility
  fi
  if [ "$refresh_existing_helper" -eq 1 ] && [ "$dry_run" -ne 1 ]; then
    # Refuse skill collisions before touching the helper. Refresh the compatible
    # helper first so an interrupted skill update cannot leave v2 with v1.
    install_skills --dry-run
    install_gate_script
    gate_installed=1
  fi
  install_skills
  if [ "$skip_skill_links" -ne 1 ] && [ "$dry_run" -ne 1 ]; then
    install_skill_links
  fi
fi

if [ "$dry_run" -eq 1 ]; then
  echo "Repository preview: $repo_dir (customized files preserved unless --force; verified baseline routing/helper refresh with .bak-* backups)."
  echo "Skill links and global learnings were not changed. Re-run without --dry-run to apply."
  exit 0
fi

if [ "$skip_repo" -ne 1 ]; then
  install_repo_files
  install_claude_hooks
  install_agentic_workflows
  if [ "$with_gates" -eq 1 ] && [ "$gate_installed" -ne 1 ]; then
    install_gate_script
  fi
fi

install_global_learnings

cat <<EOF

Installed augmented-workflow.

Global skills: $skills_dir
Global learnings: $learnings_dir
Target repo:   $repo_dir

Next steps:
1. Read docs/workflow/field-guide.md — step-by-step guide on which skills to run for bug fixes, new features, refactors, and more, by team size.
2. Not sure which skill fits your situation? Use aw-help for an interactive recommendation.
3. Review AGENTS.md and CLAUDE.md for workflow routing details.
4. Configure docs/workflow/config.yml for workflow step overrides, implementation test policy, design hooks, commit messages, PR templates, human reviewers, and CI monitoring.
   Set workflow.steps.monitor_pipeline.skill to enable post-PR CI monitoring for your provider (GitHub Actions, CircleCI, Jenkins, etc.).
5. If this is an existing install with an older docs/workflow/config.yml, run:
   skills/aw-init/scripts/upgrade.sh --repo $repo_dir --dry-run
6. Keep README.md updated when setup, commands, configuration, architecture, or workflow behavior changes.
7. Session logging is automatic for Claude Code: .claude/hooks/log-session.sh fires when each session ends.
   Run aw-synthesize-memory periodically to distill session logs into learnings and refresh docs/context/wiki.md.
   Other agents (Codex, Codeium, Windsurf) can invoke aw-capture session manually; the session log format is cross-agent.
8. Optional enforcement, telemetry, org knowledge, traceability, workflow trace, and behavior pins (see docs/workflow/README.md):
   Re-run install with --with-gates to add .scripts/aw-gate.js. Set gates.enabled/telemetry.enabled/org_knowledge.source/trace.enabled/workflow_trace.enabled/pin.enabled
   in docs/workflow/config.yml, then wire \`node .scripts/aw-gate.js check\` and optionally \`trace\` / \`pin\` into a pre-push hook or CI job.
9. A compatible aw-cli upgrades the target repo from this same prepared source when available.
   To add it later, install aw-cli with pipx and rerun this reviewed installer with the same source options.
   Config migration requires Ruby; old aw-cli versions fail without falling back to legacy init.
EOF
