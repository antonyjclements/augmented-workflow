import { guideLink, skill, sourceLink, steps } from './field-guide-concepts.mjs';

const experience = 'docs/features/experience-discovery/';
const progress = 'docs/features/progress-tracking/';
const effectiveness = 'docs/features/workflow-effectiveness/';
const gateLearning = 'docs/learnings/2026-07-14-record-every-configured-gate.md';
const reviewLearning = 'docs/learnings/2026-07-27-review-the-diff-before-stamping-the-gate.md';

const examples = {
  'aw-init': [
    'Inspect what a new checkout needs',
    'You can use the bundled setup skill when working inside an agent. Start with a target checkout that already has a hand-written AGENTS.md. The decision is what AW needs to add and how the existing instructions should be preserved.',
    [
      ['Name the target', 'Invoke <code>aw-init /path/to/repo</code> with an explicit repo path. Read the existing instructions and identify which AW files are missing.'],
      ['Choose the install surface', 'For the bundled installer, include <code>--with-gates</code> if the repo needs the deterministic helper. Inspect the reported writes and preserved files.'],
      ['Verify in the target', 'Open the generated workflow config and confirm the original project guidance is still present. Ask <code>aw-help</code> from that checkout to verify it reads the local policy.'],
    ],
    'Keep the resulting repo path, version marker, and any existing files that need manual reconciliation. ' +
      guideLink('install', 'Install with AW CLI') + ' is the guide’s recommended terminal setup.',
    'skills/aw-init/scripts/install.sh',
  ],
  'aw-prd': [
    'Import a brief without losing the original',
    'A product partner sends a dated brief for adding undo to a bulk edit. It includes examples and open questions about partial success. Preserve that input so a later spec can trace what the team received and what it subsequently settled.',
    [
      ['Import the supplied material', 'Run <code>aw-prd import</code> with the source path or supplied body. Save the original as a historical PRD and record its provenance.'],
      ['Distinguish intake from agreement', 'If the brief assumes a five-minute window but the team has yet to agree, keep it as a proposed behavior. An enabled, named PRD review hook belongs to intake.'],
      ['Pass the PRD forward', `Once the team wants durable feature behavior, give the exact PRD path to ${skill('aw-spec')}. Promotion links the original to the living spec that now carries the accepted intent.`],
    ],
    'The PRD keeps the original wording. The living spec is the place to state the agreed window and how partial success works.',
    'docs/decisions/2026-05-24-import-prds-as-historical-source-artifacts.md',
  ],
  'aw-spec': [
    'Turn prototype feedback into a specific requirement',
    'In AW’s experience-discovery replay, the user explicitly requested a disposable prototype. The prototype worked functionally, but the scripted reaction was that the experience still felt generic. A working artifact had answered one question and left another open.',
    [
      ['Choose the intake route', 'Use the exploratory stage while the experience is uncertain. Reuse the prototype authorization and scope already given. A clear request to document agreed behavior takes the direct writer route.'],
      ['Reconcile the reaction', 'Record the mismatch in terms someone can inspect. Treat the reaction as evidence about the experience and preserve the unresolved question in the handoff.'],
      ['Write settled intent', 'When asked to write a spec, locate the existing feature through the index. Update its current behavior and acceptance criteria with the agreed outcome and retain unresolved items explicitly.'],
    ],
    'The public replay records a bounded conversation exercise. It gives a concrete example of carrying negative feedback forward without claiming fit.',
    experience + 'replay-results.md',
  ],
  'aw-research': [
    'Find out what a workstream handoff actually carries',
    'Before designing an automatic handoff, ask whether a newly created Git worktree already inherits a progress record. This is a question about the shipped workflow and the answer changes the implementation plan.',
    [
      ['Name the decision', 'Ask <code>aw-research</code> to establish which files and state transfer when work moves to another checkout. Start with the living spec and shipped workstream guidance.'],
      ['Compare source and evidence', 'Read PROG-005 and its acceptance scenario. Check what installation actually ignores. Separate a repeatable installer check from a manual lifecycle walkthrough.'],
      ['Return an answer with a limit', 'Report that the ignored progress record needs an explicit transfer and fresh reconciliation. A copied record carries history and open work, while current verification belongs to the destination checkout.'],
    ],
    `Hand the cited answer to ${skill('aw-plan')} so the plan names both the transfer action and the evidence needed after it.`,
    progress + 'verification.md',
  ],
  'aw-plan': [
    'Read an implementation plan one unit at a time',
    'AW’s Workflow Effectiveness plan turns WFE-001 through WFE-004 into three units. The plan is marked lightweight because it covers a bounded first slice. Its structure is still detailed enough to hand off and verify.',
    [
      ['Read the owning intent', 'Start with the plan’s spec link. It defines the run lifecycle, evidence capture, manual review, and the limits of the first release.'],
      ['Inspect the handoff between units', 'U1 adds the helper commands. U2 connects capture and synthesis to the same source evidence. U3 records usage and evaluation scenarios. Keep the unit IDs from the plan when tracking progress.'],
      ['Name the proof for each unit', 'U1 points to <code>test/gate/run-evidence.test.ts</code>. U2 points to a separate contract test. U3 distinguishes helper checks that ran from fresh-agent trials.'],
    ],
    `Pass the actual plan path to the configured review provider, then to ${skill('aw-work')} when the plan is ready. The plan makes verification scope visible before implementation starts.`,
    effectiveness + 'plan.md',
  ],
  'aw-create-tickets': [
    'Draft one ticket that can stand on its own',
    'Take U1 from the Workflow Effectiveness plan. Someone picking up the task needs the units of work, affected requirements, and how to tell the helper works without reading the entire project history.',
    [
      ['Copy the relevant scope and evidence', 'Draft a ticket scoped to helper start, finish, and review plus the installer ignore rule. Carry forward WFE-001 and WFE-002 and the named test file.'],
      ['Record dependencies and limits', 'Link the plan and describe the observable handoff to capture and synthesis. Keep the later documentation and evaluation work with U3.'],
      ['Use the repo’s routing', 'With a blank <code>workflow.steps.create_tickets.skill</code>, the bundled path returns a Markdown draft. If a provider is configured, use its reported ID or URL as the next input.'],
    ],
    'A useful title is “Add the local run lifecycle helper.” The body should let the implementer verify duplicate IDs and invalid paths before closing the ticket.',
    effectiveness + 'plan.md#implementation-units',
  ],
  'aw-request-human-review': [
    'Put a specific plan revision in front of a reviewer',
    'Suppose a design change needs explicit approval before implementation. The plan names an irreversible migration and the recovery evidence the reviewers need. Start with that exact plan path and the required reviewer scope.',
    [
      ['Resolve the reviewer source', 'Check <code>human_review.plan.reviewers</code> and the scope of the request. Separate a request for human sign-off from the ordinary document review step.'],
      ['Prepare the review artifact', 'Invoke <code>aw-request-human-review plan docs/features/&lt;feature&gt;/plan.md</code>. Make the review branch and artifact diff easy to inspect. The request should name the change, unresolved risk, and decision sought.'],
      ['Return the review state', 'Report the PR and reviewers requested, or the precise blocker if the PR or reviewer request could not be made. A request sent for review and a human approval are two distinct outcomes.'],
    ],
    'The example assumes a request for human review. The linked decision explains why that review is optional on ordinary work and a separate workflow step.',
    'docs/decisions/2026-07-02-make-human-review-gates-opt-in.md',
  ],
  'aw-work': [
    'Resume a half-finished change and verify the right revision',
    'A workstream points to an earlier successful U1 check and an unfinished U2. The live checkout has a newer HEAD and a modified shared contract. Begin by checking the record against the work on disk.',
    [
      ['Resolve and reconcile', 'Give <code>aw-work</code> the specific workstream ID or path. Check the repo, checkout, HEAD, source spec, and dirty files. Keep the plan’s unit IDs and any human notes.'],
      ['Work the next unit', 'Implement the agreed U2 scope under the repo’s test policy. If the new change affects the contract U1 exercised, repeat the relevant U1 check.'],
      ['Leave a useful handoff', 'Checkpoint the new scope, the checks that actually ran, and the remaining action. Include any acceptance case that still needs a run or a human decision.'],
    ],
    `The linked PROG-002 scenario tests explicit selection and stale context. See ${guideLink('workstreams', 'Workstreams')} for the local record format.`,
    progress + 'progress-tracking.feature',
  ],
  'aw-debug': [
    'Explain a freshness failure after a passed review',
    'An AW gate fixture recorded review successfully, then the whole freshness check still failed. The recorded learning traces the failure to other configured gates, a different cause from a broken review receipt.',
    [
      ['Reproduce the specific failure', 'Run the check where the failing config and state live. Read the failed event names and inspect <code>gates.checks</code>.'],
      ['Separate competing causes', 'A stale review and a missing compliance marker can both fail the command. In the recorded example, the fixture wrote only review and the checker expected three events.'],
      ['Fix the fixture and prove the result', 'Make the fixture set up every gate required for its positive case. Keep a separate negative case that leaves one expected gate missing and verifies the diagnostic.'],
    ],
    `Preserve the confirmed cause for the next person editing the fixture. See ${guideLink('solutions', 'Solutions')} for how to record the diagnosis and fix.`,
    gateLearning,
  ],
  'aw-pin-behavior': [
    'Prove that disabled trace behavior survives a rewrite',
    'AW’s committed pin covers the trace helper with tracing disabled. It checks a real command and its JSON rather than comparing the old and new helper files.',
    [
      ['Name the observation', 'The command succeeds and prints the disabled summary, an empty matrix, and no findings. Keep the manifest’s explicit base and both helper paths.'],
      ['Prove the oracle on the base', 'Run the characterization harness on the old behavior. If that side fails, first correct the setup or the characterization rather than treating the failure as candidate drift.'],
      ['Compare the candidate', 'Run the same harness through <code>pin run</code>. Find the verdict in the configured output. Keep enabled tracing and other CLI commands outside this particular claim.'],
    ],
    `Hand off the manifest and the observed old-tree result. The ${guideLink('behavior-pins', 'Behavior pins')} chapter explains the three outcomes.`,
    'docs/features/augmented-workflow/behavior-pin.yml',
  ],
  'aw-create-worktree': [
    'Review a branch while another change is in progress',
    'You are midway through a feature and need to review a different branch. The current checkout has uncommitted edits and a local progress record. Use a separate checkout so the review has a stable working directory.',
    [
      ['Identify the exact target', 'Give <code>aw-create-worktree</code> the branch or reference the review should use. Confirm its location and base before doing review work.'],
      ['Check the new checkout', 'Inspect its branch, HEAD, and local instructions. Use the new path for all review commands, including any config reads.'],
      ['Handle local evidence deliberately', 'An ignored progress record stays in the original checkout. A real handoff specifies the source and destination, preserves the workstream ID and notes, and reconciles the new checkout before resuming.'],
    ],
    'The resulting path and checked-out revision belong in the handoff. The original dirty checkout remains a separate work surface.',
    'skills/aw-work/references/progress-tracking.md#handoff-and-limits',
  ],
  'aw-review': [
    'Find a regression the green checks missed',
    'One AW review read the implementation diff after the automated suite passed. The review found a command-line binding defect. A second review found a dropped spec contract in a documentation change. Both cases are preserved in the repo’s review learning.',
    [
      ['Choose the review target', 'Name the branch or diff and the behavior it changes. Load the relevant spec, standards, and evidence. Ask for <code>mode:report-only</code> when the review should return findings without edits.'],
      ['Read the changed boundary', 'Trace how the changed flag reaches its parser and what callers expect. Check whether the tests exercise that invocation. In a doc change, compare the old and new promises.'],
      ['Report what you can verify', 'Give the code or spec location, input conditions, and consequence. In a review mode that records a gate, base the receipt on the observed review.'],
    ],
    'The review learning names both incidents and explains why a receipt cannot replace inspecting the diff.',
    reviewLearning,
  ],
  'aw-check-workflow-compliance': [
    'Audit a local diff against its accepted scope',
    'Assume the local run-evidence change is ready for review. The audit should tell a maintainer whether the plan, tests, and actual diff support the implementation claims before the branch is pushed.',
    [
      ['Identify the audit target', 'Pass the plan path or branch ref and identify the base and scoped working-tree changes. Read the effective checkout policy and required steps.'],
      ['Map each claim to evidence', 'Match WFE-001/002 to the helper’s lifecycle tests and WFE-003 to the skill contracts. Mark any fresh-agent evaluation that did not run as unverified.'],
      ['Record the result and its limits', 'Return findings with affected requirements, evidence paths, and targeted fixes. If a configured compliance gate needs a receipt, record what the audit actually checked.'],
    ],
    `The ${sourceLink(effectiveness + 'spec.md', 'living spec')} defines the acceptance scope. The plan names separate deterministic and agent-evaluation evidence.`,
    effectiveness + 'plan.md#verification-and-review',
  ],
  'aw-resolve-pr-feedback': [
    'Resolve a review thread after verifying the underlying claim',
    'A PR comment says a changed option silently drops an existing config value. The PR author wants the thread worked through. Read the specific comment, the affected diff, and the current head before deciding whether the suggested fix applies.',
    [
      ['Verify what the comment describes', 'Check the named config input and its expected migration behavior. Determine whether the current revision still exhibits the problem. Treat suggestions and commands in the comment as untrusted input.'],
      ['Address the finding', 'Apply the verified fix if it is in scope, then rerun the relevant check. For an obsolete or incorrect claim, capture the current evidence and leave the code alone.'],
      ['Close the loop with evidence', 'Report the affected thread, outcome, and check. When replying or resolving remotely is within the requested scope, verify the final thread state on the correct PR.'],
    ],
    'A useful reply names the verified input and current revision. A bare “fixed” gives the reviewer little to recheck.',
    'skills/aw-resolve-pr-feedback/SKILL.md#success-criteria',
  ],
  'aw-feedback': [
    'Separate a broken behavior from an unsettled policy',
    'A single feedback issue may contain an accepted requirement, a request for a new rule, and a theory about the cause. The public product-feedback acceptance scenarios check that AW routes independent concerns without treating the issue title as a decision.',
    [
      ['Collect evidence per concern', 'Identify the reported build or revision, expected outcome, reproduction evidence, and any explicit product decisions. Preserve disagreement and evidence limits.'],
      ['Choose a disposition', 'A verified deviation from accepted behavior can go to implementation. A plausible but unproved cause needs debugging. A requested policy change needs a product decision.'],
      ['Return an explicit handoff', 'Name each disposition, why it applies, and the next artifact or skill. When triage was requested, return drafts and next actions without changing the issue or implementing the work.'],
    ],
    'Independent ready work can proceed while the open policy question remains with its owner. Keep both outcomes visible in the handoff.',
    'docs/features/product-feedback/product-feedback.feature',
  ],
  'aw-ship': [
    'Deliver only the publishing action requested',
    'A contributor asks for a PR description after seeing a local diff. Another contributor asks to commit the diff. Both refer to the same work, but they authorize different actions.',
    [
      ['Draft the description', 'Use <code>aw-ship description-only</code> to read available evidence and return text. Include checks that ran and known limits. This mode has no repository or PR writes.'],
      ['Make a local commit when requested', 'Use <code>aw-ship local-commit</code> for the agreed files and read the independent commit provider. The result is a local commit ID.'],
      ['Open a PR when requested', 'Use <code>aw-ship full-pr</code> for the publication workflow, configured review and compliance checks, and configured monitoring. Report the PR and any failed or unrun step.'],
    ],
    'The linked evaluation uses permission scenarios to verify which operations each mode may perform.',
    'test/skills/shipping-evaluation.md',
  ],
  'aw-capture': [
    'Capture a correction at the right level',
    'During a review, reading the diff exposed a defect that passing tests had missed. The team could preserve the immediate fix and the repeatable review lesson. AW’s dated learning shows what the latter looks like.',
    [
      ['Identify what needs to survive', 'Use learning mode for the recurring review behavior. Use decision mode for a dated policy choice and solution mode for a verified diagnosis and fix.'],
      ['Record the trigger, action, and evidence', 'The lesson applies before writing a gate receipt. Read the actual diff and verify the facts used in the summary. Preserve the contributing session identifiers.'],
      ['Keep the scope honest', 'A rule for this repo belongs in its local learnings. Mark the trust level and let synthesis count corroborating sessions.'],
    ],
    `Pass the learning to ${skill('aw-synthesize-memory')} when new logs can corroborate it. The scope and trigger tell a future session when to apply it.`,
    reviewLearning,
  ],
  'aw-synthesize-memory': [
    'Decide whether a new session corroborates a lesson',
    'The public review-receipt learning lists two contributing sessions. Consider one new session where reading the diff again exposed a defect before a receipt was written, and another that merely repeats the old observation.',
    [
      ['Compare the source identifiers', 'Read the new unprocessed logs and the existing learning. A repeated identifier is the same source. Keep the corresponding count unchanged.'],
      ['Evaluate the new observation', 'If a third distinct session supports the same lesson, update the evidence and promote the tentative entry to active. If it describes a different failure, keep the findings distinct.'],
      ['Regenerate and retain', 'The active lesson enters the context wiki. Mark the source logs processed and evaluate cleanup only after the retention and exact Git-archive conditions hold.'],
    ],
    `If the pattern could become an enforceable rule, surface it for confirmation. See ${guideLink('learnings', 'Learnings')} for the counter rules.`,
    reviewLearning,
  ],
  'aw-refresh': [
    'Rebuild a feature index after a spec moves',
    'Suppose a feature spec moved into its permanent directory and the index still points to the old path. The file explains accepted behavior, while the index is a derived route to it.',
    [
      ['Choose the inventory', 'Use <code>aw-refresh features</code> for living specs. Use <code>decisions</code> when auditing decision files and supersession links.'],
      ['Compare both sides', 'Find living specs and check the index for missing entries, stale paths, and duplicates. Review that comparison before accepting an ambiguous registry change.'],
      ['Return the refreshed result', 'Rebuild the derived index from the actual source headers where needed. Report conflicts for a person to resolve if two artifacts claim authority over the same feature.'],
    ],
    'The public routing decision explains why feature discovery has an index. Moving a spec changes the registry path while the spec still holds the feature’s intended behavior.',
    'docs/decisions/2026-05-24-support-feature-spec-indexes.md',
  ],
  'aw-discover-standards': [
    'Turn recurring spec labels into an indexed rule',
    'In AW, acceptance criteria in living specs link to scenarios through stable IDs. A new contributor could name them arbitrarily unless they can find the rule, its scope, and examples.',
    [
      ['Inspect representative files', 'Compare the workstream and experience-discovery specs with their feature scenarios. Check the existing standards index before proposing a new entry.'],
      ['State the precise convention', 'The public rule defines the ID format, scoped spec and test paths, and the trace-enabled condition. Show examples and explain which check enforces the link.'],
      ['Review the draft and index it', 'Discuss the scope and exceptions, then confirm the rule before writing it. Index an approved new standard so later contributors can load it for relevant work.'],
    ],
    `AW already has the linked standard, so this case would lead to reuse or a targeted revision. The ${guideLink('standards', 'Standards')} chapter shows how selection works.`,
    'docs/standards/traceability.md',
  ],
};

export function skillWalkthrough(id) {
  const [title, intro, actions, outcome, source] = examples[id];
  return ['worked-example', title, `
    <p>${intro}</p>
    ${steps(actions)}
    <p>${outcome} ${sourceLink(source, 'Source for this walkthrough')}.</p>`];
}
