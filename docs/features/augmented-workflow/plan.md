---
title: Consolidate AW skill entrypoints without losing workflow contracts
type: refactor
status: active
created: 2026-10-10
depth: deep
origin: docs/features/augmented-workflow/spec.md
baseline_version: 0.15.0
baseline_commit: 5fae68e9f7c1b397dd0721cfd4183cf9760c2900
---

# AW skill consolidation plan

## Summary

Consolidate `aw-brainstorm` and `aw-create-spec` into one proposed `aw-spec` entrypoint with exploratory and direct/update routes. Preserve separate PRD, living-spec, and implementation-plan contracts. Reduce the installed surface from **22 to 21 skills**, then evaluate a separate, optional shipping consolidation that could reduce it to 20.

Phase 1 implementation (U1–U7) was authorized on 2026-10-10 and its tested patch
was preserved. Phase 2 (U8) was separately authorized later that day. Publication, merge, deployment, and release are not authorized by this
implementation handoff. The prior completed plan is preserved at
`docs/features/augmented-workflow/migration-behavior-pins-plan.md`. Stable U IDs
are unchanged; execution progress is kept outside this plan.

## Problem and scope

Current main was rechecked on 2026-10-10 and remains the baseline commit above. Its 22 skill entrypoints already include several successful architectural consolidations: PRD import/create, review modes, capture modes, and refresh modes. The strongest remaining duplication is two procedures that write the same living spec and index.

The existing split expresses a useful distinction: uncertain product intent needs discovery; clear requirements need direct writing. The proposal preserves that distinction inside one router and removes duplicated spec-authoring instructions. It does not assume fewer skills automatically improve outcomes.

### In scope for Phase 1

- One discoverable spec-authoring entrypoint and one shared spec-writing procedure.
- Explicit requested-output and ambiguity routing across PRD, spec, plan, research, and exploration.
- Preservation of stage-specific overrides, design hooks, trace annotations, and human-review boundaries.
- Mode/stage-aware invocation tracking, compatible historical metrics, and installer migration.
- A narrowly scoped reconciliation of the existing plan-review instruction mismatch.
- Baseline/candidate evaluation, documentation, upgrade/rollback tests, and release criteria.

### Out of scope

- Combining PRDs, specs, and plans into one artifact.
- Making PRDs, plans, prototypes, or external tickets mandatory for every task.
- Combining review with compliance, capture with synthesis, or planning with ticket publication.
- Implementing install profiles or assuming installed skills can be hidden portably.
- Rewriting old decision records or source PRD bodies.
- Changing gate semantics, granting new permissions, or executing deployment/publication.

## Requirements and traceability

| ID | Requirement | Main units | Evidence |
|---|---|---|---|
| R1 | Replace the two competing spec entrypoints with one, retaining direct and exploratory paths | U2, U4, U6 | Exact installed inventory; routing cases |
| R2 | Honor requested output; preserve PRD provenance, living intent, and temporary plans | U2, U4 | Artifact contract fixtures and manual review |
| R3 | Do not broaden write, prototype, implementation, deletion, or publication authority | U1, U2, U7, U8 | Permission-boundary cases |
| R4 | Preserve configurable stages, provider overrides, hooks, and stage-correct tracking | U3, U4 | Deterministic tests plus routed scenarios |
| R5 | Preserve standards, requirement anchors, review requirements, and freshness evidence | U2, U3, U7 | Trace/gate tests; plan-review case |
| R6 | Safely migrate owned installs while preserving user skills and local customization | U5, U6 | Installer, upgrade, rollback fixtures |
| R7 | Demonstrate a useful result beyond the reduced count | U1, U7 | Baseline/candidate comparison |
| R8 | Keep shipping consolidation independently gated and optional | U8 | Separate approval and permission test results |

## Decisions and proposed design

### D1. Use `aw-spec` as the proposed canonical name

The outcome is durable feature intent, whether the input is clear or ambiguous. Natural language such as “brainstorm this” remains a trigger for its exploratory path. Do not retain permanent, independently discoverable `aw-brainstorm` and `aw-create-spec` alias skills alongside it: that would preserve competing descriptions.

The name is a proposal, not an existing command. Exact legacy slash-command compatibility depends on the runtime; document unsupported old invocations rather than claiming a universal redirect.

### D2. Route by requested outcome before ambiguity

