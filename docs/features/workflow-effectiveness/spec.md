---
title: Workflow Effectiveness Measurement
status: draft
created: 2026-08-12
updated: 2026-08-12
tags:
  - metrics
  - telemetry
  - evaluation
  - governance
related_decisions:
  - docs/decisions/2026-07-03-add-enforcement-gates-telemetry-org-knowledge.md
  - docs/decisions/2026-07-03-shard-telemetry-with-union-merge-and-retention.md
  - docs/decisions/2026-07-27-add-opt-in-skill-tracking.md
---

# Workflow Effectiveness Measurement

## Intent

Augmented Workflow should be able to demonstrate, from evidence already in version control, whether it does the thing it claims: compound knowledge so that month six is better than month one, without costing more ceremony than it returns.

The measurement exists to answer three questions in a deliberate order — **improve** AW (where does it break down or over-ceremony), **prove** AW (does adopting it change delivery outcomes), and **operate** AW (is a given repo's workflow healthy) — using one instrumentation layer sized for the union of the three.

The distinctive claim under test is that the repo is the memory boundary. Adoption counts and artifact volume do not test that claim; recurrence of corrections does.

## Users

- **Workflow maintainers** improving AW itself — need funnel drop-off, triage calibration, and override friction.
- **Adopting teams** operating AW in their repo — need staleness, version currency, and knowledge-loop health.
- **Engineering leadership** deciding on rollout — need a defensible outcome comparison and a single legible headline.

## Current Behavior

Two emission layers already exist and are fully implemented, disabled by default but **enabled and producing data in consuming repos**:

- **Skill tracking** (`docs/workflow/tracking.md`) appends `{ts, session_id, skill, workflow_step, source}` to `docs/metrics/skills-YYYY-MM.jsonl` at the start of every skill, via `node .scripts/aw-gate.js track <skill>`. Fire-and-forget, no network, no keys.
- **Gate telemetry** (`docs/metrics/README.md`) appends `{ts, event, detail, source}` to `docs/metrics/events-YYYY-MM.jsonl` on `record <gate>`.

Adoption is uneven across the two layers. This self-hosting repo had no data at all until measurement was enabled here. A consuming repo (`screenbalance-ios`, AW 0.11.0) has telemetry on and has accumulated **59 gate events across two monthly shards and four active days**, while its skill tracking produces nothing yet — enabling `tracking` only takes effect once the installed skills carry the `track` emit, so a repo that flips the flag before upgrading its global skills collects gate events but no funnel data.

Gates and receipts also stamp `.aw-gate-state.json`, but that is git-ignored point-in-time state, not a time series. The event log is the only durable record.

The substrate therefore exists and works. What is missing is the definition of success, the analysis layer, and the enabling fields below.

### What the first real dataset already shows

The 59-event sample is small and single-repo, but it disproves two assumptions worth recording before the analysis layer is built:

**`detail` is uncontrolled free text and cannot be aggregated.** Across 26 `review` events the field carries at least ten distinct spellings of the same activity — `code`, `code review`, `code-review`, `pre-pr-code-review`, `code-review-current-head`, `local pre-pr review`, `aw-review code current diff`, and target-specific strings like `debug-modal-pairing-qr`. The schema calls it an "optional short qualifier"; nothing constrains it, and agents write whatever describes the moment. Any grouping by `detail` today produces noise, so either the field gains a controlled vocabulary or the analysis layer must treat it as human-readable annotation only.

**Gate stamping without a corresponding skill run happens, and is currently visible only by accident.** Four events on the same day carry the detail `artificial stamp after initial push` — one per configured gate. That is an honest self-report of exactly the behaviour proof-of-work receipts exist to prevent, and it survived into the record only because someone typed it into a free-text field. It is direct evidence for the structured bypass events specified below, rather than a hypothesis about them.

**The compounding stage is the least-exercised part of the loop.** In the same sample `capture` fired 19 times and `synthesize` once — and that single event is one of the artificial stamps. That repo has six session logs, all `status: unprocessed`, and no `docs/context/wiki.md`. Knowledge is being captured and never synthesized, which matters directly for the north star: repeat-correction rate is computed over corroborated learnings, and learnings are only corroborated by synthesis runs. **The north star has no input in a repo where synthesis does not run.**

## Key Flows

### Measurement tiers

Metrics are organised in four tiers. Tiers 1–3 are diagnostics; tier 4 carries the success claim.

**Tier 1 — Adoption** *(necessary, not sufficient)*
Installed repos; **version currency** (share on the latest `aw-version.txt` — an un-upgraded install is an inert one); **skill breadth** per repo per month; workflow entry-point distribution. A repo that only ever calls `aw-commit` has installed AW without running it.

**Tier 2 — Workflow integrity**
Funnel drop-off across `brainstorm → create_spec → plan → work → review → check_workflow_compliance → commit_push_pr`; **triage calibration** (full-path PRs under ~20 changed lines indicate over-ceremony; PRs touching high-risk paths that took the trivial path indicate under-ceremony); **override rate** for `--no-receipt`, `Spec-Override:`, and `Pin-Override:`.

Override rate is the highest-signal friction metric: people routing around a control is the cleanest evidence it is mis-tuned. It is currently not recorded anywhere.

**Tier 3 — Outcome quality**
Per-PR review rounds, CI first-pass rate, time-to-merge, and revert-or-hotfix rate within a fixed window after merge. Sourced from git and GitHub, joined to workflow sessions by branch.

**Tier 4 — Compounding** *(the claim)*
**Repeat-correction rate** (north star), **correction capture rate** (its paired guardrail), learning corroboration outcomes (`tentative → active` promotions vs. uncorroborated expiries), and knowledge rot (learnings past `review_by`, wiki age, unprocessed session backlog).

### North star and guardrail

The headline metric is **repeat-correction rate**: how often the same class of correction recurs across sessions in a repo, normalised per session. A declining rate means the memory loop is changing agent behaviour rather than only producing documentation. It is not inflatable by running more workflow, which disqualifies every tier-1 and most tier-2 metrics from the role.

It has one serious hazard: **a falling repeat-correction rate is indistinguishable from people quietly giving up on logging corrections.** Under-capture and genuine improvement produce the same number.

Therefore repeat-correction rate is never published alone. **Correction capture rate** — corrections logged per session — is published directly beside it, always, in the same view. A falling numerator against steady capture is compounding; both falling together is abandonment.

### Justifying the claim

Two complementary analyses, treated as mechanism and effect rather than as alternatives:

- **Compounding curve** (mechanism): tier-4 metrics trended over time within a repo. Forward-only — it cannot be reconstructed from sessions that were never logged.
- **Adoption dose-response** (effect): outcome quality regressed against adoption intensity within a repo, using skill breadth and version currency as a continuous dose rather than a binary before/after. Adoption is gradual — repos install, then partially use, then fully use AW — so an interrupted time series with a sharp discontinuity would misstate the intervention. Retroactively computable from git and GitHub history.

Agreement between the two yields a causal story neither supports alone. Disagreement is itself a finding: compounding that improves without moving rework indicates the memory loop works but is not where the cost sits.

The two analyses share no pipeline and may be built independently, in either order.

### Ingest

The emitter stays dumb, local, and network-free. The **outcome join happens in CI at merge time**, where pull-request context is already available, rather than by teaching the local emitter about pull requests. This preserves the property that makes AW enterprise-safe — no network calls and no credentials on developer machines — and reduces the local schema change to a single field.

### Attribution

Because `docs/metrics/skills*.jsonl` is git-tracked, each append carries a commit author, so `git blame` over a metrics shard yields per-engineer workflow behaviour. This falls out of the "the file is the repo" design rather than being chosen.

The accepted posture is to **design for this openly rather than mitigate it**: per-engineer visibility is acceptable in the adopting context, and the spec states the exposure plainly instead of implying a privacy property the format does not provide. Adopting organisations in jurisdictions with codetermination or works-council requirements must make their own determination before enabling tracking; AW documents the exposure and does not claim anonymity.

### Sequencing

1. **Phase 1 — start the clock.** Enable `tracking` and `telemetry` in this repo, add the three enabling fields, and live with the data for at least one month before designing anything further. Scoped to what can be turned on now and read in a month.
2. **Phase 2 — outcome join.** CI-side join of branch sessions to PR outcomes; dose-response analysis run as a batch job against existing history.
3. **Phase 3 — org-wide.** Cross-repo aggregation and per-repo reporting, designed against what phase 1 and 2 data actually showed.

Phase 1 is the only phase with a deadline, because it is the only one whose data cannot be recovered later.

## Acceptance Criteria

- `tracking.enabled` and `telemetry.enabled` are `true` in this repository's `docs/workflow/config.yml`, and `docs/metrics/skills-YYYY-MM.jsonl` accumulates one line per skill invocation.
- The skill-tracking payload carries a `branch` field alongside `ts`, `session_id`, `skill`, `workflow_step`, and `source`, so workflow sessions can be joined to pull-request outcomes without the emitter knowing about pull requests.
- Each tracked skill records a terminal outcome for its session step, so an abandoned step is distinguishable from a completed one; step duration is derivable within a session.
- Gate bypasses are recorded as metric events: `--no-receipt`, `Spec-Override:` commit trailers, and `Pin-Override:` commit trailers each emit an event carrying the gate or check bypassed. Field data shows stamps applied without a corresponding skill run, currently detectable only through free-text `detail`, so this signal cannot depend on an agent choosing to describe it.
- The `detail` field is either constrained to a controlled vocabulary per event type, or documented as human-readable annotation that no aggregation may group by. Observed usage carries at least ten spellings of a single activity, so the current schema cannot support grouping.
- Reporting states synthesis cadence alongside the north star. Repeat-correction rate is computed over corroborated learnings, corroboration happens only during synthesis, and a repo whose sessions stay unprocessed produces a repeat-correction rate with no input rather than a rate of zero.
- Enabling `tracking` in config is distinguishable from tracking actually emitting. The emit lives in installed skill bodies, so a repo can hold `tracking.enabled: true` while its installed skills predate the emit and silently produce nothing.
- Repeat-correction rate and correction capture rate are defined with explicit numerators, denominators, and a stated method for judging two corrections equivalent; neither is reported in any view that omits the other.
- Reporting states, for every metric, whether it is inflatable by running more workflow, and no metric so marked is used as a success measure.
- The measurement layer adds no network call and no credential requirement to a developer machine; any outbound transmission happens in CI.
- Enabling measurement never blocks or slows a workflow step: a failing emitter is silent, as with the existing `track` contract.
- Installed documentation states the `git blame` attribution exposure plainly wherever tracking is described, and does not claim anonymity or aggregation that the format does not enforce.
- Adoption dose-response is computable from git and GitHub history without requiring data captured before adoption.

## Boundaries and Non-Goals

- **Not individual performance management.** The metrics describe a workflow, not an engineer's productivity. AW takes no position on how an adopting organisation uses the data, and provides no mechanism preventing misuse.
- **No cross-team or cross-repo ranking as an effectiveness claim.** Teams that adopt a process framework are already teams that care about process; comparing adopters to non-adopters measures culture and attributes it to AW. Comparison stays within a repo.
- **Not a replacement for review, CI, or human judgement.** As with traceability and workflow trace, this layer is accountability and evidence, not proof of quality.
- **No external analytics dependency, sink, or vendor** in phases 1 and 2.
- **No estimation, velocity, or story-point metrics.**
- **Not a new emission substrate.** This builds on `tracking` and `telemetry` as they exist; it does not introduce a third log.

## Open Questions / TODOs

- **Blocking (phase 1):** how are two corrections judged "the same"? Tag-based clustering over `docs/learnings/` frontmatter is cheapest and reproducible; embedding similarity is more accurate and less auditable. The north star is undefined until this is settled.
- **Blocking (phase 1):** is the correction denominator per session, per PR, or per merged change? Raw counts fall when less work happens, which would read as false improvement.
- **Deferred:** read-through instrumentation — whether agents actually open `docs/learnings/`, `docs/standards/`, and specs before working. Writes are measured, reads are not, which leaves the compounding mechanism partly unfalsifiable. Design cost is materially higher than every other gap here.
- **Deferred:** whether `aw-synthesize-memory` should compute and commit a periodic metrics rollup, or whether analysis stays wholly external to the repo.
- **Deferred:** retention interaction — processed session logs are deleted after 14 days, so any correction-clustering method must operate on `docs/learnings/` `derived-from` identifiers rather than on session log bodies.
- **Deferred (phase 3):** cross-repo aggregation mechanism — batch clone-and-read, as sketched in `docs/workflow/tracking.md`, versus CI-pushed rollups.

## Decision Links

Decisions to log once phase 1 choices are confirmed:

- Repeat-correction rate as the effectiveness north star, with correction capture rate as a mandatory paired guardrail.
- Within-repo dose-response over cross-repo comparison for the adoption claim.
- CI-side outcome join over emitter-side pull-request awareness.
- Open attribution posture over identity neutralisation in git-tracked metrics.
