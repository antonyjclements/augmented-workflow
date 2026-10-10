# Tracking

Records public skill invocations and separately identified internal stage executions to a git-tracked JSONL log so cross-repo analysis can answer:

1. Where does the workflow break down? (session-ordered skill sequences)
2. Is AW making things faster? (upstream duration; combine with GitHub PR data)
3. What parts of the workflow are used most? (public entry-point frequency and actual stage/provider use)

Follows the same pattern as `docs/metrics/events*.jsonl` — see [Shard telemetry with union-merge and retention](../decisions/2026-07-03-shard-telemetry-with-union-merge-and-retention.md). No network calls, no keys, no dev setup.

## Config

In `docs/workflow/config.yml`:

```yaml
tracking:
  enabled: false                       # per-repo kill switch
  path: docs/metrics/skills.jsonl      # base path; sharded when rotation is set
  rotation: monthly                    # or "none" for a single file
  retention_months: 12                 # aw-synthesize-memory prunes older shards
  session_file: .aw/session            # gitignored; groups events into a session
  session_ttl_hours: 8                 # mint a new session id when the file is older
```

Use narrow ignore rules: `.aw/session` for the tracking session ID and
`/.aw/workstreams/` for local progress records. Do not assume all of `.aw/` is
ignored. `aw-init --with-gates` adds the session rule and
`docs/metrics/skills*.jsonl merge=union` to `.gitattributes`; every repository
install adds the workstreams rule independently of gates. Skill invocation logs
are separate from execution progress; see `docs/workflow/README.md` for the local
workstream lifecycle.

## When a skill emits

Every AW skill referencing this doc emits at the start, before real work, except the no-repository-write description modes below. A routed skill first selects the requested route, then emits one public `invocation` event. Before each internal stage actually starts, emit a separate `stage` event naming its provider and actual stage. Do not emit a stage that was skipped, or a second public invocation for an internal provider call. Emitting on start captures aborted runs; neither kind of event proves successful completion.

For `aw-spec`, a direct route starts at `create_spec`; an exploratory route starts at `brainstorm` and may later execute `create_spec`. The later writer retains `mode: exploratory`: mode identifies the selected route, while `workflow_step` identifies the actual stage. Exploration-only and discovery that already returned a valid spec do not invent a subsequent writer event.

For `aw-ship`, `local-commit` starts at `commit`; `full-pr` starts at `commit_push_pr` and records `commit` separately only when that stage actually executes. Nested commit execution keeps `mode: full-pr` and the same invocation ID. Review, compliance, and pipeline skills retain their existing tracking and gate identities.

`description-only` and `description-update` skip tracking entirely, even when enabled: do not probe, mint/refresh a session, write metrics, or invoke a generic provider-start emitter. These modes authorize no repository writes; description-update authorizes only its separately approved PR-text change. The helper also drops those modes for every provider as a defensive no-write boundary. They are intentionally absent from skill-invocation counts, not evidence that description work never happened.

If `tracking.enabled` is false or the config file is missing, skip silently. Never block the workflow, never surface an error.

## Payload

One JSON object per line, ISO-8601 UTC timestamp. Explicit stage-aware events use schema version 2:

```json
{"ts":"2026-10-10T12:34:56.000Z","session_id":"9f3e...","skill":"aw-spec","source":"skill","schema_version":2,"event":"invocation","mode":"exploratory","invocation_id":"a7d2...","workflow_step":"brainstorm"}
{"ts":"2026-10-10T12:34:57.000Z","session_id":"9f3e...","skill":"custom-discovery","source":"skill","schema_version":2,"event":"stage","mode":"exploratory","invocation_id":"a7d2...","workflow_step":"brainstorm"}
{"ts":"2026-10-10T12:36:00.000Z","session_id":"9f3e...","skill":"custom-writer","source":"skill","schema_version":2,"event":"stage","mode":"exploratory","invocation_id":"a7d2...","workflow_step":"create_spec"}
```

Historical events and legacy single-name callers retain their original schema:

```json
{"ts": "2026-07-27T12:34:56.000Z", "session_id": "9f3e...", "skill": "aw-plan", "workflow_step": "plan", "source": "skill"}
```