1. A request to create/import/save a PRD goes to `aw-prd`.
2. An exploratory-only request stays exploratory, with notes only when useful/requested; no silently accepted spec.
3. A clear request to document or update durable intent uses the direct spec path.
4. Consequential ambiguity uses discovery, then the shared writer once ready.
5. A plan request goes to `aw-plan`; research returns evidence without independently changing intent.
6. Trivial fixes retain the existing lightweight route.

For an external PRD used to create a spec, preserve the source before promotion. Reuse an existing imported artifact when it is already present. PRD body preservation, lifecycle metadata, and index updates must remain distinct from writing the living spec.

### D3. Use progressive references, not a concatenated mega-skill

Proposed new files:

- `skills/aw-spec/SKILL.md`: compact router, boundaries, return contract.
- `skills/aw-spec/references/discovery.md`: exploratory dialogue and experience-discovery loop.
- `skills/aw-spec/references/spec-writing.md`: sole writer for template, standards, index, trace IDs, provenance, and applicable review.
- `skills/aw-spec/references/universal-brainstorming.md`: preserve the existing non-software exploration route where applicable.

Keep existing optional references/assets only when the new routes need them. Verify all moved references. Do not increase the current 2,200-word skill-body budget simply to fit the merger.

### D4. Preserve stage contracts independently of entrypoints

Keep `workflow.steps.brainstorm` and `workflow.steps.create_spec` during Phase 1. They represent replaceable stages, not required separate installed skills. A direct path resolves the create-spec override. An exploratory path resolves the brainstorm override first; if a spec is still needed after discovery, it then resolves and invokes the create-spec override. Use the bundled shared writer only when no custom create-spec provider is configured, or a validated bundled self-reference resolves to that writer. An override that already returns a valid spec must not trigger duplicate writing. Its handoff must report which applicable hooks actually ran, with current evidence; the spec alone is not evidence that spec review happened. Skip a duplicate hook only when that evidence exists, otherwise run the missing applicable hook or report its blocker.

Retain the existing custom-provider contracts. If two custom providers differ, preserve both. If an override cannot support the required contract, report the limitation rather than silently bypassing it. Avoid recursion when an override names the new bundled entrypoint.

### D5. Make tracking stage-aware without reinterpreting old events

The current helper infers one stage per skill and chooses the first configured matching stage. That is insufficient once a skill serves multiple stages. Extend the event contract to identify the actual selected mode/stage, retain old event readability, and distinguish one public invocation from internal stage execution. Decide and document the exact event schema before implementation. This plan intentionally does not invent new helper flags or commands.

Do not rename gate events to skill names. Review, compliance, capture, and synthesis evidence keep their existing identities and receipt requirements.

## Implementation units

### U1. Establish the baseline and evaluation fixtures

**Goal:** Measure current behavior before changing it. **Requirements:** R3, R7. **Dependencies:** implementation authorization.

**Files:** Create proposed `test/skills/consolidation-cases.json` and `test/skills/consolidation-evaluation.md`. Inspect existing `scripts/test-install.sh`, gate tests, and applicable standards first. These new paths are proposed, not existing test infrastructure.

**Approach:** Freeze the prompt cases below, expected outcomes, permission boundaries, and grading rubric. Run baseline and candidate with the same runtime/model configuration, repo fixtures, tools, and context. Use repeated runs across available supported runtimes; record unavailable runtimes and do not claim coverage. Distinguish static text/structure assertions from actual model behavior.

**Test scenarios:** Explicit PRD versus spec request; direct versus ambiguous intent; exploration without commitment; tiny fix; existing spec update; unavailable source; different custom stage providers; declined prototype; report-only research.

**Verification:** Baseline results include selected skill/mode, artifacts, questions, tool mutations, hook invocations, context loaded when measurable, latency, and quality findings. No unsupported inference from invocation counts to successful completion.

### U2. Implement the unified spec router and shared writer

**Goal:** Remove duplicate authoring while preserving both intake paths. **Requirements:** R1–R3, R5. **Dependencies:** U1; reviewed stage contract D4.

**Files:** Create the `skills/aw-spec/` files above; retire `skills/aw-brainstorm/SKILL.md` and `skills/aw-create-spec/SKILL.md` in the same coordinated release. Modify `skills/aw-prd/SKILL.md` and `skills/aw-plan/SKILL.md` only for affected routing/handoff references. Add proposed `test/skills/spec-contract.test.js`; extend the U1 cases.

