import {
  conceptsOverview, theoryOpening, theoryDetails, ceremony, startDetails, essayDetails, essayUrl, essayLink, handoffFlow,
} from './field-guide-articles.mjs';
import { artifactConcepts, note } from './field-guide-concepts.mjs';
import { practiceConcepts } from './field-guide-practices.mjs';
import { skillReferences } from './field-guide-skills.mjs';
import { skillWalkthrough } from './field-guide-walkthroughs.mjs';

const repository = 'https://github.com/antonyjclements/augmented-workflow';
const workflow = repository + '/blob/main/docs/workflow/';
const workspaceSource = repository + '/blob/0523ea20727a456d5b993cc22e5ce630c19eae35/docs/workflow/README.md#multi-repository-workspaces';

const workspaces = {
  id: 'workspaces',
  title: 'Workspaces',
  topic: 'Scope',
  wren: 'alert',
  intro: 'AW usually starts in one repo. When a change spans several checkouts, an <code>aw-workspace.yml</code> marker identifies the folder that holds them. Each checkout still supplies its own workflow config, gates, and rules.',
  meta: ['Marker: <code>aw-workspace.yml</code>', 'Helper: <code>.scripts/aw-gate.js workspace</code>'],
  facts: [
    ['Lifespan', '<span class="pill">◆ Per machine</span>'],
    ['Lives in', '<code>aw-workspace.yml</code> in the folder above the repos'],
    ['Written by', 'You, once per workspace folder'],
    ['Read by', '<a href="?page=aw-work">aw-work</a>, <a href="?page=aw-ship">aw-ship</a>, and <a href="?page=aw-check-workflow-compliance">aw-check-workflow-compliance</a>'],
  ],
  aside: {
    title: 'Still one repo?',
    text: 'Without a marker or an explicit override, AW uses the repo where the task starts.',
    href: '#what-changes',
    label: 'What changes in workspace mode',
  },
  sections: [
    ['when-work-spans-repos', 'When work spans repos', `
      <p>The skills read <code>docs/workflow/config.yml</code> for the repo in scope. Picture a local setup with a shell and four micro-frontends under one parent folder. A change to navigation can touch the shell and a frontend, with different checks required in each.</p>
      <p>A workspace gives the task a common starting point. The agent identifies the checkouts involved from the task and verifies their roots with Git. Each repo keeps authority over its own work.</p>`],
    ['marking-the-folder', 'Marking the folder', `
      <p>Put <code>aw-workspace.yml</code> in the folder that holds the checkouts. An empty regular file is enough.</p>
      <pre class="tree"><code>studio/
├── <mark>aw-workspace.yml</mark>  <span>← workspace marker</span>
├── shell/            <span>← its own AGENTS.md and workflow config</span>
└── apps/
    └── frontend/    <span>← its own AGENTS.md and workflow config</span></code></pre>
      <p>The resolver uses the marker’s location. The task determines which repos are involved.</p>`],
    ['checking-with-the-cli', 'Checking it with the CLI', `
      <p>From the parent folder, run the workspace resolver using a checkout that has a workspace-capable AW helper.</p>
      <figure class="command"><figcaption>from the workspace folder</figcaption><pre><code><span class="comment"># Create the marker</span>
touch aw-workspace.yml
node shell/.scripts/aw-gate.js workspace --json
<span class="comment"># With a marker, the output includes mode, workspaceRoot, marker, and source.</span></code></pre></figure>
      <p>The resolver reports what it found. Install the helper with <code>aw-init --with-gates</code> from a version that includes workspace support.</p>`],
    ['how-the-root-is-found', 'How the root is found', `
      <ol>
        <li><strong>Command-line flag.</strong> <code>--workspace-root &lt;dir&gt;</code> selects a folder with a regular marker.</li>
        <li><strong>Environment variable.</strong> <code>AW_WORKSPACE_ROOT</code> supplies the folder when the flag is absent.</li>
        <li><strong>Nearest eligible marker.</strong> With neither option set, AW starts in the invocation directory and walks upwards.</li>
      </ol>
      <p>Relative overrides resolve from the invocation directory. An invalid override fails with a diagnostic.</p>`],
    ['a-walk-with-limits', 'A walk with limits', `
      <ul>
        <li><strong>It crosses Git boundaries.</strong> A marker can sit above several independent checkouts.</li>
        <li><strong>It checks up to 12 parents.</strong> Discovery stops before the home directory or after the filesystem root.</li>
        <li><strong>It checks ownership.</strong> Automatic discovery requires a regular marker owned by the current user. Use an explicit root on platforms without a UID.</li>
      </ul>`],
    ['what-changes', 'What changes in workspace mode', `
      <p><a href="?page=aw-work"><code>aw-work</code></a>, <a href="?page=aw-ship"><code>aw-ship</code></a> in commit and PR modes, and <a href="?page=aw-check-workflow-compliance"><code>aw-check-workflow-compliance</code></a> use the workspace to coordinate the repos touched by the task.</p>
      <p>They read each checkout’s own instructions, run its checks locally, and apply its shipping permissions. With no eligible marker or override, the resolver reports repository mode.</p>`],
    ['worked-example', 'Verify a change across two checkouts', `
      <p>Suppose the shell adds a navigation entry and the frontend adds its route. The shared marker identifies the workspace. The task, the two Git roots, and the contract change determine which checks to run.</p>
      <table class="compact-table">
        <thead><tr><th scope="col">Checkout</th><th scope="col">Example verification</th></tr></thead>
        <tbody>
          <tr><th scope="row"><code>shell/</code></th><td>Read its config and check the navigation entry, destination URL, and shell routing behavior.</td></tr>
          <tr><th scope="row"><code>apps/frontend/</code></th><td>Read its config and check the route, its initial state, and how it responds when opened directly.</td></tr>
        </tbody>
      </table>
      <p>Report the evidence and remaining work per checkout. When both changes are required for the user flow, also exercise the composed navigation path. A passed check in the shell gives no evidence about the frontend’s route.</p>
      ${note('Watch the fold', 'A marker gives the task a common root. Shipping scope still comes from the request, and each checkout applies its own review and gate requirements.')}`],
    ['related', 'Related', `
      <p>Workspace support is documented on the <a href="${workspaceSource}">multi-repo workspace feature revision</a>. Check the helper in your checkout before using the example.</p>
      <ul class="concept-related">
        <li><a href="?page=replaceable-steps">Replaceable steps</a></li>
        <li><a href="?page=workstreams">Workstreams</a></li>
        <li><a href="?page=install">Install in a repo</a></li>
        <li><a href="?page=aw-work"><code>aw-work</code></a></li>
      </ul>`],
  ],
};