| Field | Meaning |
| --- | --- |
| `ts` | ISO-8601 UTC timestamp when the invocation or stage starts |
| `session_id` | UUID grouping consecutive skill calls; read from `session_file` |
| `skill` | Public entrypoint for an invocation; the actual bundled or custom provider for a stage |
| `workflow_step` | Explicit actual stage in v2; legacy inferred step when available, omitted otherwise |
| `source` | Always `"skill"` — distinguishes from `aw-gate` writes to `events*.jsonl` |
| `schema_version` | `2` for explicit events; omitted on legacy events |
| `event` | `invocation` for a public entrypoint, `stage` for an internal execution; absent means legacy invocation |
| `mode` | `direct`, `exploratory`, `local-commit`, or `full-pr`, required for explicit events; description modes never emit |
| `invocation_id` | Caller-generated opaque token, required for explicit events and shared by the public invocation and its stages |

`repo_hash` is not stored in the file — the file *is* the repo. Aggregators tag rows with the repo at ingest time.

Generate a new invocation ID once per public call, keep it in memory, and pass it through internal handoffs. A UUID is suitable; accepted tokens match `[A-Za-z0-9][A-Za-z0-9._:-]{0,127}`. Never put task text, paths, or personal data in the token. Do not reuse an ID for a different public invocation, even in the same session. Unlike the coarse session ID, this token distinguishes parallel or repeated routes.

Count public usage from `event: invocation` plus legacy rows with no `event`; exclude `event: stage`. For v2 aggregation, distinct `(repo, invocation_id)` identifies a public invocation. Stage rows measure actual execution attempts separately. The append-only helper does not deduplicate calls or infer missing events. Keep legacy `workflow_step` values as recorded; do not relabel historical `aw-brainstorm` / `aw-create-spec` rows as `aw-spec`, or `aw-commit` / `aw-commit-push-pr` rows as `aw-ship`, infer a mode, or treat legacy first-match inference as evidence of which stage actually ran.

## Session id

`aw-gate.js track` manages the session file transparently (no hook required):

1. If `session_file` exists and its mtime is within `session_ttl_hours`, reuse the UUID from it.
2. Otherwise, mint a new UUID, write it to `session_file`, and use that.

Good-enough grouping without infrastructure. Not perfect for parallel sessions in the same repo — call that out in analysis, not in the writer.

## Emit command

Skills shell out to `aw-gate.js track` — the same deterministic helper that owns telemetry, receipts, and freshness gates. Always guard the call with a presence check so repos installed without `--with-gates` (no `.scripts/aw-gate.js`) stay silent instead of erroring on module-not-found:

```bash
[ -f .scripts/aw-gate.js ] && node .scripts/aw-gate.js track <skill> || true
```

Legacy single-stage callers can still pass only their own name. The helper retains the existing first configured matching `workflow.steps.<step>.skill` override, then its historical canonical map. Auxiliary and meta skills (`aw-help`, `aw-init`) map to no step and omit `workflow_step`. This fallback is for compatibility, not multi-stage routing: bare `track aw-spec` or `track aw-ship` writes nothing.

Examples:

```bash
[ -f .scripts/aw-gate.js ] && node .scripts/aw-gate.js track aw-plan || true
[ -f .scripts/aw-gate.js ] && node .scripts/aw-gate.js track aw-help || true
```

The explicit contract is:

```text
track <skill> --stage <step> --mode direct|exploratory|local-commit|full-pr --invocation-id <token> [--event invocation|stage]
```

`--event` defaults to `invocation`. Stage, mode, and invocation ID must be supplied together. Accepted stage values are the existing workflow step keys: `prd`, `brainstorm`, `create_spec`, `request_human_review`, `plan`, `review`, `create_tickets`, `work`, `check_workflow_compliance`, `commit`, `commit_push_pr`, and `monitor_pipeline`. Unknown keys are rejected even if present in configuration. `brainstorm` requires exploratory mode. For `aw-spec`, only direct/exploratory modes and `brainstorm`/`create_spec` stages are valid, so direct mode can only use `create_spec`. Shipping modes accept only `commit` and `commit_push_pr`, and `local-commit` accepts only `commit`, including custom providers. For `aw-ship`, only local-commit/full-pr modes are valid. The public full-pr route names `commit_push_pr`; its nested commit stage names `commit`.