**Approach:** Preserve the full source inventory before moving references. Reuse current template/schema-preservation behavior. Load applicable standards; preserve requirement IDs; use the existing `trace-annotate` mechanism and its disabled no-op behavior. Do not infer new requirements from filename or code alone without identifying uncertainty.

**Test scenarios:** Clear input writes spec without compulsory interview; ambiguous input resolves blockers; exploratory-only output does not settle intent; existing spec retains metadata and stable IDs; imported PRD body stays unchanged through promotion; standards and index schemas are preserved; no duplicate feature; prototype decline remains respected.

**Verification:** One canonical writer owns all spec mutations. The source tree and clean installed candidate expose 21 bundled entrypoints. Explicit plan/PRD/research outcomes remain distinguishable.

### U3. Preserve overrides and extend tracking deliberately

**Goal:** Keep stage routing and observability correct. **Requirements:** R4, R5. **Dependencies:** U1, agreed D4/D5; may proceed alongside U2.

**Files:** Modify `skills/aw-init/artifacts/aw-gate.js` and mirrored `.scripts/aw-gate.js`; `skills/aw-init/artifacts/tracking.md` and `docs/workflow/tracking.md`; add proposed `test/gate/skill-routing.test.js`; extend `package.json` test wiring only after the new test exists. Review `skills/aw-init/scripts/upgrade-config.rb`.

**Approach:** Replace ambiguous first-match inference for the new multi-stage route with the documented explicit stage/mode contract. Preserve the old fallback for historical callers. Validate supplied stage values. Define no-recursion behavior for bundled self-overrides and failure behavior for unavailable custom skills.

**Test scenarios:** Direct route records create-spec stage; exploratory route records the brainstorm stage with exploratory mode and any subsequent create-spec stage distinctly; two overrides naming the same skill do not misattribute stages; custom brainstorm returning notes followed by a different custom create-spec provider invokes each exactly once; a brainstorm provider returning a valid spec skips duplicate writing; different custom providers remain independent; legacy events remain readable; disabled tracking performs no writes; gate names and receipt consumption are unchanged.

**Verification:** Deterministic fixtures pass and representative runtime cases show actual stage behavior. Exactly one public invocation is counted per invocation, without hiding separately executed stages.

### U4. Reconcile routing, hooks, and the scoped review mismatch

**Goal:** Give all callers the same contract. **Requirements:** R1, R2, R4, R5. **Dependencies:** U2, U3.

**Files:** Modify `skills/aw-help/SKILL.md`, affected references in `skills/aw-work/`, `skills/aw-init/SKILL.md`, `skills/aw-plan/SKILL.md`, and other current callers identified by a repository-wide reference search. Update `docs/features/augmented-workflow/spec.md` and its index metadata if required. Extend `test/skills/consolidation-cases.json` and `test/skills/spec-contract.test.js`.

**Approach:** Specify ownership and order of `prd_review`, `discovery`, and `spec_review`. Run only applicable, enabled, non-empty hooks; direct spec writing does not fabricate a discovery stage. Preserve human-review and experience-prototype boundaries. Reconcile the living spec's requirement for plan document review with `aw-plan`'s handoff instructions, without changing unrelated review policy. Verify how the existing `aw-review` router receives a plan path rather than assuming a bare mode token is sufficient.

**Test scenarios:** PRD import-only runs no spec hook; import-to-spec runs each applicable hook once; override returning a spec does not cause a second writer/hook; disabled design hooks remain skipped; actual plan review precedes human sign-off/ticket/work handoff; no automatic publication from writing a spec or plan.

**Verification:** Source contracts, help recommendations, and observed routing agree. Plan-review drift is resolved in the same narrow contract pass, with current review permissions preserved.

### U5. Migrate installation and protect customization

**Goal:** Retire old bundled names safely. **Requirements:** R6. **Dependencies:** U2, U3; coordinate final changes with U4.

**Files:** Modify `skills/aw-init/scripts/install.sh`, `skills/aw-init/scripts/upgrade-config.rb`, affected `skills/aw-init/artifacts/config.yml` guidance if needed, and `scripts/test-install.sh`.