function article(id, title, intro, sectionTitle, body) {
  return { id, title, intro, sections: [['details', sectionTitle, body]] };
}

const start = [
  article('overview', 'Overview',
    'Augmented Workflow helps people and coding agents pick up work with the decisions, requirements, and evidence they need.',
    'Start with one repo',
    `<p>Install AW and choose a change your team already needs to make. Write down the current requirement, keep the reason for a decision worth revisiting, and leave the checks that support the result.</p>
     <div class="article-links">
       <a href="?page=install"><strong>Install in a repo</strong><span>Set up the skills and repo instructions.</span></a>
       <a href="?page=ceremony"><strong>Choose the ceremony</strong><span>Match the process to the cost of a mistake.</span></a>
       <a href="?page=concepts"><strong>Explore the concepts</strong><span>See what each artifact carries forward.</span></a>
       <a href="?page=workspaces"><strong>Workspaces</strong><span>Coordinate work across sibling Git checkouts.</span></a>
     </div>`),
  article('install', 'Install in a repo',
    'AW CLI (<code>aw-cli</code>) is the recommended way to install the skills and set up Augmented Workflow in a repository.',
    'Install with AW CLI',
    `<p>You’ll need Python 3.11 or later and <code>pipx</code>. Install the CLI from GitHub, then run <code>aw install</code> once to set up the skills for supported agents.</p>
     <figure class="command"><figcaption>Install the CLI and skills</figcaption><pre tabindex="0"><code>pipx install git+https://github.com/antonyjclements/aw-cli.git
aw install</code></pre></figure>
     <p>In the repository you want to set up, run <code>aw init</code>. It scaffolds the AW files and prompts before replacing any changed existing file. Run <code>aw status</code> from the same directory to inspect that repository’s installation.</p>
     <figure class="command"><figcaption>From the target repository</figcaption><pre><code>aw init
aw status</code></pre></figure>
     <p><a href="https://github.com/antonyjclements/aw-cli#install">AW CLI installation reference</a></p>`),
  ceremony,
  article('roles', 'Use it by role',
    'Product, design, and engineering see different parts of a change. AW gives each a place to leave the context the next contributor needs.',
    'What each role can leave behind',
    `<ul><li><strong>Product.</strong> The outcome, limits, and acceptance examples.</li>
     <li><strong>Design.</strong> The intended experience, important states, and reasons for interaction choices.</li>
     <li><strong>Engineering.</strong> The implementation tradeoffs, checks, and evidence of what shipped.</li></ul>
     <p><a href="#worked-handoff">Follow an example across all three roles</a>.</p>`),
  article('credits', 'Credits',
    'Augmented Workflow is maintained by Antony Clements and its contributors.',
    'Sources and contributors',
    `<p>The guide draws on the <a href="${repository}">AW project</a> and its <a href="?page=essays">companion essays</a>. The theory section draws on Peter Naur’s <a href="https://pages.cs.wisc.edu/~remzi/Naur.pdf">Programming as Theory Building</a>.</p>`),
];