For direct/exploratory tracking, probe the repository's helper once with `node .scripts/aw-gate.js tracking-schema`. It must exit 0 and print exactly `2` (apart from surrounding whitespace). The command is read-only: it does not read configuration, mint a session, create directories, or append logs, even when tracking is enabled. Pass the verified capability state through all internal handoffs.

For shipping tracking, the separate capability probe is `node .scripts/aw-gate.js shipping-tracking-schema`, also requiring exit 0 and trimmed stdout exactly `2`. This declares local-commit/full-pr support using the same schema-2 event envelope; it does not change the older `tracking-schema` response. Both probes are read-only. A Phase 1 helper already answers `2` to `tracking-schema` but cannot record shipping modes. It also ignores extra arguments to that probe, so `tracking-schema aw-ship` is NOT a valid shipping capability check. The dedicated command distinguishes that helper: it exits nonzero for an unknown command.

Global skill upgrades do not update every repository's helper. Old helpers reject `tracking-schema` as an unsupported command, but may silently ignore the new flags on `track`, turning internal stages into extra public invocations. Never send spec or shipping commands without verifying their respective capability, and never fall back to legacy tracking for either multi-stage route. If the helper exists but the probe fails, skip tracking, report once that the repo-local helper needs upgrading, and continue the requested workflow. If the helper is absent, stay silent as usual.

Capture both the probe result and its exit status; do not accept a failing command just because its output contains a version:

```bash
tracking_schema=""
if [ -f .scripts/aw-gate.js ]; then
  tracking_schema="$(node .scripts/aw-gate.js tracking-schema 2>/dev/null)" || tracking_schema=""
fi
```

For a direct invocation, generate the token once and emit the public event followed by the writer stage when it starts:

```bash
[ "$tracking_schema" = 2 ] && invocation_id="$(node -e 'process.stdout.write(require("crypto").randomUUID())')" || true
[ "$tracking_schema" = 2 ] && node .scripts/aw-gate.js track aw-spec --stage create_spec --mode direct --invocation-id "$invocation_id" || true
[ "$tracking_schema" = 2 ] && node .scripts/aw-gate.js track aw-spec --stage create_spec --mode direct --invocation-id "$invocation_id" --event stage || true
```

For an exploratory invocation with different configured providers, reuse one token:

```bash
[ "$tracking_schema" = 2 ] && invocation_id="$(node -e 'process.stdout.write(require("crypto").randomUUID())')" || true
[ "$tracking_schema" = 2 ] && node .scripts/aw-gate.js track aw-spec --stage brainstorm --mode exploratory --invocation-id "$invocation_id" || true
# Immediately before the discovery provider starts:
[ "$tracking_schema" = 2 ] && node .scripts/aw-gate.js track custom-discovery --stage brainstorm --mode exploratory --invocation-id "$invocation_id" --event stage || true
# Only if a separate writer actually starts after discovery:
[ "$tracking_schema" = 2 ] && node .scripts/aw-gate.js track custom-writer --stage create_spec --mode exploratory --invocation-id "$invocation_id" --event stage || true
```

For local-commit or full-pr shipping only, use the dedicated probe and generate one token per public invocation:

```bash
shipping_tracking_schema=""
if [ -f .scripts/aw-gate.js ]; then
  shipping_tracking_schema="$(node .scripts/aw-gate.js shipping-tracking-schema 2>/dev/null)" || shipping_tracking_schema=""
fi
[ "$shipping_tracking_schema" = 2 ] && invocation_id="$(node -e 'process.stdout.write(require("crypto").randomUUID())')" || true
# Local-commit route:
[ "$shipping_tracking_schema" = 2 ] && node .scripts/aw-gate.js track aw-ship --stage commit --mode local-commit --invocation-id "$invocation_id" || true
[ "$shipping_tracking_schema" = 2 ] && node .scripts/aw-gate.js track custom-commit --stage commit --mode local-commit --invocation-id "$invocation_id" --event stage || true
```