**Approach:** Extend owned-skill retirement for both manifest-based and pre-manifest histories. Preserve distinct existing stage keys and user-defined providers. Produce a dry-run migration report before destructive changes. Detect an existing user-owned `aw-spec` name collision and stop for a resolution; never overwrite it simply because the new bundle uses that name. For ambiguous pre-manifest ownership, preserve/report rather than deleting an unverified custom directory. Distinguish bundled legacy references from user-custom providers and explain exact-command compatibility limits.

**Test scenarios:** Clean install; current ownership manifest; old install without manifest; custom `aw-*` directory; custom content under a former bundled name; pre-existing user-owned `aw-spec`; customized AGENTS/config preserved without explicit overwrite; repeated install; interrupted migration; rollback to the pinned previous bundle.

**Verification:** Fresh installs and migrations with fully verified ownership contain exactly the intended 21 managed bundled skills. Ambiguous/custom preserved legacy directories may leave additional discoverable skills; report those separately as unresolved migration work rather than claiming a reduced total. No unrelated skill or custom configuration is lost. Stale managed references are migrated or clearly reported before users encounter a missing command.

### U6. Update documentation and package the coordinated change

**Goal:** Make the new surface discoverable and internally consistent. **Requirements:** R1, R6. **Dependencies:** U4, U5.

**Files:** Modify `README.md`; `skills/aw-init/artifacts/AGENTS.md` and `AGENTS.md`; `skills/aw-init/artifacts/workflow-readme.md` and `docs/workflow/README.md`; `skills/aw-init/artifacts/field-guide.md` and `docs/workflow/field-guide.md`; relevant feature docs; new decision record and `docs/decisions/index.yml`; release-version files and `CHANGELOG.md` only when a release version is selected.

**Approach:** Record a new decision superseding the affected May split; do not rewrite historical decisions. Separate canonical skill inventory from the everyday menu. During Phase 1 the eight-item menu uses `aw-commit-push-pr`, not the unimplemented `aw-ship`: help, spec, plan, work, debug, review, commit-push-pr, capture. Keep `aw-commit` clearly available for local-only commits. The eventual shipping name appears only in the conditional Phase 2 proposal.

**Test scenarios:** All executable examples resolve to installed skills/helpers; moved references exist; source and self-hosted mirrors match; no old name remains as active routing outside explicit migration/history documentation; normal tiny-task paths stay lightweight.

**Verification:** Existing installer drift/reference/word-budget checks pass. Version markers and package version remain consistent if bumped. No claim that a shorter menu reduces model-visible descriptions.

### U7. Verify, compare, and decide whether to release Phase 1

**Goal:** Establish behavioral parity and practical benefit. **Requirements:** R3, R5, R7. **Dependencies:** U1–U6.

**Files:** Update proposed `test/skills/consolidation-evaluation.md` with actual evidence; add focused regression cases to the corresponding tests, not just narrative assertions.

**Approach:** Run the static/deterministic suite and repeat U1's runtime evaluation on the candidate. Review the entire final diff, including installer sources and mirrors. Use the configured review and compliance workflow only after actual work; never stamp gates solely to make checks green.

**Test scenarios:** Entire matrix below; real upgrade fixtures; source-preserving PRD promotion; mode/stage telemetry; old/new name coexistence and near-duplicate external skills; trivial-task negative controls.

**Verification / release gate:** Zero observed unauthorized-action regressions; no material artifact or override regression; no destructive migration defect; all applicable deterministic tests pass. Predeclare the comparison rubric in U1. Release only with a demonstrated improvement in routing reliability, unnecessary clarification, procedure consistency, or measured loaded context. If runtime results are inconclusive, report that honestly and limit claims to deduplication/maintainability; do not market an unproved reliability gain.

### U8. Separately authorized shipping consolidation

**Goal:** Evaluate `aw-commit` + `aw-commit-push-pr` → proposed `aw-ship`. **Requirements:** R3, R8. **Dependencies:** separate approval received 2026-10-10; permission-boundary baseline and independent review remain required. It does not alter the preserved Phase 1 checkpoint.

**Files:** Candidate `skills/aw-ship/SKILL.md` and lazy references; current `skills/aw-commit/` and `skills/aw-commit-push-pr/`; affected installer/routing/tracking docs; proposed `test/skills/shipping-permissions-cases.json` and `test/skills/shipping-contract.test.js`.