const theory = [
  ['theory-building', 'Programming as theory building'],
  ['theory-decay', 'Why theories decay', 'A system can keep running after the reasons for its current shape have slipped out of reach.'],
  ['agents-and-theory', 'Agents and the missing theory', 'An agent starts with the context it can recover in the current session.'],
  ['evidence', 'Evidence, not encoding', 'Repository artifacts help contributors reconstruct the reasoning behind a system.'],
  ['proof-over-trust', 'Proof over trust', 'Tie a claim about the work to evidence another person can inspect.'],
];

const reading = [
  ['code-without-a-theory', 'Code Without a Theory', 'What happens when the only people who could explain a program were never there to develop a shared understanding of it?', 'Use the guide’s <a href="?page=agents-and-theory#worked-example">prototype feedback walkthrough</a> to see how a person’s reaction can expose an assumption before it becomes part of the implementation.'],
  ['did-you-wash-your-hands', 'Did you wash your hands?', 'What can a check actually establish about the work it claims to verify?', 'See <a href="?page=proof-over-trust#worked-example">what two reviews found after automated checks passed</a> and what evidence the reviewers returned.'],
  ['teaching-the-repo-what-you-keep-correcting', 'Teaching the repo what you keep correcting', 'How repeated corrections become useful guidance with evidence and a clear boundary.', 'See how <a href="?page=aw-synthesize-memory#worked-example">review-before-receipt guidance</a> earns a place in the repository.'],
  ['picking-up-where-the-last-agent-stopped', 'Picking up where the last agent stopped', 'What a handover needs to give the next session a reliable starting point.', 'Use the <a href="?page=aw-work#worked-example">stale workstream example</a> to decide which checks to repeat when the checkout has moved.'],
];
const essayIds = new Set(reading.map(([id]) => id));