For a separate full-pr invocation, generate its own token once; emit the public event, then each stage only immediately before it actually starts:

```bash
[ "$shipping_tracking_schema" = 2 ] && invocation_id="$(node -e 'process.stdout.write(require("crypto").randomUUID())')" || true
[ "$shipping_tracking_schema" = 2 ] && node .scripts/aw-gate.js track aw-ship --stage commit_push_pr --mode full-pr --invocation-id "$invocation_id" || true
[ "$shipping_tracking_schema" = 2 ] && node .scripts/aw-gate.js track custom-pr --stage commit_push_pr --mode full-pr --invocation-id "$invocation_id" --event stage || true
# Only if a commit stage actually executes inside this full-pr workflow:
[ "$shipping_tracking_schema" = 2 ] && node .scripts/aw-gate.js track custom-commit --stage commit --mode full-pr --invocation-id "$invocation_id" --event stage || true
```

These provider names are examples; use the independently resolved `workflow.steps.commit.skill` and `workflow.steps.commit_push_pr.skill` providers. Blank or validated bundled self-overrides select the corresponding internal procedure. Never recursively invoke the public `aw-ship` router for its nested commit stage. Skip both blocks entirely for description modes. Pass the verified shipping capability, mode, actual stage, invocation ID, and emission owner through custom-provider handoffs. A provider must suppress its generic public-start call; one owner emits its stage. If it cannot honor that contract, report the limitation rather than claim correct stage counts.

These commands only log starts; they do not resolve or invoke providers. The router resolves each configured stage independently and passes the stage, mode, invocation ID, and tracking ownership to its provider. Exactly one owner emits each stage event. Internal providers suppress their generic public-start tracking for that handoff. If a provider cannot honor the stage contract, report the limitation rather than silently bypassing it or claiming correct attribution.

A validated bundled `aw-spec` self-override selects the matching internal procedure, never recursively invokes the public router. Custom providers remain independent even if configured names match; unavailable providers are reported, not silently replaced. A valid returned spec skips duplicate writing, but does not by itself prove any applicable review hook ran. These are routing contracts owned by the skill, not behavior implemented by `track`.

Two independent layers guarantee fire-and-forget:

- The presence check keeps the command a no-op when the helper isn't installed (repos without `--with-gates`).
- Inside `aw-gate.js`, the whole `cmdTrack` body is wrapped in `try/catch` and returns silently when `tracking.enabled` is false, the config file is missing, metadata is invalid/partial, or any internal error occurs. Invalid or disabled calls create no log, directory, or session file and do not refresh an existing session.

Stage-aware skills verify helper capability and supply explicit metadata; they need no extra enabled check. Malformed values, unknown or duplicate flags, and extra positional arguments are dropped, never downgraded to inferred legacy events.

Tracking never stamps gates, writes or consumes receipts, or changes gate event identities. `review`, `check_workflow_compliance`, `capture`, and `synthesize` retain their existing proof-of-work requirements in `aw-gate.js receipt` and `record`. Invocation counts are not review or workflow-compliance evidence.

Single-line JSONL appends are atomic on POSIX up to `PIPE_BUF` (~4KB), which the payload sits well under. Concurrent skill calls in the same repo won't tear each other's lines; `merge=union` handles concurrent branches.

## Cross-repo aggregation

Deferred until it matters. When enough repos have tracking on, a batch script clones or pulls the AW-adopted repos and reads their `docs/metrics/skills*.jsonl` shards. Nothing needs to change in AW itself when that day comes.

## Rollout

Skills opt in by adding, near the top of their `SKILL.md`:

> Emit a tracking event per `docs/workflow/tracking.md` at the start of this skill.

Instrument all AW skills — the emitter is silent when disabled. For the multi-stage `aw-spec` and `aw-ship` entrypoints, use their verified explicit contracts above instead of the legacy single-name command. Shipping description modes remain uninstrumented to preserve their no-repository-write contract. Readers must understand invocation versus stage events before comparing old and new entrypoint frequencies. No tracking configuration migration or historical log rewrite is needed.