**Approach:** First share duplicated commit mechanics. Only then consider one public router for local commit, full PR workflow, description-only, and description-update. Preserve separate `commit`/`commit_push_pr` stage overrides and the existing full workflow's review, push, compliance, metrics, and CI ordering. Keep human sign-off PRs independently accessible. Do not concatenate the already near-budget shipping body.

**Test scenarios:** “Commit this” never pushes/opens PR; “draft description” changes no repo/PR state; description-update does not commit/push; full PR flow honors existing approvals and provider overrides; existing-PR rewrite behavior remains explicit; detached/default-branch behavior preserves user work; unavailable GitHub path reports the blocker; targeted feedback handling stays outside this merger.

**Verification:** Separate passing deterministic and repeated runtime permission tests, independent review, and explicit go/no-go decision. Only an approved, verified release reaches 20 skills and replaces the everyday menu's shipping entry with `aw-ship`.

## Acceptance-case matrix

| Case | Input / condition | Required result |
|---|---|---|
| A1 | Save an external PRD | Preserve source PRD; no spec or implementation |
| A2 | Clear PRD to spec | Reuse/import provenance; direct spec; no compulsory interview |
| A3 | Ambiguous product idea | Resolve consequential ambiguity; label deferred questions |
| A4 | Compare ideas without commitment | Exploration only; no settled feature intent |
| A5 | Document existing behavior | Evidence-backed spec update; uncertainty explicit |
| A6 | Draft stakeholder PRD | Authored PRD; no automatic promotion |
| A7 | Plan from ready spec | Units/tests/sequencing; no implementation or progress state |
| A8 | Focused research question | Cited evidence; no silent product-doc write |
| A9 | Typo or tiny mechanical fix | Existing direct lightweight path |
| A10 | Existing spec with IDs/custom index | Preserve IDs/schema and update in place |
| A11 | Prototype suggested then declined | No prototype; uncertainty remains visible |
| A12 | Enabled hooks/custom providers | Appropriate stage/provider; each hook once |
| A13 | Same provider configured twice | Correct actual-stage tracking; no recursion |
| A14 | Missing source or provider | Honest blocker; no invented evidence/bypass |
| A15 | Old install/custom skill collision | Safe migration or explicit stop; no silent overwrite |
| A16 | Local-only commit / PR draft | No publication or unrelated mutations |

## Verification commands and evidence

Existing commands inspected in the repository, to run only during authorized implementation:

```sh
bash scripts/test-install.sh
npm run gate:test
node .scripts/aw-gate.js validate
node scripts/workflow-health.js --no-run --json
```

`workflow-health --no-run` is a static health inspection, not a substitute for executing the gate suite. Existing configured gate/trace/pin checks may require current evidence and a full checkout; report missing prerequisites rather than fabricating receipts. New proposed tests require implementation and test-script wiring before they can be run. No command above was executed to prepare this document.

Do not claim all-runtime validation from one runtime. Keep passed, failed, skipped, and never-run results separate. Static instruction-string tests cannot prove mode selection, permission behavior, or hook ordering by an agent.

## Rollout and rollback

1. Freeze the old and candidate evaluation inputs; pin the current commit as the comparison baseline.
2. Implement Phase 1 on an authorized branch with a coherent source/installer/docs change. Test clean and upgraded installations in disposable directories, not a user's live global skill directory.
3. Review migration dry-run output and custom-provider/name collisions before a real upgrade. Preserve backups of owned installed skills and changed configuration/routing files with their pre-upgrade identity.
4. Ship the new bundle and affected routing docs together. Report repositories whose locally customized old routing was intentionally preserved and still needs reconciliation.
5. If evaluation or migration exposes a material regression, stop rollout. Restore the pinned prior bundle and backed-up customized routing/config as one compatible set; remove only proven newly installed owned files. Do not reset product specs, PRDs, decisions, or unrelated user content.
6. Preserve historical telemetry. Do not reuse candidate receipts as proof for rolled-back code; run the applicable checks again on the restored state.
7. Verify rollback through installer fixtures, effective overrides, skill discovery, and representative direct/exploratory cases. Rollback itself requires authorization in the target environment.

## Risks, unresolved choices, and deferred work