const conceptChapters = { ...artifactConcepts, ...practiceConcepts };
const conceptOrder = [
  ['living-specs', 'Living specs', 'docs/features/<feature>/spec.md'],
  ['plans', 'Plans', 'docs/features/<feature>/plan.md'],
  ['decisions', 'Decisions', 'docs/decisions/'],
  ['learnings', 'Learnings', 'docs/learnings/'],
  ['solutions', 'Solutions', 'docs/solutions/'],
  ['session-memory', 'Session memory', 'docs/sessions/'],
  ['standards', 'Standards', 'docs/standards/index.yml'],
  ['gates', 'Gates & receipts', '.scripts/aw-gate.js'],
  ['spec-traces', 'Spec traces', 'docs/standards/traceability.md'],
  ['workstreams', 'Workstreams', '.aw/workstreams/<id>/progress.md'],
  ['behavior-pins', 'Behavior pins', 'docs/features/<feature>/behavior-pin.yml'],
  ['experience-discovery', 'Experience discovery', 'docs/features/experience-discovery/spec.md'],
  ['replaceable-steps', 'Replaceable steps', 'docs/workflow/config.yml'],
];

const concepts = [
  { id: 'concepts', title: 'Concepts', navLabel: 'Overview', ...conceptsOverview },
  ...conceptOrder.map(([id, title, location]) => {
    const detail = conceptChapters[id];
    const references = detail.related.map(([target, label]) => {
      const link = essayIds.has(target)
        ? essayLink(target, label)
        : `<a href="?page=${target}">${target.startsWith('aw-') ? `<code>${label}</code>` : label}</a>`;
      return `<li>${link}</li>`;
    }).join('');
    return {
      id, title, intro: detail.intro, topic: detail.topic, wren: detail.wren,
      meta: detail.meta, aside: detail.aside, aliases: detail.aliases,
      facts: [
        ['Lifespan', `<span class="pill">◆ ${detail.life}</span>`],
        ['Lives in', `<code>${(detail.location ?? location).replaceAll('<', '&lt;')}</code>`],
        ['Written by', detail.writer],
        ['Read by', detail.reader],
      ],
      sections: [...detail.sections, ['related', 'Related', '<ul class="concept-related">' + references + '</ul>']],
    };
  }),
  workspaces,
];

const skillGroups = [
  ['Orient', [
    ['aw-help', 'Get a next-step recommendation grounded in the current task and repo configuration.', 'Use when joining an unfamiliar workstream or deciding which skill fits a request.'],
    ['aw-init', 'Install or update AW in a target repository.', 'Choose the target repository and whether it needs the optional deterministic helper.'],
  ]],
  ['Intend', [
    ['aw-prd', 'Create or import a product requirements document.', 'Use for product input with its own lifecycle and source history.'],
    ['aw-spec', 'Create or update a living feature spec.', 'Use when intent needs to be recorded, reconciled, or explored before building.'],
    ['aw-research', 'Gather evidence for a focused question.', 'Use when a choice depends on repository history, current primary sources, or organizational context.'],
    ['aw-plan', 'Sequence multi-step work and its verification.', 'Use when dependencies or coordination make the order of work consequential.'],
    ['aw-create-tickets', 'Turn approved planning material into implementation ticket drafts.', 'Use the configured ticket workflow where available.'],
    ['aw-request-human-review', 'Open a spec or plan PR and request configured reviewers.', 'Use when a human sign-off is requested or required by the workflow.'],
  ]],
  ['Make', [
    ['aw-work', 'Implement a request, spec, plan, or ticket through verification.', 'Use when there is enough intent to build. Follow the checkout’s test policy and keep checks tied to the work.'],
    ['aw-debug', 'Find the root cause of a bug or failing check and verify the fix.', 'Use when the cause is unclear or a failure needs to be reproduced.'],
    ['aw-pin-behavior', 'Establish a baseline for covered behavior before a change.', 'Use for rewrites and migrations where preservation of existing behavior matters.'],
    ['aw-create-worktree', 'Create an isolated Git checkout for a branch.', 'Use to keep active changes or a review separate from the current checkout.'],
  ]],
  ['Check', [
    ['aw-review', 'Review a diff or document against intent, standards, and evidence.', 'Use to find defects, missing checks, or mismatches before delivery.'],
    ['aw-check-workflow-compliance', 'Audit a scoped change against the configured workflow and acceptance evidence.', 'Use before publishing a non-trivial change.'],
    ['aw-resolve-pr-feedback', 'Evaluate review comments and fix valid issues.', 'Use after a PR has received review feedback.'],
    ['aw-feedback', 'Triage product and testing feedback against agreed intent.', 'Use when a report needs to be classified and routed to the relevant artifact or fix.'],
  ]],
  ['Ship', [
    ['aw-ship', 'Commit, open a PR, or draft a PR description in the requested mode.', 'Specify the delivery action you want. Each mode has its own scope and permissions.'],
  ]],
  ['Keep', [
    ['aw-capture', 'Record a durable decision, learning, solution, or session.', 'Use when the next contributor would benefit from a choice, correction, or verified fix.'],
    ['aw-synthesize-memory', 'Process session logs into reusable project knowledge.', 'Use when uncaptured patterns or findings have accumulated across sessions.'],
    ['aw-refresh', 'Refresh documentation indexes and audit their entries.', 'Use when registries, decisions, or learnings need maintenance.'],
    ['aw-discover-standards', 'Turn repeated conventions into explicit repo standards.', 'Use once a pattern is consistent enough for the team to enforce it.'],
  ]],
];

