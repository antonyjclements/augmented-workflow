const publicSource = 'https://github.com/antonyjclements/augmented-workflow/blob/8f46885b4a89c9ff872b4e0290f21123614929e4/';
export const guideLink = (id, label = id) => `<a href="?page=${id}">${label}</a>`;
export const skill = id => guideLink(id, `<code>${id}</code>`);
export const sourceLink = (path, label) => `<a href="${publicSource}${path}">${label}</a>`;
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function sourceExcerpt(path, snippet) {
  const lines = snippet.split('\n').map(line => {
    const field = /^(\s*(?:- )?)([\w-]+:)(.*)$/.exec(line);
    if (field) {
      const [, indent, key, value] = field;
      return `${indent}<span class="code-key">${key}</span><span class="code-value">${escape(value)}</span>`;
    }
    if (line.startsWith('…')) return `<span class="comment">${escape(line)}</span>`;
    if (/^#/.test(line)) return `<span class="code-key">${escape(line)}</span>`;
    if (/^\s+- /.test(line)) return `<span class="code-value">${escape(line)}</span>`;
    return escape(line);
  });
  return `<figure class="command source-excerpt"><figcaption>${sourceLink(path, path)}</figcaption><pre tabindex="0"><code>${lines.join('\n')}</code></pre></figure>`;
}

export function steps(items) {
  return `<ol class="concept-steps">${items.map(([title, body]) =>
    `<li><div><strong>${title}</strong><p>${body}</p></div></li>`
  ).join('')}</ol>`;
}

export function note(label, body, pose) {
  const icon = pose
    ? `<img data-guide-wren="${pose}" src="assets/wren/wren-${pose}.png" width="48" height="48" alt="">`
    : '<span class="fold-symbol" aria-hidden="true">!</span>';
  return `<aside class="concept-note${pose ? '' : ' fold-warning'}">${icon}<div><strong>${label}</strong><p>${body}</p></div></aside>`;
}

export function theory(text, id = 'evidence', label = 'Evidence, not encoding') {
  return { title: 'Theory link', text, href: '?page=' + id, label };
}

const orgGuide = sourceLink('docs/workflow/org-knowledge.md', 'Organization knowledge governance');
const featureIndex = 'docs/features/index.yml';
const standardsIndex = 'docs/standards/index.yml';

export const artifactConcepts = {
  'living-specs': {
    intro: 'A living spec says what a feature is for, who relies on it, and how it behaves today. When the team accepts a change in behavior, the spec changes with it.',
    topic: 'Intent', life: 'Living', wren: 'alert',
    meta: ['Lives in <code>docs/features/&lt;feature&gt;/spec.md</code>', 'Registry <code>docs/features/index.yml</code>'],
    writer: skill('aw-spec'), reader: [skill('aw-plan'), skill('aw-work'), skill('aw-review')].join(', '),
    aside: theory('Living specs preserve the <em>purpose</em> and current behavior of a feature.'),
    aliases: { 'worked-example': 'intent-versus-plan', 'file-and-coverage': 'the-feature-index' },
    sections: [
      ['what-a-spec-holds', 'What a spec holds', `
        <p>Start with who relies on the feature and what they need to accomplish. Describe the current behavior, the important flows and their failure cases, and the observable outcomes that count as acceptance. Record scope boundaries and keep questions open when the team has yet to settle them.</p>
        <p>For an order cancellation feature, for example, the spec could say the customer can cancel until fulfillment begins, define which event marks that boundary, and give one acceptance case on either side. A ${guideLink('plans', 'plan')} can sequence the API and UI changes. A ${guideLink('decisions', 'decision')} can capture why that particular fulfillment event governs eligibility.</p>`],
      ['intent-versus-plan', 'Intent versus plan', `
        <p>${skill('aw-spec')} establishes what the feature should do. ${skill('aw-plan')} works out how to deliver a particular change. ${skill('aw-work')} executes against that intent and verifies the result. After delivery, the plan is a record of how the work was organized. The spec still guides the next change.</p>
        <p>The public Experience Discovery spec makes its purpose explicit before it describes the workflow. Its users and acceptance scenarios give authors a way to tell whether a workflow change still lets people correct an agent's interpretation before implementation.</p>
        ${sourceExcerpt('docs/features/experience-discovery/spec.md', `---
title: Experience Discovery
status: active
created: 2026-09-08
updated: 2026-09-08
tags:
  - discovery
  - human-experience
  - prototyping
related_decisions: []
---

# Experience Discovery

## Intent

Help people inspect and correct an agent's interpretation of an intended human
experience before investing in implementation.

… Further sections include Users, Current Behavior, Key Flows, and Acceptance Criteria.`)}`],
      ['how-a-spec-gets-written', 'How a spec gets written', `
        <ul>
          <li><strong>Direct intake.</strong> Use the direct route for clear requirements, a concrete correction to an existing spec, or a request to document established behavior. Ask when an unresolved choice changes the promise or blocks a faithful write.</li>
          <li><strong>Exploratory intake.</strong> Use discovery when more than one interpretation would materially change the feature. Record what the user agreed to and which questions remain. A request to explore can end with findings. A spec follows when the user has authorized documenting settled intent.</li>
        </ul>
        <p>Both routes check <code>${featureIndex}</code> for an existing spec. Reconcile what the code and tests demonstrate with the accepted intent. Preserve an external PRD through ${skill('aw-prd')} under <code>docs/product/prds/</code>. Promotion records <code>status: promoted</code> and <code>promoted_to</code> on the PRD, leaving its original body available as provenance.</p>`],
      ['the-feature-index', 'The feature index', `
        <p>Give each feature a stable home. The registry lets later sessions find the living spec by feature without surveying every plan and archived artifact. Test scenarios and behavior pins can live nearby when they belong to the feature.</p>
        <pre class="tree" tabindex="0"><code>docs/features/
├── <mark>index.yml</mark>  <span>← feature registry</span>
├── augmented-workflow/
│   ├── spec.md
│   ├── plan.md
│   └── behavior-pin.yml
├── experience-discovery/
│   ├── spec.md
│   └── experience-discovery.feature
└── workflow-effectiveness/
    ├── spec.md
    └── plan.md</code></pre>
        <p>Run <code>aw-refresh features</code> to reconcile the registry with the living specs when entries are missing or paths have moved. Where traceability is enabled, stable acceptance IDs connect the spec to test and behavior anchors. ${guideLink('spec-traces', 'Follow a spec trace')}.</p>`],
      ['keeping-it-current', 'Keeping it current', `
        <ul>
          <li>${skill('aw-plan')} uses the matching spec to carry users, flows, acceptance criteria, and open questions into the delivery plan.</li>
          <li>${skill('aw-work')} checks ticket scope against the spec and surfaces conflicts before implementing them.</li>
          <li>${skill('aw-review')} assesses affected specs for stale intent, implementation drift, or a missing decision and can record that a spec is current.</li>
          <li>${skill('aw-check-workflow-compliance')} checks affected specs and the index as part of the configured audit.</li>
        </ul>
        ${note("Wren's note", 'Keep open questions visible. A future contributor needs to know which behavior the team agreed to and which behavior still needs an answer.', 'alert')}`],
    ],
    related: [['plans', 'Plans'], ['decisions', 'Decisions'], ['experience-discovery', 'Experience discovery'], ['aw-spec', 'aw-spec'], ['aw-prd', 'aw-prd'], ['aw-refresh', 'aw-refresh']],
  },
  plans: {
    intro: 'A plan turns accepted intent into a sequence of work someone can implement and verify. It serves one delivery.',
    topic: 'Intent', life: 'Expires', wren: 'gathering',
    meta: ['Lives in <code>docs/features/&lt;feature&gt;/plan.md</code>'],
    writer: skill('aw-plan'), reader: [skill('aw-create-tickets'), skill('aw-work')].join(', '),
    aside: theory('A plan preserves the approach for a particular change. The <em>purpose</em> lives in the spec.'),
    aliases: { 'worked-example': 'what-goes-in-a-plan', handoff: 'from-units-to-tickets' },
    sections: [
      ['why-plans-expire', 'Why plans expire', `
        <p>A plan assumes a starting point. It may depend on an older API, an intermediate migration state, or a compatibility path that was removed at the end of delivery. Reusing the sequence later can bring those assumptions back into a different change.</p>
        <p>When a delivery ends, update the ${guideLink('living-specs', 'living spec')} with accepted behavior and capture consequential tradeoffs as ${guideLink('decisions', 'decisions')}. Use the old plan to understand the history of that delivery. A completed plan can remain in the repo until deliberately archived.</p>`],
      ['what-goes-in-a-plan', 'What goes in a plan', `
        <p>State the problem and scope. Link the spec or other source and name the acceptance criteria affected. Record existing patterns and applicable standards before describing work units. For each unit, give a goal, the relevant paths and dependencies, the expected contract or behavior, and the check and scenarios that will prove it. Make failure cases and rollout constraints explicit when they determine ordering.</p>
        <p>Choose lightweight, standard, or deep planning based on risk and coordination. Use a ${guideLink('workstreams', 'workstream')} or the ticket tracker for execution checkpoints. The example below ties a narrow helper change to three units and names the tests and evaluation cases that belong to each.</p>
        ${sourceExcerpt('docs/features/workflow-effectiveness/plan.md', `---
status: completed
created: 2026-11-06
origin: user-request
spec: docs/features/workflow-effectiveness/spec.md
depth: lightweight
---
# Local evidence and manual improvement review

… Scope, requirements, applicable standards, and decisions.

## Implementation Units
- U1: helper start/finish/review commands and installer ignore rule (WFE-001/002).
  \`test/gate/run-evidence.test.ts\`: lifecycle, collisions, parallel IDs, invalid
  fields and paths, symlinks, evidence sections, empty capture, missing/changed/
  archived source, immutable terminal runs, tracking-disabled, no shell execution.
- U2: capture provenance and opt-in synthesis review (WFE-002/003).
  \`test/skills/run-evidence-contract.test.ts\`: lazy routing, early real source,
  reuse at wrap-up, active/uncommitted retention, proposal and approval boundaries.
- U3: usage and frozen evaluation scenarios (WFE-004).
  \`test/skills/run-evidence-cases.json\` and \`run-evidence-evaluation.md\` distinguish
  executed helper checks from fresh-agent trials; no behavioral claim without runs.`)}`],
      ['from-units-to-tickets', 'From units to tickets', `
        <p>A ticket should carry the part of the plan the implementer needs, including the unit's scope, verification, and links back to the spec, plan, relevant decisions, and standards. Set <code>workflow.steps.create_tickets.skill</code> to delegate to a tracker provider. The public default, ${skill('aw-create-tickets')}, drafts tickets from the planning material.</p>
        ${steps([
          ['Spec', `${skill('aw-spec')} records the durable intent and acceptance criteria.`],
          ['Plan', `${skill('aw-plan')} writes the work sequence to <code>docs/features/&lt;feature&gt;/plan.md</code>.`],
          ['Tickets (optional)', `${skill('aw-create-tickets')} turns units into drafts or hands off to the configured provider.`],
          ['Work', `${skill('aw-work')} implements the plan or ticket and verifies the covered behavior.`],
          ['Expire', 'Once delivered, use the spec for current behavior and the decision log for the choices that still matter.'],
        ])}`],
      ['deepening-a-plan', 'Deepening a plan', `
        <p>Use the confidence check when a weak assumption could change the delivery. Look for missing requirements or trace links, units without a verifiable outcome, untested edges, and gaps in compatibility, rollout, or migration. Deepen the sections that need stronger evidence or a clearer choice.</p>
        <p>When pre-implementation sign-off is required by risk, configuration, or the user, ${skill('aw-request-human-review')} can take <code>plan &lt;plan path&gt;</code> and request the reviewers configured under <code>human_review.plan.reviewers</code>.</p>
        ${note('Watch the fold', 'If a unit depends on an unanswered product question, identify that question before turning a guess into an implementation requirement. Record the answer with the living intent once it is settled.')}`],
    ],
    related: [['living-specs', 'Living specs'], ['workstreams', 'Workstreams'], ['replaceable-steps', 'Replaceable steps'], ['aw-plan', 'aw-plan'], ['aw-create-tickets', 'aw-create-tickets'], ['aw-work', 'aw-work']],
  },
  decisions: {
    intro: 'A decision record keeps a consequential choice and the reasons it made sense at the time. Later contributors can see which circumstances would justify revisiting it.',
    topic: 'Evidence', life: 'Immutable', wren: 'alert',
    meta: ['Lives in <code>docs/decisions/</code>', 'Registry <code>docs/decisions/index.yml</code>'],
    writer: skill('aw-capture'), reader: [skill('aw-plan'), skill('aw-work'), skill('aw-review')].join(', '),
    aside: theory('Decisions preserve the <em>tradeoffs</em> behind the shape of a system.'),
    aliases: { 'worked-example': 'anatomy-of-a-record', supersede: 'superseding-a-decision' },
    sections: [
      ['why-decisions-get-their-own-file', 'Why decisions get their own file', `
        <p>A living spec changes as accepted behavior changes. A decision records the context, date, and tradeoff that explain a particular choice. The code may show that the team kept a command name through a rebrand. The record explains which users might have been affected by changing it and why compatibility mattered.</p>
        <p>Keeping the rationale in a dated file lets a later contributor compare the original constraints with the ones that hold today. Link from a related spec so future readers can get there from the behavior the choice shaped.</p>`],
      ['when-to-record-one', 'When to record one', `
        <p>Capture a choice when it settles a genuine ambiguity or changes a durable expectation about product behavior, architecture, an API, testing, or workflow. Use ${skill('aw-capture')} in decision mode when a user asks to record the outcome or the team needs to preserve why it settled on one approach.</p>
        <p>A correction may produce two useful records. If the team chooses a new compatibility policy, capture the policy choice as a decision. If the investigation exposes a recurring agent mistake, write a ${guideLink('learnings', 'learning')} describing what to check in the next session.</p>`],
      ['anatomy-of-a-record', 'Anatomy of a record', `
        <p>The frontmatter gives the index a title, date, status, tags, and related specs. The body explains the context, the decision, and the consequences. Include the alternatives that mattered and enough rationale to preserve what drove the choice.</p>
        ${sourceExcerpt('docs/decisions/2026-07-24-rebrand-as-augmented-workflow.md', `---
title: Rebrand as Augmented Workflow
date: 2026-07-24
status: active
tags:
  - workflow
  - branding
  - installer
  - documentation
related_specs:
  - docs/features/augmented-workflow/spec.md
---

# Rebrand As Augmented Workflow

… Context and decision details.

Keep the \`aw-*\` skill namespace. The initials still match the canonical product
name, and preserving command names avoids a broad compatibility break.`)}
        <p>The same record explains which installer markers and environment variables changed, plus how existing installations could migrate while retaining user-owned configuration.</p>`],
      ['superseding-a-decision', 'Superseding a decision', `
        <p>When the team changes its mind, write a new record and list the older decision under <code>supersedes</code>. Refresh the index so readers can find the current choice and follow its predecessors. Each older file still explains why earlier work took its shape.</p>
        <figure class="decision-history">
          <ol>
            <li><time datetime="2026-03-02">2026-03-02</time><strong>Poll the sync API every minute</strong><p>Polling was simple at the initial scale of hundreds of clients.</p><span>Superseded</span></li>
            <li><time datetime="2026-06-18">2026-06-18</time><strong>Push sync over WebSockets</strong><p>Repeated polling had become expensive as the client count grew.</p><span>Superseded</span></li>
            <li><time datetime="2026-10-09">2026-10-09</time><strong>Use webhooks with a polling fallback</strong><p>Some customer proxies dropped persistent WebSocket connections.</p><span>Active</span></li>
          </ol>
          <figcaption>Illustrative decision chain. Each successor names the decision it replaces.</figcaption>
        </figure>`],
      ['where-it-lives', 'Where it lives', `
        <p>Use a dated slug under <code>docs/decisions/</code>. The index is the first stop for a search by feature, date, status, or tag.</p>
        <pre class="tree" tabindex="0"><code>docs/decisions/
├── <mark>index.yml</mark>  <span>← derived decision registry</span>
├── 2026-05-24-add-human-review-gates-for-specs-and-plans.md
├── 2026-05-24-proactively-prompt-for-knowledge-capture.md
└── 2026-07-24-rebrand-as-augmented-workflow.md</code></pre>
        <p><code>aw-refresh decisions</code> reads the records and updates the index. The extracted fields include <code>related_specs</code>, <code>supersedes</code>, and <code>superseded_by</code> when present. It reports inconsistent chains, including superseded choices still indexed as active.</p>`],
      ['how-agents-use-them', 'How agents use them', `
        <ul class="concept-roles">
          <li><strong>${skill('aw-plan')}</strong>Find relevant choices before proposing a change that assumes they still hold.</li>
          <li><strong>${skill('aw-work')}</strong>Pause when a ticket conflicts with a recorded decision and surface the specific conflict.</li>
          <li><strong>${skill('aw-review')}</strong>Flag a missing decision when a consequential change would leave a future contributor to infer the reason from a diff.</li>
        </ul>
        ${note("Wren's note", 'Would a later contributor have to guess why you chose this approach? Record the constraint or tradeoff that made the choice reasonable at the time.', 'alert')}`],
    ],
    related: [['living-specs', 'Living specs'], ['learnings', 'Learnings'], ['replaceable-steps', 'Replaceable steps'], ['aw-capture', 'aw-capture'], ['aw-refresh', 'aw-refresh']],
  },
  learnings: {
    intro: 'A learning turns a correction into guidance a later session can apply. It records when the lesson matters, what to do, and the evidence that supports it.',
    topic: 'Memory', life: 'Reusable', wren: 'gathering',
    meta: ['Repo <code>docs/learnings/</code>', 'Global <code>~/.agents/learnings/</code>'],
    writer: [skill('aw-capture'), skill('aw-synthesize-memory')].join(', '),
    reader: 'Skills via <code>docs/learnings/index.yml</code> and the context wiki',
    aside: theory('Learnings keep the <em>lessons</em> people acquire while working on a system.', 'theory-decay', 'Why theories decay'),
    aliases: { 'worked-example': 'anatomy-of-a-learning', freshness: 'earning-trust' },
    sections: [
      ['from-correction-to-lesson', 'From correction to lesson', `
        <p>Apply a correction to the work first. If the same assumption could trip up another session, ${skill('aw-capture')} can turn it into a learning. Give it a trigger the next contributor can recognize, an action they can take, and evidence they can check. A one-off choice may belong in the ${guideLink('decisions', 'decision log')}, and a routine clarification may only need to be reflected in the current work.</p>
        <p>A review receipt is a useful example. A contributor can write a fresh receipt based on memory, even though it is meant to describe an inspected diff. The learning below points future reviewers to the exact moment to read the diff and record what they verified.</p>`],
      ['anatomy-of-a-learning', 'Anatomy of a learning', `
        <p>The frontmatter gives the learning a scope, status, and evidence history. The body explains the <strong>Lesson</strong>, names when it <strong>Applies</strong>, and spells out what to <strong>Do Instead</strong>. The <strong>Evidence</strong> section gives a later contributor a way to judge the guidance.</p>
        ${sourceExcerpt('docs/learnings/2026-07-27-review-the-diff-before-stamping-the-gate.md', `---
title: Review the diff before stamping the gate, not after
scope: repo
created: 2026-07-27
trigger: correction
status: tentative
evidence-count: 2
unconfirmed-runs: 1
derived-from:
  - 2026-07-26-e2e-suggest-flag-2
  - 2026-07-27-augmented-workflow-evaluation-fixes
tags:
  - workflow
  - review
  - enforcement
---

# Review the diff before stamping the gate, not after

## Lesson

The freshness gate records that review happened; it cannot tell whether the review
was any good. A receipt is checked for recency and a non-empty summary, not for
truth — an inaccurate summary stamps just as cleanly as an accurate one.`)}
        <p>Read the diff before writing the summary and verify any counts or status claims as you write. The two cited sessions include a command-line binding error and a dropped spec contract. Both survived the automated checks and were caught during actual diff review.</p>`],
      ['earning-trust', 'Earning trust from tentative to active', `
        <p>${skill('aw-synthesize-memory')} checks tentative learnings against new session evidence. A pattern with one or two supporting sessions starts tentative. At three distinct sources, it becomes active. A new pattern already supported by three sessions in the same batch can start active.</p>
        <table class="learning-fields">
          <thead><tr><th scope="col">Field</th><th scope="col">How synthesis uses it</th></tr></thead>
          <tbody>
            <tr><th scope="row"><code>evidence-count</code></th><td>Count distinct corroborating session identifiers. At three, promote the learning to <code>active</code>.</td></tr>
            <tr><th scope="row"><code>unconfirmed-runs</code></th><td>Count consecutive runs without corroboration. Reset on new support. At three unconfirmed runs, remove the tentative learning and its index entry.</td></tr>
            <tr><th scope="row"><code>derived-from</code></th><td>Record each distinct supporting session identifier. An already-cited live capture leaves both counters as they were.</td></tr>
          </tbody>
        </table>
        <p>The regenerated <code>docs/context/wiki.md</code> describes active entries under Top Learnings. Its Tentative Learnings section contains only their titles and paths, so unconfirmed guidance takes up little context.</p>`],
      ['repo-global-and-org-scope', 'Repo, global, and org scope', `
        <ul>
          <li><strong>Repo.</strong> Use <code>docs/learnings/</code> for a lesson tied to the codebase, architecture, product, or team workflow.</li>
          <li><strong>Global.</strong> Use <code>~/.agents/learnings/</code> for a stable user preference that applies across repositories. Capture asks before broadening the scope unless the user already made it explicit.</li>
          <li><strong>Organization.</strong> A repo with <code>org_knowledge.source</code> can sync a governed tier and reuse an existing organization-wide lesson. Cross-repo candidates reach that source through a reviewed promotion. ${orgGuide}.</li>
        </ul>`],
      ['promotion-toward-standards', 'Promotion toward standards', `
        <p>A learning can inform judgment across several sessions. When a pattern appears in three or more sessions and can be stated as a checkable repo convention, ${skill('aw-synthesize-memory')} proposes it for ${guideLink('standards', 'standards')}. The user confirms before the rule is written.</p>
        ${note('Watch the fold', 'Cite sessions by identifier, such as <code>2026-07-27-augmented-workflow-evaluation-fixes</code>. Processed logs expire, so a durable learning uses the identifier without a <code>docs/sessions/</code> path.')}`],
    ],
    related: [['session-memory', 'Session memory'], ['standards', 'Standards'], ['decisions', 'Decisions'], ['aw-capture', 'aw-capture'], ['aw-synthesize-memory', 'aw-synthesize-memory']],
  },
  standards: {
    intro: 'A standard is a rule the repo enforces. It comes from evidence in the code, has an index entry, and is loaded when the work falls within its scope.',
    topic: 'Rules', life: 'Enforced', wren: 'perched',
    location: 'docs/standards/',
    meta: ['Lives in <code>docs/standards/</code>', 'Registry <code>docs/standards/index.yml</code>'],
    writer: skill('aw-discover-standards') + ', with your confirmation',
    reader: [skill('aw-plan'), skill('aw-work'), skill('aw-review')].join(', '),
    aside: theory('Standards preserve the <em>constraints</em> people working on this repo need to know.'),
    aliases: { 'worked-example': 'loading-only-what-applies', maintain: 'the-index-is-the-entry-point' },
    sections: [
      ['what-a-standard-is', 'What a standard is', `
        <p>Contributors often learn a repo's conventions through review. Every API route returns the same error shape. Tests use a particular name or fixture. A specific helper wraps a library call. A standard turns one of these expectations into a short, checkable rule with its reason attached.</p>
        <p>A ${guideLink('decisions', 'decision')} records why the team made a choice. A ${guideLink('learnings', 'learning')} tells another session how to respond to a recurring situation. A standard governs how code or artifacts are written in this repo. Agents apply it when relevant and follow higher-priority instructions when they conflict.</p>`],
      ['anatomy-of-a-standard', 'Anatomy of a standard', `
        <p>Write each standard as a Markdown file with frontmatter. Its <code>tags</code> describe the kind of work. Its <code>file-globs</code>, when present, identify paths to consider. The Spec Traceability standard covers both the requirement and files where its verification anchors can appear.</p>
        ${sourceExcerpt('docs/standards/traceability.md', `---
title: Spec Traceability
tags:
  - specs
  - tests
  - workflow
file-globs:
  - "docs/features/*/spec.md"
  - "*.feature"
  - "*.test.ts"
  - "*.test.tsx"
  - "*.spec.ts"
  - "src/**"
---

# Spec Traceability

Rules for opt-in links between living spec requirements, tests, and behavior entry points.`)}
        <p>Lead with the rule, name when it applies, and give enough detail to check it. Include relevant exceptions. This repo's traceability standard, for example, applies its acceptance ID requirements when <code>trace.enabled: true</code>.</p>`],
      ['the-index-is-the-entry-point', 'The index is the entry point', `
        <p>Agents read <code>${standardsIndex}</code>, select entries by path, tag, glob, or domain, then open the matching files. A registry can follow the existing repo schema. Here's a selection from the public AW registry.</p>
        ${sourceExcerpt(standardsIndex, `standards:
  - path: docs/standards/coding-approach.md
    title: Coding Approach
    tags:
      - implementation
      - simplicity
      - code-quality
  # … Spec Traceability omitted from this excerpt.
  - path: docs/standards/behavior-pinning.md
    title: Behavior Pinning
    tags:
      - testing
      - workflow
      - characterization`)}
        <p>${skill('aw-plan')} records applicable standards or explicitly marks them as inapplicable. ${skill('aw-work')} reads the relevant files before editing. ${skill('aw-review')} uses those files to assess the diff, and ${skill('aw-check-workflow-compliance')} uses them to audit the change.</p>
        <pre class="tree" tabindex="0"><code>docs/standards/
├── <mark>index.yml</mark>  <span>← the registry agents read first</span>
├── behavior-pinning.md
├── coding-approach.md
├── e2e-coverage.md
├── guard-verification.md
└── traceability.md</code></pre>`],
      ['loading-only-what-applies', 'Loading only what applies', `
        <p>A feature-spec edit can bring in Spec Traceability and End-to-End Coverage. A rewrite that must preserve observable behavior can bring in Behavior Pinning. A simple prose typo follows the trivial-change route. Selective loading lets teams document a precise convention without adding its full text to every session.</p>
        <p>The public <code>AGENTS.md</code> points contributors to the index and the relevant standards before non-trivial planning, implementation, review, or documentation.</p>`],
      ['discovering-standards-from-the-code', 'Discovering standards from the code', `
        <p>${skill('aw-discover-standards')} reads representative files in a chosen area. It looks for patterns repeated across files, specific to this project, and easy for a careful newcomer to miss. It shows evidence paths for each candidate.</p>
        ${steps([
          ['Pick an area', 'Name a path or domain, or let the skill suggest promising areas from the repo structure.'],
          ['Review candidates', 'Inspect each one-line rule and the paths that demonstrate it. Choose which ones to document.'],
          ['Explain the reason', 'Answer focused questions about why the pattern exists and where exceptions apply.'],
          ['Confirm, write, index', 'Review each draft. On confirmation, write the file and add its registry entry.'],
        ])}`],
      ['org-wide-standards', 'Org-wide standards', `
        <p>Configure <code>org_knowledge</code> in <code>docs/workflow/config.yml</code> to subscribe to a governed source. <code>node .scripts/aw-gate.js org-sync</code> syncs that source into a Git-ignored cache. Standards skills can then use its applicable entries alongside repo-local rules.</p>
        <ul>
          <li><strong>Authority.</strong> Repo instructions and local guidance take precedence over advisory org entries. If a rule marked <code>authority: required</code> conflicts with a local rule, surface the conflict for a human to resolve.</li>
          <li><strong>References.</strong> Link to a convention already documented at the organization level so its owner can maintain it in one place.</li>
          <li><strong>Promotion.</strong> Propose a convention across repositories through a reviewed PR to the organization source. Skills consume that tier read-only.</li>
        </ul>
        <p>${orgGuide}.</p>
        ${note("Wren's note", 'Capture a convention a careful newcomer would still miss. Name the required behavior and the files or work it applies to.', 'perched')}`],
    ],
    related: [['learnings', 'Learnings'], ['session-memory', 'Session memory'], ['gates', 'Gates &amp; receipts'], ['aw-discover-standards', 'aw-discover-standards'], ['aw-review', 'aw-review']],
  },
};