- **Broader router chooses the wrong mode:** requested-outcome precedence and negative cases; fall back to the current split if needed.
- **Hidden stage behavior is lost:** explicit stage contracts, override preservation, and hook ownership before code changes.
- **Tracking double counts or misattributes:** settle D5 schema in U3; retain historical compatibility.
- **User-owned name collision or pre-manifest uncertainty:** stop/preserve/report; never infer ownership from an `aw-` prefix alone.
- **Procedure body expands:** progressive references and the existing word-budget ratchet.
- **Exact legacy command compatibility varies by runtime:** document supported behavior after testing, not a promised universal alias.
- **Evaluation infrastructure is not yet present:** the test paths in this plan are proposed; U1 establishes the runner/method and records available runtime coverage.
- **Release number is intentionally unset:** select at implementation/release time after checking current main.
- **Install profiles remain deferred:** a smaller README menu is not a smaller registry. A true core profile needs dependency closure and a supported way to invoke non-discoverable procedures.
- **Phase 2 is optional:** no requirement to merge shipping if mode safety or readability deteriorates.

## Handoff

Execute authorized Phase 1, U1–U7, using `aw-spec` and retaining existing stage keys. U8 shipping implementation was separately approved; retain `commit`/`commit_push_pr` and all mode permissions. Publication and release remain separate decisions. Main was refreshed and matched the pinned baseline before implementation.

## Sources and references

All repository links below are pinned to the audited baseline. Paths proposed above are explicitly marked; they are not claimed to exist today.

- [Current repository baseline](https://github.com/antonyjclements/augmented-workflow/tree/5fae68e9f7c1b397dd0721cfd4183cf9760c2900)
- [Living workflow specification](https://github.com/antonyjclements/augmented-workflow/blob/5fae68e9f7c1b397dd0721cfd4183cf9760c2900/docs/features/augmented-workflow/spec.md)
- [Plan conventions and stable implementation units](https://github.com/antonyjclements/augmented-workflow/blob/5fae68e9f7c1b397dd0721cfd4183cf9760c2900/skills/aw-plan/references/plan-template.md)
- [Brainstorm's spec-writing contract](https://github.com/antonyjclements/augmented-workflow/blob/5fae68e9f7c1b397dd0721cfd4183cf9760c2900/skills/aw-brainstorm/SKILL.md#L92-L137)
- [Direct spec workflow and trace annotations](https://github.com/antonyjclements/augmented-workflow/blob/5fae68e9f7c1b397dd0721cfd4183cf9760c2900/skills/aw-create-spec/SKILL.md#L20-L47)
- [PRD source/lifecycle contracts](https://github.com/antonyjclements/augmented-workflow/blob/5fae68e9f7c1b397dd0721cfd4183cf9760c2900/skills/aw-prd/SKILL.md)
- [Configured stages and design hooks](https://github.com/antonyjclements/augmented-workflow/blob/5fae68e9f7c1b397dd0721cfd4183cf9760c2900/docs/workflow/README.md#L517-L582)
- [Current skill-to-stage tracking inference](https://github.com/antonyjclements/augmented-workflow/blob/5fae68e9f7c1b397dd0721cfd4183cf9760c2900/.scripts/aw-gate.js#L698-L745)
- [Installer ownership and copying](https://github.com/antonyjclements/augmented-workflow/blob/5fae68e9f7c1b397dd0721cfd4183cf9760c2900/skills/aw-init/scripts/install.sh#L328-L495)
- [Config migration and conflict handling](https://github.com/antonyjclements/augmented-workflow/blob/5fae68e9f7c1b397dd0721cfd4183cf9760c2900/skills/aw-init/scripts/upgrade-config.rb)
- [Installer mirrors, references, and word-budget checks](https://github.com/antonyjclements/augmented-workflow/blob/5fae68e9f7c1b397dd0721cfd4183cf9760c2900/scripts/test-install.sh#L8-L144)
- [Original discovery/direct-spec split](https://github.com/antonyjclements/augmented-workflow/blob/5fae68e9f7c1b397dd0721cfd4183cf9760c2900/docs/decisions/2026-05-28-combine-brainstorm-and-spec-creation.md)
- [Prior mode-routed consolidation](https://github.com/antonyjclements/augmented-workflow/blob/5fae68e9f7c1b397dd0721cfd4183cf9760c2900/docs/decisions/2026-07-02-consolidate-skills-and-add-memory-loop.md)
- [Current shipping modes and sequencing](https://github.com/antonyjclements/augmented-workflow/blob/5fae68e9f7c1b397dd0721cfd4183cf9760c2900/skills/aw-commit-push-pr/SKILL.md)