const configKeys = {
  'aw-prd': ['steps.prd'], 'aw-spec': ['steps.brainstorm', 'steps.create_spec'],
  'aw-plan': ['steps.plan'], 'aw-create-tickets': ['steps.create_tickets'],
  'aw-request-human-review': ['steps.request_human_review'], 'aw-work': ['steps.work'],
  'aw-debug': ['auxiliary.debug'], 'aw-pin-behavior': ['auxiliary.pin_behavior'],
  'aw-create-worktree': ['auxiliary.create_worktree'], 'aw-review': ['steps.review'],
  'aw-check-workflow-compliance': ['steps.check_workflow_compliance'],
  'aw-resolve-pr-feedback': ['auxiliary.resolve_pr_feedback'],
  'aw-ship': ['steps.commit', 'steps.commit_push_pr'], 'aw-capture': ['auxiliary.capture'],
  'aw-synthesize-memory': ['auxiliary.synthesize_memory'], 'aw-refresh': ['auxiliary.refresh'],
  'aw-discover-standards': ['auxiliary.discover_standards'],
};

const guideStage = {
  Orient: 'Find your footing and set up a repository.',
  Intend: 'Establish the outcome and sequence the work.',
  Make: 'Investigate and implement the change.',
  Check: 'Review the change and its evidence.',
  Ship: 'Deliver within the requested scope.',
  Keep: 'Preserve what the next change will need.',
};

const awHelpExample = ['before-and-after', 'Before and after', `
  <p><strong>Before.</strong> “The CSV export stopped including archived items after yesterday’s change. I have the failing test, and I don’t know what caused it.”</p>
  <p><strong>Recommended next skill.</strong> <a href="?page=aw-debug"><code>aw-debug</code></a>. A reproducible failure already exists and the root cause is open.</p>
  <figure class="command"><figcaption>prompt to paste</figcaption><pre><code>Use aw-debug. The CSV export omits archived items after the latest change. Start from the failing export test.</code></pre></figure>
  <p><strong>After.</strong> Carry the failing test path and expected archived-item behavior into the debug session. Once the behavior is fixed and checked, use <a href="?page=aw-capture"><code>aw-capture learning</code></a> if the cause is likely to matter in another change.</p>
  <p>Apply the same routing rule to the repo’s <a href="?page=aw-debug#worked-example">recorded gate failure</a>. A failed check is an investigation input. When the cause is already known and the scope is clear, make the targeted fix and verify it.</p>`];

function skillPage(id, stage, intro) {
  const reference = skillReferences[id];
  const keys = configKeys[id] ?? [];
  return {
    id, title: id, intro: reference.description || intro, stage, wren: 'in-flight',
    skill: {
      stageInfo: guideStage[stage],
      keys,
      hint: reference.hint,
      source: reference.source,
      tagline: id === 'aw-help' ? 'The one that points the way.' : undefined,
    },
    preface: reference.preface,
    sections: [id === 'aw-help' ? awHelpExample : skillWalkthrough(id), ...reference.sections],
  };
}

