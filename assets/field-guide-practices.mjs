import { guideLink, skill, sourceLink, sourceExcerpt, steps, note, theory } from './field-guide-concepts.mjs';

const config = 'docs/workflow/config.yml';
const gates = 'docs/workflow/gates.md';
const workflow = 'docs/workflow/README.md';
const solutionTemplate = 'skills/aw-capture/references/solution-doc.md';
const capture = 'skills/aw-capture/SKILL.md';
const experience = 'docs/features/experience-discovery/';
const progress = 'docs/features/progress-tracking/';

export const practiceConcepts = {
  solutions: {
    intro: 'A solution saves the route from a recognizable symptom to a verified fix. A later contributor can test whether the same diagnosis fits before spending time rediscovering it.',
    topic: 'Diagnosis', life: 'Reusable while the failure is possible', wren: 'alert',
    meta: ['Lives in <code>docs/solutions/&lt;category&gt;/</code>', 'Discovery by file search'],
    writer: skill('aw-capture'), reader: [skill('aw-debug'), skill('aw-refresh')].join(', ') + ', future investigators',
    aside: theory('A solution preserves the observations that turned a symptom into an explanation.'),
    sections: [
      ['details', 'What a solution holds', `
        <p>Use <code>aw-capture solution</code> after a non-trivial fix when someone would benefit from the same diagnostic path. Include the symptom, the conditions that trigger it, what ruled out the first plausible causes, the actual fix, and the command or observation that verified it.</p>
        <p>A ${guideLink('learnings', 'learning')} carries a correction into future sessions. A ${guideLink('decisions', 'decision')} records why a choice was made. A solution can link either while keeping enough evidence to identify the original failure.</p>`],
      ['anatomy-of-a-solution', 'Anatomy of a solution', `
        <p>Files are self-describing. Name the failure in searchable language and set <code>status</code>, <code>problem_type</code>, and <code>category</code> in the frontmatter. The body goes from symptom and cause to changes, verification, and prevention. Record checks that ran and any checks still outstanding.</p>
        ${sourceExcerpt(solutionTemplate, `## Root Cause

<The actual cause, not the first suspicion. Distinguish what was verified from
what was inferred.>

## Solution

<What fixed it. Include the concrete change, not just the strategy.>

## Files Changed

- <repo-relative path> — <what changed there>

## Verification

- <command actually run and its outcome>

Say explicitly when verification was not run.`)}`],
      ['worked-example', 'A config survives an upgrade with the wrong key', `
        <p>In this example, the install reports success, but a repo-specific review provider never runs. First reproduce with the affected version pair and inspect the target checkout's config. If the old key survived while the installed instructions read the new one, the mismatch explains why the default provider ran. A migration test should exercise upgrades with a customized provider and confirm a fresh install still takes the default route.</p>
        <p>Record the exact config path, version pair, and verified test result. The public AW repository documents a real change in this area in its ${sourceLink('docs/decisions/2026-06-07-add-upgrade-config-migration.md', 'upgrade config migration decision')}. The scenario above illustrates the structure of a solution entry.</p>`],
      ['where-solutions-live', 'Finding the right file', `
        <p>Write to <code>docs/solutions/&lt;category&gt;/YYYY-MM-DD-&lt;slug&gt;.md</code>. Pick the narrowest relevant category, such as <code>build</code>, <code>integration</code>, or <code>tooling</code>. Reserve <code>patterns</code> for guidance corroborated by several concrete solutions. Search by symptom, package, or error text. The directory has no registry.</p>
        <p>${skill('aw-capture')} offers a lightweight pass from the current context or a fuller pass that checks related records and overlap. A duplicate can be updated or cross-linked when that makes the existing guidance easier to find. ${sourceLink('docs/solutions/README.md', 'Solutions directory conventions')}.</p>`],
      ['reuse', 'Recheck the solution before reusing it', `
        <p>Match the observed symptom and constraints against the current code before applying the fix. A symptom may recur with a different cause after an upgrade. <code>aw-refresh solutions</code> checks the files against the live repo and can flag uncertain guidance as stale, consolidate overlap, or recommend replacing an outdated explanation.</p>
        ${note("Wren's note", 'Record the failed hypothesis if a future contributor is likely to test it again. Name the observation that ruled it out.', 'alert')}`],
    ],
    related: [['aw-debug', 'aw-debug'], ['aw-capture', 'aw-capture'], ['aw-refresh', 'aw-refresh'], ['learnings', 'Learnings'], ['decisions', 'Decisions']],
  },
  'session-memory': {
    intro: 'A session log records what happened in a meaningful piece of work. Synthesis looks for corrections and patterns across those records and carries durable lessons forward.',
    topic: 'Memory', life: 'Until processed and eligible for retention cleanup', wren: 'gathering',
    meta: ['Logs <code>docs/sessions/</code>', 'Synthesis output <code>docs/context/wiki.md</code>'],
    writer: skill('aw-capture') + ' or an installed capture hook', reader: skill('aw-synthesize-memory'),
    aside: theory('A later session can recover the reasons and observations that would otherwise disappear with the conversation.', 'theory-decay', 'Why theories decay'),
    sections: [
      ['details', 'What belongs in a session log', `
        <p>Record a meaningful session or self-contained work chunk. Give the outcome of what was tried, checks that actually ran, user corrections, failed approaches worth remembering, and the files or open questions that matter. Keep sensitive data out of the log and note uncertainty where an outcome was never checked.</p>
        <p>Use <code>aw-capture session</code> explicitly when the runtime lacks the optional Claude Code Stop hook. If an explicit live capture or <code>run start</code> already allocated the source record, update that same record while active and preserve its identifier. Finished source evidence is frozen.</p>`],
      ['anatomy-of-a-session', 'Anatomy of a session', `
        <p>Each <code>docs/sessions/YYYY-MM-DD-&lt;slug&gt;.md</code> file declares its own status. The capture template separates corrections and dead ends so synthesis can distinguish a reusable lesson from an experiment that failed.</p>
        ${sourceExcerpt(capture, `## What Was Attempted

- <action and outcome>

## What Worked

- <approach that succeeded and why>

## Corrections Made

- <what the user corrected and what the missed assumption was>

## Dead Ends

- <approach that failed, why it failed, and what to try instead>`)}
        <p>Use the Key Files and Open Questions sections to make the record inspectable. A log starts <code>unprocessed</code>, and synthesis sets <code>processed</code> in frontmatter. It discovers logs by file, so no session index is needed.</p>`],
      ['synthesis', 'From raw logs to reusable memory', `
        ${steps([
          ['Read new evidence', 'Read unprocessed logs, existing tentative learnings, and the source files needed to verify claims.'],
          ['Corroborate the lesson', 'Reuse a learning when it already describes the pattern. Count distinct supporting session identifiers and keep the evidence references.'],
          ['Refresh the wiki', 'Regenerate the context wiki with active learnings, minimal tentative entries, and links to durable artifacts.'],
          ['Mark and retain', 'Mark logs processed. Consider cleanup only when the retention window has passed, the source is preserved in Git, and the run is inactive.'],
        ])}
        <p>The default window is 14 days after the session date or the end of the current sprint in sprint-based teams, whichever is longer. Eligibility also requires the current body to match a known committed copy apart from the processed status change. ${sourceLink('skills/aw-synthesize-memory/SKILL.md', 'Synthesis and retention rules')}.</p>`],
      ['worked-example', 'Trace a repeated correction to a learning', `
        <p>Two sessions caught real defects while inspecting a diff that had already passed automated checks. The ${sourceLink('docs/learnings/2026-07-27-review-the-diff-before-stamping-the-gate.md', 'resulting learning')} records two source identifiers and the corrective action to read the diff before writing the receipt. A different session would add evidence only if it corroborated that same lesson.</p>
        <p>The learning survives routine log cleanup because its <code>derived-from</code> entries use identifiers. See ${guideLink('learnings', 'Learnings')} for the three-session promotion rule.</p>`],
      ['resuming-work', 'Resume from a workstream checkpoint', `
        <p>When an unfinished unit needs a next action, use a checkout-local ${guideLink('workstreams', 'workstream record')}. It records the branch, revision, current state, and next action. A session log helps synthesis explain past work. Active workstream records stay outside the synthesis input.</p>
        ${note('Watch the fold', 'Keep the exact source log when capture already allocated a session identifier. A second file for the same run can make one observation look like two.')}`],
    ],
    related: [['learnings', 'Learnings'], ['workstreams', 'Workstreams'], ['solutions', 'Solutions'], ['aw-capture', 'aw-capture'], ['aw-synthesize-memory', 'aw-synthesize-memory']],
  },
  gates: {
    intro: 'A gate checks whether the repo has fresh evidence for a configured workflow step. A receipt describes work observed by the skill that performed it.',
    topic: 'Verification', life: 'By time or by changes in scope', wren: 'perched',
    meta: ['Helper <code>.scripts/aw-gate.js</code>', 'Configuration <code>gates</code>'],
    writer: [skill('aw-review'), skill('aw-check-workflow-compliance'), skill('aw-synthesize-memory')].join(', '),
    reader: 'Contributors, Git hooks, and CI checks',
    aside: theory('A receipt gives a reviewer something to inspect. The gate checks a defined fact about that evidence.', 'proof-over-trust', 'Proof over trust'),
    sections: [
      ['details', 'What a gate makes enforceable', `
        <p>For an age gate, the helper checks how long ago a named event was recorded. For a commit gate, it compares the configured paths to the revision that was checked. A change in scope can invalidate a recent review while changes outside that scope can leave it fresh.</p>
        <p>The public repo config runs review in commit mode and workflow compliance and synthesis on an age window. Each repo chooses the event names, scopes, and thresholds that match its workflow.</p>
        ${sourceExcerpt(config, `gates:
  enabled: true
  require_receipt: true
  state_file: .aw-gate-state.json
  checks:
    review:
      mode: commit
      paths:
        - "."
        - ":(exclude)docs"
    check_workflow_compliance:
      mode: age
      max_age_hours: 168
    synthesize:
      mode: age
      max_age_hours: 336`)}`],
      ['receipts', 'From observed work to a recorded gate', `
        ${steps([
          ['Run the step', 'Review the scoped diff, audit the workflow, or perform the other named checks. Record what actually happened.'],
          ['Write the receipt', 'With receipts enabled, the skill writes the gate name, timestamp, commit, summary, and optional detail in the local receipt directory.'],
          ['Stamp the event', 'The helper checks the gate name, receipt age, and non-empty summary. It consumes the receipt and stamps the current revision and time in the local gate state.'],
          ['Check at the boundary', 'A local hook or CI job asks whether each configured gate is fresh for the state it checks.'],
        ])}
        <p>A receipt is one-use and the default maximum receipt age is 180 minutes. A gate can still accept a misleading summary. The ${guideLink('learnings', 'review learning')} gives an example of why the diff and actual checks matter.</p>`],
      ['check-head-or-worktree', 'Choose the state to check', `
        <p>Use the default <code>--against head</code> for a committed revision in a pre-push hook or CI. Use <code>--against worktree</code> for a pre-commit check that needs to include staged and unstaged changes. Both use the config in the applicable checkout.</p>
        ${sourceExcerpt(gates, `node .scripts/aw-gate.js check [--against head|worktree]`)}
        <p>State and receipts are local and Git-ignored. A fresh clone has its own evidence requirements. Make the decision about where to run and enforce a check explicit before wiring it into CI.</p>`],
      ['diagnose', 'Read a stale or missing result', `
        <p>If review reports changed paths, look at the current scoped diff and rerun the review on it. If a receipt expired or was for the wrong gate, rerun the corresponding skill to generate a current one. If a gate has never been recorded in this checkout, finish the actual step before recording it.</p>
        <p>A passing freshness check tells you how the event relates to the configured scope and revision. Keep the underlying test results, findings, and exceptions in the appropriate artifacts. ${sourceLink(gates, 'Gate CLI and troubleshooting')}.</p>`],
    ],
    related: [['spec-traces', 'Spec traces'], ['proof-over-trust', 'Proof over trust'], ['aw-review', 'aw-review'], ['aw-check-workflow-compliance', 'aw-check-workflow-compliance']],
  },
  'spec-traces': {
    intro: 'A spec trace links a stable acceptance criterion to the scenarios or tests that cover it, and optionally to a code entry point. The helper checks the links deterministically.',
    topic: 'Verification', life: 'While the requirement applies', wren: 'perched',
    meta: ['Configuration <code>trace</code>', 'Helper <code>.scripts/aw-gate.js trace</code>'],
    writer: 'Spec authors and test maintainers', reader: 'Contributors, reviewers, and CI',
    aside: theory('A trace lets a reviewer move directly from a promise to the evidence for it.', 'proof-over-trust', 'Proof over trust'),
    sections: [
      ['details', 'Give the requirement a stable ID', `
        <p>When <code>trace.enabled</code> is true, give each feature-bearing acceptance criterion a unique ID such as <code>PROG-002</code>. Put an <code>@spec:</code> anchor next to the corresponding scenario or test in the configured test paths. One scenario can cover more than one requirement, and several scenarios can cover different cases for one requirement.</p>
        <p>An optional code anchor points to the behavior entry point. By default a missing code anchor is a warning. The owning spec remains the source for the intended behavior. ${sourceLink('docs/standards/traceability.md', 'Spec Traceability standard')}.</p>`],
      ['worked-example', 'Follow PROG-002 from requirement to scenario', `
        <p>${sourceLink(progress + 'spec.md#prog-002--accurate-resume', 'PROG-002')} addresses resuming a local workstream. The scenario covers two ways an agent could resume incorrectly. It could choose a newer record on recency alone, or restore old verification after the checkout has changed.</p>
        ${sourceExcerpt(progress + 'progress-tracking.feature', `@spec:PROG-002
  Scenario: Select explicitly and reconcile stale context
    Given two records match a plan and one was updated more recently
    When a session resumes without selecting either record
    Then the guidance requires asking which workstream to use
    When the human selects one with unchanged U1 and U3 identifiers
    And its branch, HEAD, source units or dirty files differ from live state
    Then reconcile those differences before restoring its next action
    And preserve the identifiers and human notes
    And historical passing results cannot satisfy affected current checks`)}
        <p>The file identifies this as a manual contract walkthrough. A valid link lets a reviewer find the scenario. Its execution and results are recorded separately.</p>`],
      ['check-the-links', 'Run the trace checker', `
        <p>Run the helper in a trace-enabled checkout. It reports unknown anchors and requirements without a test anchor. Use <code>--json</code> for a requirements matrix and structured findings, or <code>--out</code> to keep the same report as a build artifact.</p>
        ${sourceExcerpt(workflow, `node .scripts/aw-gate.js trace [--base origin/main] [--json] [--out docs/trace.json]`)}
        <p>With <code>--base</code>, a changed anchored test also needs the owning spec change or an explicit <code>Spec-Override:</code> commit trailer. Trace validation can run in CI independently of receipt-based freshness gates.</p>`],
      ['check-meaning', 'Review the assertion and keep the links current', `
        <p>A trace can tell you that a scenario names <code>PROG-002</code>. Read the assertions to see whether the scenario actually tests the ambiguity, the dirty tree, and the reuse of stale results. When an accepted requirement is removed or split, reconcile all its anchors so they continue to point to the right promises.</p>
        ${note('Watch the fold', 'A trace report proves the connection exists. Record the test or manual check result separately so a reviewer can see what the connection verifies.')}`],
    ],
    related: [['living-specs', 'Living specs'], ['workstreams', 'Workstreams'], ['gates', 'Gates &amp; receipts'], ['proof-over-trust', 'Proof over trust'], ['aw-review', 'aw-review']],
  },
  workstreams: {
    intro: 'A workstream record lets another session safely resume unfinished work in the same checkout. It preserves the current goal, evidence, and next action when a conversation stops.',
    topic: 'Continuity', life: 'Through handoff and human closure', wren: 'gathering',
    meta: ['Local record <code>.aw/workstreams/&lt;id&gt;/progress.md</code>', 'Versioned Markdown'],
    writer: 'One coordinator through ' + skill('aw-work'), reader: 'The next contributor or session in the checkout',
    aside: theory('A checkpoint preserves enough local context to resume without reconstructing a whole conversation.', 'theory-decay', 'Why theories decay'),
    sections: [
      ['details', 'When to leave a checkpoint', `
        <p>Use a record for work that spans several units, has an interruption or handoff, or must wait for a concrete blocker. Keep one record and one coordinator. Include links to the goal, spec, plan, or ticket, then record what is in progress and the exact next action.</p>
        <p>The installer ignores the root <code>.aw/workstreams/</code> directory. A new worktree has its own local state. If a transfer is authorized, verify the destination, preserve the identity and human notes, and pause the original before the destination takes ownership.</p>`],
      ['anatomy-of-a-checkpoint', 'Anatomy of a checkpoint', `
        <p>The versioned frontmatter identifies the workstream, repo, branch, observed HEAD, and status. The body keeps unit IDs stable and tracks implementation and verification on separate axes. Preserve human notes and unknown fields when updating a supported version.</p>
        ${sourceExcerpt('skills/aw-work/references/progress-template.md', `---
format_version: 1
workstream_id: <slug>-<random-suffix>
repository: <remote identity or local repository identity>
branch: <branch or detached>
last_observed_head: <full hash or null>
updated_at: <UTC ISO 8601 timestamp>
status: active
completion_state: in-progress
plan: null
spec: null
ticket: null
---`)}
        <p>Record the reason and unblock or resume condition if the work is blocked or paused. Keep the next command or decision precise enough for a later session to pick up.</p>`],
      ['resume', 'Reconcile with the live checkout', `
        ${steps([
          ['Resolve the record', 'Use the named ID or exact path. If multiple records match, ask which one to use.'],
          ['Reconcile facts', 'Compare repo, checkout, branch, HEAD, source artifacts, and working changes. Inspect any referenced running job that affects the next action.'],
          ['Restore the next action', 'Keep stable unit IDs. Scope any repeated verification to what changed and checkpoint the outcome.'],
        ])}
        <p>A progress record can describe a passing check on an earlier revision. The check remains historical evidence until its relevance to the current diff has been verified. ${sourceLink(progress + 'progress-tracking.feature', 'Resume and handoff scenarios')}.</p>`],
      ['worked-example', 'Resume a verified first unit and unfinished second unit', `
        <p>Suppose U1’s contract check passed yesterday and U2 changed its shared input today. Compare the recorded HEAD and the working diff. If U2 affects the contract U1 exercised, rerun the first check before carrying the result forward. Resume U2 at its next unfinished action, keeping the unit names the handoff used.</p>
        <p>Preserve an earlier unsuccessful approach when it explains what to avoid, but record the updated working tree and the evidence that now applies.</p>`],
      ['close', 'Close with evidence and an explicit disposition', `
        <p>Prepare the verification summary, skipped checks, risks, and unfinished scope for acceptance. Closing the work and deciding what happens to the local file are separate choices. Keep it by default. Export or remove it only with the corresponding explicit authorization.</p>
        ${note('Watch the fold', 'A checkpoint is local continuity. A session log is input for memory synthesis. Keep active progress out of automatic synthesis and archived-artifact cleanup.')}`],
    ],
    related: [['session-memory', 'Session memory'], ['plans', 'Plans'], ['workspaces', 'Workspaces'], ['aw-work', 'aw-work'], ['picking-up-where-the-last-agent-stopped', 'Picking up where the last agent stopped']],
  },
  'behavior-pins': {
    intro: 'A behavior pin uses the same harness on the old revision and the candidate for a change that must preserve observable behavior. It gives a rewrite a baseline it must actually match.',
    topic: 'Verification', life: 'For the covered behavior and baseline', wren: 'perched',
    meta: ['Manifest <code>behavior-pin.yml</code>', 'Comparison <code>.aw/pin/equivalence.json</code> by default'],
    writer: skill('aw-pin-behavior'), reader: skill('aw-work') + ', reviewers, and the pin checker',
    aside: theory('Run the same experiment on the old and new implementations so the change has a comparable observation.', 'proof-over-trust', 'Proof over trust'),
    sections: [
      ['details', 'Pin a behavior before changing it', `
        <p>Use a pin for a rewrite, migration, or implementation substitution where callers should observe the same result. Name the behavior and its boundary cases before editing. Keep dynamic fields stable so differences in time or ordering do not obscure the behavior being compared.</p>
        <p>Pin only what should be preserved. For a planned change in behavior, record the new expectation separately and verify it against the living spec. ${sourceLink('docs/standards/behavior-pinning.md', 'Behavior Pinning standard')}.</p>`],
      ['worked-example', 'Pin the disabled trace output', `
        <p>AW’s own manifest pins the helper when spec tracing is disabled. It names the original revision, the two subject copies of the helper, and the harness. The harness asserts a successful exit plus the exact disabled summary, empty matrix, and empty findings. It covers that invocation and output contract.</p>
        ${sourceExcerpt('docs/features/augmented-workflow/behavior-pin.yml', `base: c338665
harness: node test/pin/aw-gate-trace-disabled.pin.js
subject:
  - .scripts/aw-gate.js
  - skills/aw-init/artifacts/aw-gate.js
oracle:
  - test/pin/aw-gate-trace-disabled.pin.js
created: 2026-07-16`)}
        <p>${sourceLink('test/pin/aw-gate-trace-disabled.pin.js', 'Read the pinned harness')} to see which fields it compares. Enabled tracing is a separate contract.</p>`],
      ['compare', 'Run both sides and read the verdict', `
        <p>In the normal same-repo mode, <code>node .scripts/aw-gate.js pin run</code> uses a temporary worktree for the old revision and runs the current harness against both trees. Reference-repo mode instead supplies the named reference and candidate roots to one harness invocation. The helper writes the machine-readable verdict to the configured <code>pin.out</code>.</p>
        <table class="compact-table">
          <thead><tr><th scope="col">Verdict</th><th scope="col">What it says</th></tr></thead>
          <tbody>
            <tr><th scope="row"><code>pass</code></th><td>The old and candidate implementations passed on the covered cases.</td></tr>
            <tr><th scope="row"><code>pin-not-characterizing</code></th><td>The reference failed. Check the setup or expectations before judging the candidate.</td></tr>
            <tr><th scope="row"><code>equivalence-broken</code></th><td>The old side passed and the candidate failed. Inspect the mismatch against the preservation scope.</td></tr>
          </tbody>
        </table>`],
      ['keep-the-oracle-independent', 'Keep the comparison independent', `
        <p>Establish the baseline before editing the subject and keep a clear record of the oracle and support files. <code>pin check --base origin/main</code> inspects commit history for a commit that changes both subject and oracle or support files. The documented manifest-scoped override records the reason when such coupling is intentional.</p>
        ${note('Watch the fold', 'A passing pin covers the named scenarios. List meaningful inputs and outputs left outside the harness before treating the change as equivalent.')}`],
    ],
    related: [['aw-pin-behavior', 'aw-pin-behavior'], ['standards', 'Standards'], ['spec-traces', 'Spec traces'], ['proof-over-trust', 'Proof over trust'], ['aw-work', 'aw-work']],
  },
  'experience-discovery': {
    intro: 'When a consequential part of the intended experience is still uncertain, make the agent’s interpretation inspectable. Use the human reaction to settle what the feature should do or keep the question open.',
    topic: 'Intent', life: 'Until the experience question is settled', wren: 'gathering',
    meta: ['Intent <code>docs/features/experience-discovery/spec.md</code>', 'Route <code>aw-spec</code> exploratory'],
    writer: 'The people shaping the experience with ' + skill('aw-spec'),
    reader: 'Feature owners, designers, and implementers',
    aside: theory('Human judgment supplies the part of the intended experience that a functional check cannot establish.', 'agents-and-theory', 'Agents and the missing theory'),
    sections: [
      ['details', 'Decide if the question needs discovery', `
        <p>Ask whether two reasonable interpretations would produce meaningfully different experiences. A bulk-edit action could show the affected count before confirmation, at completion, or both. Those choices change whether a person can predict the scope before acting. A clear spacing fix can go straight to the narrow edit and check.</p>
        <p>${skill('aw-spec')} owns the exploratory loop, and ${skill('aw-work')} can route consequential uncertainty back to it. Explain the current interpretation and identify what a small prototype would clarify.</p>`],
      ['worked-example', 'Use a prototype to answer one question', `
        ${steps([
          ['Name the experience question', 'Can a person tell which items a bulk edit affects before committing to it?'],
          ['Agree on a small probe', 'Use a disposable walkthrough or mock with a representative selection. Wait when proposing extra prototype work. A direct prototype request already authorizes the stated scope.'],
          ['Get a reaction', 'Ask the person to interpret the scope and available recovery before revealing how the flow works. Capture ambiguous wording or misleading states.'],
          ['Carry forward what was learned', 'Preserve the accepted behavior and unresolved questions in durable intent. Keep production work within the requested scope.'],
        ])}
        <p>Choose a medium that can test the question. A static screen can show hierarchy and wording. A question about timing or motion needs an interaction the person can experience.</p>`],
      ['check-the-agreement', 'Check the agreement against the spec', `
        <p>The public acceptance scenario makes the boundary observable. A suggested prototype waits for agreement, while an explicit request supplies authorization for the stated scope. The feature’s scenarios are manual conversation checks and its replay write-up records bounded outcomes and limits.</p>
        ${sourceExcerpt(experience + 'experience-discovery.feature', `@spec:EXD-001, EXD-002, EXD-004
  Scenario: S2 Honor direct authorization
    Given the user explicitly requests a small disposable prototype
    Then the agent proceeds within that scope without asking for approval again
    And it asks for a human reaction before treating experiential fit as settled`)}
        <p>${sourceLink(experience + 'replay-results.md', 'Read the controlled replay and its limits')}. It separately names the scripted cases and the experience qualities they could not evaluate.</p>`],
      ['carry-forward', 'Carry human feedback into the living intent', `
        <p>Separate what the team agreed from assumptions and open fit questions. If the walkthrough works functionally but the person says it still hides the consequences, keep the issue open until corrected or deliberately deferred. Preserve the changed behavior in the ${guideLink('living-specs', 'living spec')} so it survives disposal of the prototype.</p>
        <p>A configured design discovery hook runs at the existing final brainstorming checkpoint when enabled and named. It receives the interpretation, agreement and scope, feedback, and unresolved questions. Reuse that context and reconcile findings once. ${sourceLink(workflow + '#artifact-handoff-contract', 'Discovery handoff contract')}.</p>`],
    ],
    related: [['living-specs', 'Living specs'], ['plans', 'Plans'], ['aw-spec', 'aw-spec'], ['aw-work', 'aw-work'], ['roles', 'Use it by role']],
  },
  'replaceable-steps': {
    intro: 'A repo can choose a different skill for one workflow step. The replacement must accept the same inputs, return the expected evidence or artifact, and stay within the requested mode.',
    topic: 'Configuration', life: 'While the provider is configured', wren: 'alert',
    meta: ['Config <code>docs/workflow/config.yml</code>', 'Routing <code>workflow.steps</code> and <code>workflow.auxiliary</code>'],
    writer: 'The repo’s workflow owner', reader: 'Skills that dispatch to a configured provider',
    aside: theory('Replacement preserves the handoff so the next contributor receives the artifact and evidence they need.'),
    sections: [
      ['details', 'Choose a provider for one step', `
        <p>Set the step’s <code>skill</code> to an installed provider in the target checkout’s config. Blank selects the bundled route where one exists. Extension points such as pipeline monitoring and end-to-end authoring need an explicit provider. Read the repo’s contract before choosing which stage to replace.</p>
        ${sourceExcerpt(config, `    plan:
      skill: ""
    review:
      skill: ""
    create_tickets:
      skill: ""
    work:
      skill: ""`)}
        <p>The public source leaves these keys empty. A repo can replace review and continue to use bundled planning and implementation. ${sourceLink(workflow + '#workflow-step-keys', 'Keys and bundled providers')}.</p>`],
      ['keep-routes-distinct', 'Keep the stage boundaries independent', `
        <table class="compact-table">
          <thead><tr><th scope="col">Request</th><th scope="col">Provider selection</th></tr></thead>
          <tbody>
            <tr><th scope="row">Write a spec from clear intent</th><td>Resolve <code>workflow.steps.create_spec.skill</code>.</td></tr>
            <tr><th scope="row">Explore a product question</th><td>Resolve <code>brainstorm</code> first. Resolve <code>create_spec</code> only once durable intent is ready and authorized.</td></tr>
            <tr><th scope="row">Make a local commit</th><td>Resolve <code>commit</code>. The action ends with the local commit.</td></tr>
            <tr><th scope="row">Create a PR</th><td>Resolve <code>commit_push_pr</code> and pass the separately configured commit provider if local commits are needed.</td></tr>
          </tbody>
        </table>
        <p>A description draft from ${skill('aw-ship')} is read-only. A same-name bundled override for ${skill('aw-spec')} or ${skill('aw-ship')} enters the appropriate stage reference without calling its router again.</p>`],
      ['worked-example', 'Replace review in one checkout', `
        <p>Imagine a repo with an installed review skill called <code>team-review</code>. Set <code>workflow.steps.review.skill</code> to <code>team-review</code> there. For document review, pass the actual spec or plan path. For code review, preserve the intended target and scope of the diff. The next step needs the provider’s actual findings and evidence.</p>
        <p>If the provider is unavailable or cannot honor the stage contract, surface the blocked step. Preserve the artifact and its path so work can continue once the provider issue is resolved.</p>`],
      ['artifact-handoff', 'Follow the artifact to the next stage', `
        ${steps([
          ['Review the intended file', 'Pass the actual living spec or plan path and inspect the review evidence for that revision.'],
          ['Return the result', 'Use the contract’s artifact path, ID, or findings. A spec writer reports stage, unresolved intent, and evidence from applicable hooks.'],
          ['Continue the configured workflow', 'Pass an approved plan to ticketing or work. A full shipping workflow can pass its PR URL to a configured monitor.'],
        ])}
        ${note('Watch the fold', 'An existing artifact proves the file was written. Check the evidence for a required review or design hook before claiming that step ran.')}`],
    ],
    related: [['aw-spec', 'aw-spec'], ['aw-ship', 'aw-ship'], ['aw-review', 'aw-review'], ['experience-discovery', 'Experience discovery'], ['workspaces', 'Workspaces']],
  },
};