export const groups = [
  { title: 'Start here', pages: start.map(page => ({
    ...page, wren: page.wren ?? 'alert', showReadingTime: true, sections: [...page.sections, ...(startDetails[page.id] ?? [])],
  })) },
  { title: 'Theory', pages: theory.map(([id, title, intro]) => ({
    id, title, intro, wren: 'perched', showReadingTime: true,
    ...(id === 'theory-building' ? theoryOpening : theoryDetails[id]),
  })) },
  { title: 'Concepts', pages: concepts },
  {
    title: 'Skills',
    pages: [{
      id: 'skills', title: 'All skills', wren: 'in-flight', topic: 'Reference',
      intro: 'Find the bundled AW skill that fits the decision or action in front of you. Each page opens with a worked example, then shows how to invoke the skill and what instructions the agent reads.',
      aliases: { details: 'orient' },
      preface: '<p>Start with <a href="?page=aw-help"><code>aw-help</code></a> if the next step is unclear. See <a href="?page=replaceable-steps">Replaceable steps</a> to connect a team-specific provider.</p>',
      sections: [['find-a-route', 'Pick the next step from what you have', `
        <p>Start with the artifact already in hand. In the public Workflow Effectiveness plan, U1 specifies the run lifecycle helper and names the test that exercises it. The plan gives someone enough information to draft a bounded ticket and check the result later.</p>
        ${handoffFlow('Each step passes on something the next person can inspect.', [
          ['aw-plan#worked-example', 'Read the plan', 'Use U1, its requirement IDs, and the named test to establish what the change covers.'],
          ['aw-create-tickets#worked-example', 'Draft the ticket', 'Carry the same scope and verification into the ticket so the implementer can find both.'],
          ['aw-check-workflow-compliance#worked-example', 'Check the evidence', 'After implementation, match the result to the acceptance cases and record any checks still open.'],
        ])}
        <p>If a check fails and the cause is open, go to <a href="?page=aw-debug#worked-example"><code>aw-debug</code></a>. If the team still needs to agree what the helper should do, return to <a href="?page=aw-spec#worked-example"><code>aw-spec</code></a>. See <a href="?page=aw-help#before-and-after">how aw-help makes that choice</a>.</p>`],
      ...skillGroups.map(([stage, skills]) => [
        stage.toLowerCase(), stage,
        `<p>${guideStage[stage]}</p><dl class="skill-index">${skills.map(([id, intro, when]) =>
          `<div><dt><a href="?page=${id}"><code>${id}</code></a></dt><dd>${intro} ${when}</dd></div>`
        ).join('')}</dl>`,
      ])],
    }],
    subgroups: skillGroups.map(([title, skills]) => ({
      title,
      pages: skills.map(([id, intro]) => skillPage(id, title, intro)),
    })),
  },
  {
    title: 'Essays',
    pages: [
      {
        id: 'essays', title: 'All essays', topic: 'Index', wren: 'perched',
        intro: 'Four essays on shared understanding, verification, learning, and handover. Each opens in a new tab on Antony Clements’s site.',
        sections: reading.map(([id, title, intro, companion], index) => [
          index === 0 ? 'details' : id, title, `<p>${intro}</p><p>${companion}</p>`, essayUrl(id),
        ]),
      },
      ...reading.map(([id, title, intro]) => ({
        id, title, intro, wren: 'perched', showReadingTime: true, topic: 'Reading notes',
        externalUrl: essayUrl(id),
        meta: ['By Antony Clements', essayLink(id, 'Open the original essay')],
        sections: [
          ...essayDetails[id],
          ['details', 'Read the essay', `<p>${essayLink(id, 'Read the full essay by Antony Clements')}</p>`],
        ],
      })),
    ],
  },
];

export function groupPages(group) {
  return [...group.pages, ...(group.subgroups ?? []).flatMap(subgroup => subgroup.pages)];
}
