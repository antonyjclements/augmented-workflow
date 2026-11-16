import { guideLink, note, skill, sourceLink, sourceExcerpt } from './field-guide-concepts.mjs';

const repo = 'https://github.com/antonyjclements/augmented-workflow/blob/main/';
const naur = 'https://pages.cs.wisc.edu/~remzi/Naur.pdf';

export const essayUrl = id => 'https://antonyjclements.github.io/posts/' + id + '/';
export const newTab = 'target="_blank" rel="noopener noreferrer"';
export const essayLink = (id, label) => `<a href="${essayUrl(id)}" ${newTab}>${label}</a>`;

const creasePattern = [
  [0, 50, 100, 50], [50, 0, 50, 100],
  [0, 0, 50, 22], [50, 22, 100, 0], [0, 100, 50, 78], [50, 78, 100, 100],
  [0, 0, 22, 50], [22, 50, 0, 100], [100, 0, 78, 50], [78, 50, 100, 100],
  [0, 0, 100, 100, true], [0, 100, 100, 0, true],
  [50, 22, 78, 50, true], [78, 50, 50, 78, true], [50, 78, 22, 50, true], [22, 50, 50, 22, true],
].map(([x, y, endX, endY, mountain]) => {
  const dx = endX - x;
  const dy = endY - y;
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  return `<span class="${mountain ? 'mountain' : 'valley'}" style="left:${x}%;top:${y}%;width:${length}%;transform:rotate(${angle}rad)"></span>`;
}).join('');

const evidenceMap = [
  ['Purpose', 'Current intent and the behavior the feature promises.', 'living-specs', 'living spec'],
  ['Tradeoffs', 'Dated choices and the reasons later decisions may supersede them.', 'decisions', 'decision'],
  ['Lessons', 'A correction, the conditions that trigger it, and corroborating evidence.', 'learnings', 'learning'],
  ['Constraints', 'Enforceable conventions indexed by the work they apply to.', 'standards', 'standard'],
  ['Proof', 'A record of the check that ran, its scope, and whether it is still fresh.', 'gates', 'gate &amp; receipt'],
];

export const conceptsOverview = {
  topic: 'Overview',
  intro: 'Each concept is a kind of evidence the repo keeps. It tells you what a feature is for, why it took this shape, what experience taught, what was checked, or where the work stopped. Each has a home, a lifespan, and a rule for when to update it.',
  wren: 'alert',
  showReadingTime: true,
  preface: `
    <p>Most teams already write things down. The trouble starts when the writing stops matching the code. The PRD describes the scope from two months ago. The technical design describes the architecture before review changed it. The reason a choice was made is still in a meeting nobody recorded. Every new agent session encounters those gaps at once.</p>
    <p>AW gives different kinds of knowledge different homes in the repository. Intent changes, so living specs get rewritten. Decisions record what the team knew when it chose. Plans describe a particular delivery and stop being useful once that delivery is over.</p>`,
  aside: { title: 'Why evidence?', text: 'A contributor pieces together the working theory from what the team leaves behind.', href: '?page=evidence', label: 'Evidence, not encoding' },
  sections: [
    ['from-problem-to-concept', 'From problem to concept', `
      <p>Start with the problem you have. The third column leads to the artifact’s rules and an example of when to use it.</p>
      <table><thead><tr><th>What happened</th><th>What AW keeps</th><th>Read next</th></tr></thead><tbody>
        <tr><td>The PRD and the shipped behavior diverged.</td><td>The PRD remains historical input. A living spec carries current intent and acceptance criteria.</td><td><a href="?page=living-specs">Living specs</a></td></tr>
        <tr><td>A delivery involves several dependent changes.</td><td>A plan sequences the work and names the checks each unit needs.</td><td><a href="?page=plans">Plans</a></td></tr>
        <tr><td>Someone needs to know why a choice was made.</td><td>A decision records the alternatives and the reason that held at the time.</td><td><a href="?page=decisions">Decisions</a></td></tr>
        <tr><td>An agent keeps repeating the same mistake.</td><td>A learning records the cause and circumstances. A recurring rule can become a standard.</td><td><a href="?page=learnings">Learnings</a> · <a href="?page=standards">Standards</a></td></tr>
        <tr><td>A hard-to-diagnose failure finally has a fix.</td><td>A solution records how to recognize the failure and check the correction.</td><td><a href="?page=solutions">Solutions</a></td></tr>
        <tr><td>A new session has to pick up unfinished work.</td><td>A local workstream checkpoint records the next action. Session logs feed later synthesis.</td><td><a href="?page=workstreams">Workstreams</a> · <a href="?page=session-memory">Session memory</a></td></tr>
        <tr><td>A review says a requirement is covered.</td><td>A spec trace points to the test. A gate receipt records the verification step.</td><td><a href="?page=spec-traces">Spec traces</a> · <a href="?page=gates">Gates &amp; receipts</a></td></tr>
        <tr><td>A rewrite should preserve an existing contract.</td><td>A baseline captures observable behavior on the old revision before a comparison.</td><td><a href="?page=behavior-pins">Behavior pins</a></td></tr>
        <tr><td>Customers may read a proposed interaction differently from the team.</td><td>A disposable prototype obtains feedback before the choice becomes a requirement.</td><td><a href="?page=experience-discovery">Experience discovery</a></td></tr>
        <tr><td>The repo already has a review process it needs to keep.</td><td>A configured provider can replace one stage of the workflow.</td><td><a href="?page=replaceable-steps">Replaceable steps</a></td></tr>
        <tr><td>A change spans several Git checkouts.</td><td>A workspace helps the agent discover its scope. Each repo applies its own workflow.</td><td><a href="?page=workspaces">Workspaces</a></td></tr>
      </tbody></table>`],
    ['two-rules-underneath', 'Two rules underneath', `
      <ol><li><strong>Give each fact one authoritative home.</strong> A plan can point to an acceptance criterion in the spec. If the plan repeats the criterion, a later change can leave two versions that appear equally authoritative.</li>
      <li><strong>Match the lifespan to the kind of knowledge.</strong> Current intent gets updated, past choices are superseded by new records, and temporary execution notes can expire. A correction needs enough context to tell a later reader whether it still applies.</li></ol>
      <p>Put those rules in the project instructions and link to the artifact from the work that consumes it. A review should be able to trace a claim back to its source without searching across every old plan or meeting note.</p>`],
    ['what-each-kind-answers', 'What each kind answers', `
      <p>A spec answers what needs to be true today. A decision answers why the team chose an option on a particular date. A verification record answers what somebody checked, on what revision, and with which inputs. A workstream checkpoint answers where to resume.</p>
      <p>Suppose users need to be able to undo a bulk edit. The spec defines when undo is available and what state returns. The decision records why the team chose a time-limited undo. A test covers expiration. The session checkpoint says that undo works for individual edits and the bulk scenario still needs checking. Each answer serves a different reader.</p>`],
    ['capture-is-cheap', 'Capture is cheap, durability is earned', `
      <p>A session log can hold a failed idea, a promising observation, and a measured result together. In synthesis, check each candidate against the code and its source before promoting it. A lesson about a single repository can be valuable with that scope written down.</p>
      <p>When a correction keeps applying and reviewers can verify the rule, promote it to an indexed standard. If the pattern is useful across repos, the team can consider promotion to the <a href="?page=standards#org-wide-standards">organization knowledge source</a>, with an owner and a way to retire it when conditions change.</p>`],
    ['where-a-machine-checks', 'Where a machine checks, and where a person does', `
      <p>A helper can check that a referenced file exists, a requirement ID resolves, or a receipt is fresh for the current commit. A test can exercise named inputs. The reviewer decides whether those inputs represent the problem and whether the remaining risk is acceptable.</p>
      <p>Use <a href="?page=behavior-pins">behavior pins</a> when a rewrite has an old revision worth comparing against. Use <a href="?page=experience-discovery">experience discovery</a> when the important question is how someone understands or uses a change.</p>`],
    ['what-to-adopt-first', 'What to adopt first', `
      <p>Add practices as the coordination cost grows. A pair can keep a consequential decision in one short file. Several people changing the same feature need an agreed place for current intent. Across repos, consistent handoffs and verification become more valuable.</p>
      <ul class="adoption-cards">
        <li><strong>Solo or pair</strong><p>Capture a ${guideLink('decisions', 'decision')} when a real tradeoff is settled. Write a ${guideLink('standards', 'standard')} when a convention keeps coming up. Use ${skill('aw-ship')} when it is time to ship. Add a spec when the feature is hard to hold in your head.</p></li>
        <li><strong>Small team, 3–8</strong><p>Add ${guideLink('living-specs', 'living specs')} for work that crosses contributors or needs agreement on intent. Capture useful ${guideLink('learnings', 'learnings')} after a postmortem. Run ${skill('aw-synthesize-memory')} roughly monthly to recover recurring lessons.</p></li>
        <li><strong>Larger team or multi-repo</strong><p>Run synthesis each sprint. Turn ${guideLink('plans', 'plans')} into tickets where people and agents will work in parallel. Use human review and ${guideLink('gates', 'gates')} for high-risk work. A ${guideLink('workspaces', 'workspace')} can coordinate side-by-side checkouts.</p></li>
      </ul>
      <p>Use ${guideLink('roles', 'Use it by role')} for day-to-day handoffs and ${guideLink('ceremony', 'Choose the ceremony')} to size a single change. The team sizes are adoption examples. The consequences of a specific change still determine its workflow. ${sourceLink('docs/workflow/field-guide.md#by-team-size', 'Repository field guide')}.</p>`],
  ],
};

export const theoryOpening = {
  topic: '01',
  intro: 'In 1985 Peter Naur argued that the real product of programming is a theory held by the people doing the work. It lets them explain why the program has its shape and how it should change. Augmented Workflow starts from that idea.',
  wren: 'perched',
  narrowTitle: true,
  showReadingTime: true,
  meta: [
    `Source <a href="${naur}"><cite>Programming as Theory Building</cite></a>`,
    `Companion essay ${essayLink('code-without-a-theory', 'Code Without a Theory')}`,
  ],
  preface: `
    <p>Most discussion about AI-assisted development asks how fast code arrives, how often it works, and how to review it. Naur’s paper asks what the people who wrote the program came to understand and how someone else can recover that understanding.</p>`,
  aside: { title: 'Read the source', text: 'Peter Naur’s 1985 paper explains what a theory gives a programmer and how a program loses it.', href: naur, label: 'Open the PDF' },
  sections: [
    ['the-code-is-whats-left-over', 'The code is what’s left over', `
      <p>Naur describes programming as developing an understanding of the problem, the program, and the relationship between them. Someone who holds that understanding can look at a proposed change and explain what it would mean in the world the program serves. They can also explain why the current code took its particular form.</p>
      <p>A person may be able to update a function from the surrounding types and still miss a business condition that made the original design worthwhile. A maintainer who understands the reason behind the code can notice when a change preserves the syntax and changes the promise.</p>
      <p>The source tree and its documentation remain useful evidence. Learning the theory also calls for looking at examples, following behavior through the code, testing an explanation, and discussing unfamiliar cases with people who know the system.</p>`],
    ['what-a-theory-holds', 'What a theory holds', `
      <p>Read a checkout program and you can trace the call that reserves stock. Knowing why the reservation is there takes more context. The team may be protecting the last unit from two shoppers, balancing reservation time against availability, or dealing with a payment retry that completes after the reservation has expired.</p>
      <ul>
        <li><strong>Purpose.</strong> Know who the system serves and the promise it makes to them.</li>
        <li><strong>Constraints.</strong> Know which limits shape that promise, such as how long the store can hold stock.</li>
        <li><strong>Tradeoffs.</strong> Know which options the team considered and what made one fit.</li>
        <li><strong>Lessons.</strong> Know the failures or corrections that explain rules a newcomer might otherwise miss.</li>
      </ul>
      <figure class="fold-diagram">
        <div class="fold-diagram-pair">
          <div><div class="crease-pattern" aria-hidden="true">${creasePattern}</div><strong>Crease pattern</strong><p>Why each fold is there</p></div>
          <div class="fold-direction" aria-hidden="true"><span>→</span>Fold</div>
          <div><img data-guide-wren="perched" src="assets/wren/wren-perched.png" width="176" height="176" alt=""><strong>Folded model</strong><p>What you can inspect</p></div>
        </div>
        <figcaption>Unfolding a paper model reveals the creases. Some were deliberate and some are traces of how the paper was handled. Reading code is similar. You can recover a great deal from the result, and you still need evidence about which parts of its shape matter.</figcaption>
      </figure>
      <p>If a feature asks the team to allow late payment retries, that broader understanding guides review. It tells them to examine the promise to both shoppers and the point at which stock becomes available again.</p>`],
    ['how-a-program-dies', 'How a program dies', `
      <p>A deployed program can continue running after its team loses the ability to explain and change it confidently. When the people who carry the theory leave, the remaining code by itself offers an incomplete account of the original constraints.</p>
      <p>Later fixes can make this worse. A contributor adds a special case based on the most plausible local explanation. The next contributor has to recover the original design and account for that special case. A living spec or an old decision can narrow the search. A conversation, working example, or new investigation may still be needed to rebuild the explanation.</p>
      <p><a href="?page=theory-decay">Read how theories decay</a></p>`],
    ['agents-arrive-without-one', 'Agents arrive without one', `
      <p>When you write the change, you encounter decisions as you go. By the time the diff exists, you have had a chance to learn which limits matter and why the easy approaches fail. An agent can deliver the diff before anyone has had that experience. Reading the diff may then be the first time a reviewer has to work out the assumptions behind it.</p>
      <p>Give the agent the current spec, the decision behind a constraint, and the standards for the files in scope. Ask it to explain the promise it thinks it is preserving and test that explanation against a concrete example. In the reservation case, ask what happens if the shopper retries after someone else buys the last unit.</p>
      <blockquote class="theory-pullquote"><p>Agent-assisted implementation can move ahead while the system’s assumptions are still unsettled. The review then has to reconstruct decisions nobody remembers making.</p><footer>Adapted from ${essayLink('code-without-a-theory', 'Code Without a Theory')}</footer></blockquote>
      <p>See ${guideLink('agents-and-theory', 'Agents and the missing theory')} for the handoff and review questions that help expose those assumptions.</p>`],
    ['evidence-not-encoding', 'Evidence, not encoding', `
      <p>AW keeps evidence alongside the code so a contributor can reconstruct an explanation, challenge it against behavior, and extend it. A spec can name the stock promise, a decision can explain why the team reserves before charging, and a test can exercise the timeout. Each piece has its own home and a way to tell whether it still applies.</p>
      <dl class="theory-evidence">
        ${evidenceMap.map(([kind, detail, id, label]) => `<div><dt>${kind}</dt><dd>${detail}</dd><dd>${guideLink(id, `<code>${label}</code>`)}</dd></div>`).join('')}
      </dl>
      ${note('Where judgment matters', 'An accountable maintainer still has to connect the evidence and answer for the system-level behavior. A new case can expose an assumption that even a current spec and passing checks never addressed.')}`],
    ['where-to-go-next', 'Where to go next', `
      <p>Read ${guideLink('theory-decay', 'Why theories decay')} to recognize how understanding is lost. Use the ${guideLink('concepts', 'concept map')} to choose what to preserve. ${essayLink('code-without-a-theory', 'Code Without a Theory')} develops the full argument about agent-assisted work.</p>`],
  ],
};

const progressSpec = 'docs/features/progress-tracking/spec.md';
const discoverySpec = 'docs/features/experience-discovery/spec.md';
const discoveryCases = 'docs/features/experience-discovery/experience-discovery.feature';
const routingDecision = 'docs/decisions/2026-06-07-use-workflow-steps-for-skill-routing.md';
const receiptLearning = 'docs/learnings/2026-07-27-review-the-diff-before-stamping-the-gate.md';

export function handoffFlow(label, stages) {
  return `<figure class="handoff-flow">
    <ol role="list">${stages.map(([id, name, detail]) =>
      `<li><strong>${id ? guideLink(id, name) : name}</strong><p>${detail}</p></li>`
    ).join('')}</ol>
    <figcaption>${label}</figcaption>
  </figure>`;
}

export const theoryDetails = {
  'theory-decay': {
    topic: '02',
    preface: '<p>Loss of understanding usually shows up as ordinary friction. A team reads an old PR twice to answer the same question. Two maintainers read a compatibility test and reach different conclusions about which behavior was deliberate.</p>',
    aside: { title: 'Recover the original choice', text: 'A dated record can tell you what the team knew when it decided.', href: '?page=decisions', label: 'Read Decisions' },
    sections: [
      ['details', 'How the reasons get lost', `
        <p>People leave, requirements shift, and a local fix can change the facts an older document assumes. The program can still run while nobody can confidently say why one fallback exists or whether it can be deleted. Each later change adds its own explanation, often only in review.</p>
        <p>Configuration is an especially good example. Seeing two keys in an old file tells you how contributors stored their settings. To migrate those settings you also need to know where the project moved the routing decision and how it intended to treat old values.</p>`],
      ['recognize-the-symptoms', 'Recognize the symptoms', `
        <table class="compact-table">
          <thead><tr><th scope="col">What you see</th><th scope="col">What to find out</th></tr></thead>
          <tbody>
            <tr><th scope="row">The same explanation appears in several reviews</th><td>Which part of the reasoning is still missing from the repo, and who needs it?</td></tr>
            <tr><th scope="row">Two docs give different instructions</th><td>Which artifact has authority, and are they describing the same revision or policy?</td></tr>
            <tr><th scope="row">A test is the only reason a branch exists</th><td>Which incident, user promise, or compatibility condition originally needed it?</td></tr>
          </tbody>
        </table>
        <p>Follow the clue to the original context. If the reason is still open, make the uncertainty visible before classifying a surprising behavior as a bug.</p>`],
      ['worked-example', 'What happened when workflow keys moved', `
        <p>AW originally stored separate skill selectors for ticket creation, commits, pipeline monitoring, and research. The June 7 decision explains why the project replaced those selectors with <code>workflow.steps</code>. Reading the latest YAML alone would leave a maintainer to infer whether the old keys were supported aliases.</p>
        ${sourceExcerpt(routingDecision, `Do not maintain fallback aliases for those selector fields. Existing repos that still contain them should migrate the value to the matching \`workflow.steps.<step>.skill\` key.`)}
        <p>The follow-on ${sourceLink('docs/decisions/2026-06-07-add-upgrade-config-migration.md', 'upgrade migration decision')} explains what to do with existing values. Together the records recover the reason for the new structure and the transition older checkouts need.</p>`],
      ['repair-the-record', 'Repair the record while changing the system', `
        ${handoffFlow('Use the next change to recover one missing piece of understanding.', [
          [null, 'Find the evidence', 'Read the old decision, customer example, or failing fixture that explains the surprise.'],
          ['living-specs', 'Reconcile the promise', 'Check the observed behavior against current intent. Resolve mismatches with a person who owns the outcome.'],
          ['decisions', 'Leave a durable answer', 'Update the living intent or record a dated choice with the reason a future maintainer will need.'],
        ])}
        ${note('Watch the fold', 'When the old explanation no longer applies, keep it as history and point readers to the current rule. That gives both revisions an honest account of their behavior.')}`],
      ['related', 'Related', `<p>${guideLink('agents-and-theory', 'Agents and the missing theory')} · ${guideLink('replaceable-steps', 'Replaceable steps')} · ${guideLink('solutions', 'Solutions')}</p>`],
    ],
  },
  'agents-and-theory': {
    topic: '03',
    preface: '<p>An agent can give you a coherent implementation before anyone has made the important decisions about what it should do. Bring those decisions into the conversation while there is still time to change the approach.</p>',
    aside: { title: 'Make assumptions inspectable', text: 'A small prototype can expose an interpretation before production code depends on it.', href: '?page=experience-discovery', label: 'Read Experience discovery' },
    sections: [
      ['details', 'Give the agent a basis for judgment', `
        <p>State the outcome, identify the living spec, and point to the decision or standard that constrains the files in scope. A contributor working on discovery needs the rules for suggested and expressly requested prototypes, the experience question, and the agreed limits on the work.</p>
        <p>Ask how the agent interprets the request before it builds. A useful explanation names the user’s intended outcome, the assumption that might change the result, and the evidence that would settle it. Give each unresolved choice an owner.</p>`],
      ['ask-for-an-explanation', 'Ask for an explanation you can examine', `
        <p>Use this handoff when reviewing a change to the experience-discovery route. It names the governing criterion and asks about an ambiguity that an example can expose.</p>
        <figure class="command"><figcaption>Example agent handoff</figcaption><pre tabindex="0"><code>Read EXD-002 in docs/features/experience-discovery/spec.md.
Explain when a proposed prototype can start and what changes
if the user directly requests one. Show which acceptance case
covers each path and identify any evidence we still need.</code></pre></figure>
        <p>${sourceLink(discoverySpec, 'Read the living spec')} and ${sourceLink(discoveryCases, 'open the manual acceptance scenarios')}. A response that cites S1 should describe waiting for agreement. A response that cites S2 should recognize authorization the user already gave.</p>`],
      ['worked-example', 'Use a human reaction as evidence', `
        <p>The public experience-discovery replay recorded a scripted reaction to a functional prototype that still felt generic. The writing shows how the agent captured the mismatch and kept the experience question open. This was a controlled conversation exercise with scripted feedback.</p>
        ${handoffFlow('The artifact makes an interpretation inspectable. The person’s reaction determines what it established.', [
          ['experience-discovery', 'Interpret', 'Name what the prototype should let a person understand or accomplish.'],
          [null, 'Observe', 'Ask for a reaction and preserve the specific mismatch or agreed outcome.'],
          ['living-specs', 'Carry forward', 'Write the accepted behavior and keep consequential unresolved questions visible.'],
        ])}
        <p>${sourceLink('docs/features/experience-discovery/replay-results.md', 'Read the replay and its limits')}.</p>`],
      ['return-evidence', 'Return evidence with the change', `
        <p>The next agent needs a place to look and a way to verify the handoff. Name the accepted artifact, scenario IDs, checks run, and work still open. If the result is incomplete, link to the ${guideLink('workstreams', 'workstream checkpoint')} and include the next action.</p>
        ${note('Where judgment matters', 'In review, ask which evidence changed the agent’s interpretation. If a decision remains speculative, resolve it with the person who owns the outcome.')}`],
      ['related', 'Related', `<p>${guideLink('workstreams', 'Workstreams')} · ${guideLink('session-memory', 'Session memory')} · ${skill('aw-work')}</p>`],
    ],
  },
  evidence: {
    topic: '04',
    preface: '<p>When you inherit a change, reconstruct the important parts from artifacts that answer different questions. Each can be inspected, corrected, or traced back to the work that produced it.</p>',
    sections: [
      ['details', 'Choose an artifact for the question', `
        <dl class="theory-evidence">
          ${evidenceMap.map(([kind, detail, id, label]) => `<div><dt>${kind}</dt><dd>${detail}</dd><dd>${guideLink(id, `<code>${label}</code>`)}</dd></div>`).join('')}
        </dl>
        <p>Put the promise in the current spec and link the decision that explains why the team chose it. When the promise changes, readers can still understand why the older behavior was once right.</p>`],
      ['read-the-evidence-together', 'Follow PROG-002 from intent to evidence', `
        <p>AW’s workstream feature promises that a resumed session reconciles the recorded checkout and unit state with what is on disk. A maintainer evaluating a change to that behavior can follow three concrete artifacts.</p>
        ${handoffFlow('The three sources answer what must hold, what scenario exercises it, and what was actually verified.', [
          ['living-specs', 'Living intent', 'PROG-002 describes accurate resume and when the next session must check the live checkout.'],
          ['spec-traces', 'Acceptance scenario', 'The workstream feature scenario gives two matching records and a changed HEAD, then names the expected reconciliation.'],
          ['proof-over-trust', 'Verification record', 'The verification write-up distinguishes installer checks from manual contract walkthroughs.'],
        ])}
        <p>${sourceLink(progressSpec, 'Living spec')} · ${sourceLink('docs/features/progress-tracking/progress-tracking.feature', 'Acceptance scenarios')} · ${sourceLink('docs/features/progress-tracking/verification.md', 'Verification method and limits')}.</p>`],
      ['what-the-artifacts-leave-open', 'Resolve disagreements in the evidence', `
        <p>A prior checkpoint may say a test passed, while a new diff now changes the behavior that test covers. The old result remains useful history. Run the relevant check for the current revision before using it to support the new change.</p>
        ${note('Watch the fold', 'Tracing a criterion to a scenario proves a link exists. Review what the scenario covers and consult its execution record before drawing a conclusion about the current revision.')}`],
      ['renew-the-record', 'Renew the record when behavior changes', `
        <p>If the team changes how a workstream is selected, update the owning requirement and its scenario together. Preserve the earlier decision when it explains why recency was avoided. Use a new verification record for the new proof instead of rewriting the old result.</p>
        <p>${guideLink('concepts', 'The Concepts map')} shows where each kind of evidence lives and when it expires.</p>`],
    ],
  },
  'proof-over-trust': {
    topic: '05',
    preface: '<p>A fresh review receipt, a trace report, and a passing test establish different facts. Review is easier when each claim names the check and the revision that supports it.</p>',
    sections: [
      ['details', 'What a check establishes', `
        <p>Report the procedure, inputs or scope, revision, and observed result. If the environment kept an important scenario from running, state that with the result. This makes it possible to repeat the check or choose a narrower claim.</p>
        <p>AW’s first gate functional test recorded a review event and still got a failure. The configured set included other gates. The checker was reporting the whole set, while the test had supplied evidence for one event. ${sourceLink('docs/learnings/2026-07-14-record-every-configured-gate.md', 'Read the recorded diagnosis')}.</p>`],
      ['choose-proof-for-the-claim', 'Choose proof for the claim', `
        <table>
          <thead><tr><th scope="col">Claim</th><th scope="col">Inspect this</th><th scope="col">Review question</th></tr></thead>
          <tbody>
            <tr><th scope="row">A requirement has test coverage</th><td>The ${guideLink('spec-traces', 'spec trace')} and the test assertion.</td><td>Did the case run, and does it exercise the promise?</td></tr>
            <tr><th scope="row">A rewrite preserves behavior</th><td>The ${guideLink('behavior-pins', 'pin')} verdict, manifest scope, and harness.</td><td>Which inputs or side effects fall outside those observations?</td></tr>
            <tr><th scope="row">A review is current</th><td>The ${guideLink('gates', 'gate state')}, scope, and recorded receipt.</td><td>Did the review actually inspect the risks of this diff?</td></tr>
          </tbody>
        </table>`],
      ['worked-example', 'Read a green result with the actual diff', `
        <p>AW added <code>trace --suggest-e2e</code> as an advisory command for adopting end-to-end coverage markers. The suite passed. During review, reading the parser showed that a trailing positional argument changed the option from a boolean to a string. The helper silently ran the ordinary enforcement check.</p>
        <figure class="command"><figcaption>Invocation from the regression case</figcaption><pre tabindex="0"><code>node .scripts/aw-gate.js trace --suggest-e2e stray-positional</code></pre></figure>
        <p>In an isolated checkout with tracing enabled, the original printed “trace clean.” The corrected version printed “e2e marker suggestions.” Both exited successfully. The regression test asserts the output so that a successful exit from the wrong path fails the test.</p>
        <p>Carry the invocation, observed output, and tested revision into review. The same learning records a second case, where reading the spec diff caught a removed contract before the receipt was written. <a href="https://github.com/antonyjclements/augmented-workflow/commit/8320c8914e67053eb188ef99e9d1cf9cc569ff3f">Read the parser fix and regression test</a>. ${sourceLink(receiptLearning, 'Read the review learning')}.</p>`],
      ['how-much-checking-is-enough', 'How much checking is enough?', `
        <p>Start with the failure that would be most expensive to reverse. A corrected link needs a rendered link check. A revision to an existing contract needs the affected acceptance scenarios and review of the proposed difference. For a migration that could lose data, a reviewer needs to see how the transition, recovery, and verification work on representative data.</p>
        <p>Choose proof that matches each claim and record the boundary of the check. If an important case is still open, make it visible while the person responsible for shipping can act on it. ${guideLink('ceremony', 'Choose the ceremony')} maps the stakes to the workflow.</p>`],
      ['make-a-better-handoff', 'Make a better handoff', `
        <p>Give the next contributor the command, observed result, revision, and the check that remains open. “The disabled trace harness passed on the candidate” names a bounded observation. Link the manifest so a reader can see precisely which output fields were checked.</p>
        <p>${guideLink('spec-traces', 'Spec traces')} · ${guideLink('gates', 'Gates &amp; receipts')} · ${essayLink('did-you-wash-your-hands', 'Did you wash your hands?')}</p>`],
    ],
  },
};

const ceremonyTiers = [
  ['trivial', 'Trivial change', 'Typos, links, comments, formatting, and corrections with an obvious result.', 'Edit → narrow check'],
  ['small-fix', 'Small fix', 'Contained bugs, local config or docs changes, and narrow test fixes.', 'Edit or debug → targeted checks'],
  ['feature', 'Feature or behavior change', 'Product behavior, UX, APIs, contracts, or durable intent.', 'Spec → plan as needed → work → review → compliance'],
  ['high-risk', 'High-risk or cross-cutting', 'Auth, payments, migrations, CI/CD, architecture, and changes that can expose or lose data.', 'Full path with human review and configured pipeline'],
];

export const ceremony = {
  id: 'ceremony',
  title: 'Choose the ceremony',
  intro: 'Choose the smallest safe workflow by asking what it would cost to undo the change. A cheap correction gets a short path. A change with consequences that survive a revert needs the full one.',
  wren: 'gathering',
  meta: [sourceLink('AGENTS.md#task-triage', '<code>AGENTS.md</code> · Task Triage')],
  preface: '<p>When checking every small edit becomes a chore, people start skipping checks. When the same short process covers a change that could permanently lose data, the team finds out about the risk after shipping. The installed <code>AGENTS.md</code> gives contributors four ways to size the work before it starts.</p>',
  aside: {
    title: 'Why reversibility?',
    text: 'Check the consequences that would be hardest to undo.',
    href: '?page=proof-over-trust#how-much-checking-is-enough',
    label: 'How much checking is enough',
  },
  aliases: {
    'triage-by-reversibility': 'one-question-decides-the-tier',
    examples: 'one-question-decides-the-tier',
    'revisit-when-risk-changes': 'recording-the-choice',
  },
  sections: [
    ['one-question-decides-the-tier', 'One question decides the tier', `
      <p>If the change is wrong, what does undoing it cost? Renaming an internal symbol across fifty files takes time to review, but the branch can be reverted. Dropping a populated column can take one line and affect data that a revert cannot restore. Start with the people, contracts, and data that would still be affected after the revert.</p>
      <p>Use these examples from <code>AGENTS.md</code> to find a starting point. If a supposedly local fix changes a shared contract, reassess the tier when that fact comes to light.</p>
      <ul class="ceremony-tiers">
        ${ceremonyTiers.map(([id, title, description, route], index) => `
          <li>
            <span class="tier-diamonds" aria-hidden="true">${'◆'.repeat(index + 1)}${'◇'.repeat(3 - index)}</span>
            <strong><a href="#${id}">${title}</a></strong>
            <p>${description}</p>
            <code>${route}</code>
          </li>`).join('')}
      </ul>`],
    ['trivial', 'Trivial changes go straight to the edit', `
      <p>Make the correction and run the narrowest relevant check. For a broken link, open the rendered page and follow the replacement. Specs, plans, compliance, and review are reserved for this tier when a person explicitly requests them.</p>
      <p>Take care with the word “obvious.” A typo in a user-facing paragraph fits this tier. A typo in a serialized field name may change a contract someone already depends on.</p>`],
    ['small-fix', 'Small fixes need a targeted check', `
      <p>Edit directly when the cause is clear. Use ${skill('aw-debug')} when a failure has competing explanations. Reproduce the issue or identify the check that would distinguish the real cause. After the edit, run that check and the nearby checks most likely to be affected.</p>
      <p>Suppose date formatting fails for the first day of a month in one view. Verify the failing input and the adjacent boundary in that view. Update durable docs when the fix changes behavior, workflow, setup, or intent that someone needs to know about.</p>`],
    ['feature', 'Feature work starts from intent', `
      <p>Make sure the ${guideLink('living-specs', 'living spec')} describes the accepted outcome. Use ${skill('aw-plan')} when dependencies or sequencing matter, and implement through the configured work step, which defaults to ${skill('aw-work')}. Map every acceptance criterion to a test or an explicit check. Before opening a PR, run review and ${skill('aw-check-workflow-compliance')}.</p>
      <p>For a new search empty state, agree on what a shopper sees when a filter removes all matches and what clearing it does. Cover the ordinary and empty results and verify that a search failure still gets its own treatment. That gives review a concrete promise to compare against the diff.</p>`],
    ['high-risk', 'High-risk work takes the full path', `
      <p>Use a spec with explicit acceptance criteria, a plan, human review, implementation, code review, workflow compliance, and the authorized commit and PR path with configured pipeline checks. Human review is part of this tier by default. For other tiers, use it when requested or when reviewers are configured. Missing required evidence needs an explicit decision from the person accountable for the risk.</p>
      <p>For a change to shared-document access, write down who currently has access, how revocation behaves, and what happens during rollout. Ask the reviewer to examine the permitted and denied cases and the expected behavior when the policy changes. The plan should explain which evidence establishes readiness to ship.</p>
      ${note('Watch the fold', 'Judge the consequences of undoing the change. A one-line migration can drop data permanently. A large generated file can be reproduced from its source.')}`],
    ['recording-the-choice', 'Recording the choice', `
      <p>When ${skill('aw-work')} starts from a bare request, it classifies the work and can record the selected tier with a short reason. Record the reason someone needs to understand the path, such as a change to the behavior users rely on.</p>
      <figure class="command"><figcaption>From the target repository</figcaption><pre tabindex="0"><code>node .scripts/aw-gate.js workflow-record tier --tier feature --reason "workflow behavior changed"
<span class="comment"># tiers: trivial | small_fix | feature | high_risk</span></code></pre></figure>
      <p>With <code>workflow_trace.enabled</code> in <code>docs/workflow/config.yml</code>, the helper writes a process event. With tracing disabled it exits without writing. <code>workflow-check</code> can report a missing tier event when <code>workflow_trace.require_tier</code> is enabled, and missing gate events listed under <code>workflow_trace.required_gates</code>. ${sourceLink('docs/workflow/gates.md#workflow-record', 'Workflow trace commands')}.</p>`],
  ],
};

export const startDetails = {
  overview: [
    ['read-the-repo', 'What to read on the first session', `
      <p>From the target checkout, read <code>AGENTS.md</code> for how the repo routes work and <code>docs/workflow/config.yml</code> for the providers and checks it has enabled. Then read the owning spec and the applicable entries in the standards index. Start with the artifacts the change can actually affect.</p>
      <pre class="tree" tabindex="0"><code>target-repo/
├── AGENTS.md                <span>← routing and local rules</span>
└── docs/
    ├── workflow/config.yml  <span>← providers and check settings</span>
    ├── features/index.yml   <span>← locate the living spec</span>
    ├── standards/index.yml  <span>← find relevant conventions</span>
    └── decisions/index.yml  <span>← recover earlier choices</span></code></pre>
      <p>For a change to local handoffs, start with the workstream spec and its acceptance scenarios, then read the installed progress guidance. A new contributor can inspect the ${sourceLink(progressSpec, 'public workstream spec')} before deciding whether a request changes behavior or only needs a documentation fix.</p>`],
    ['try-it-on-one-change', 'Try it on one change', `
      <p>Suppose an agent picks the newest progress record after finding two that match a plan. The public workstream spec requires an explicit choice in that case. Its acceptance scenario also asks the agent to reconcile the selected record with a changed checkout before restoring the next action.</p>
      ${handoffFlow('A first pass through AW can begin and end with one observable promise.', [
        ['ceremony', 'Choose the workflow', 'Check whether the current run contradicts the accepted requirement or reveals an open decision.'],
        ['spec-traces', 'Verify the boundary', 'Read PROG-002 and its scenario. Check the two-record case and the rule for reconciling the selected checkout.'],
        ['workstreams', 'Hand off the result', 'Leave the chosen source, checked revision, actual result, and action that remains.'],
      ])}
      <p>${sourceLink('docs/features/progress-tracking/progress-tracking.feature', 'Read the real resume scenario')}. The file distinguishes manual contract walkthroughs from installer scenarios. Record the kind of check you actually ran.</p>`],
    ['adopt-in-stages', 'Adopt the artifacts when they earn their place', `
      <p>Save a consequential choice when somebody else will have to reopen it. Add a shared spec when several people rely on the same feature promise. If repeated reviews still miss changes to a verified contract, choose checks and a gate that address that failure.</p>
      <p>${guideLink('concepts#what-to-adopt-first', 'Find an adoption path for your team')} and ${guideLink('skills', 'find the skill for the next step')}.</p>`],
  ],
  install: [
    ['inspect-the-installed-files', 'Inspect the installed files', `
      <p>After <code>aw init</code>, use <code>aw status</code> in the target checkout. The status output includes the installed AW version and reports which setup files it finds. The following is an excerpt of the healthy result from an isolated installation using the public AW source.</p>
      <figure class="command"><figcaption>Example output from aw status</figcaption><pre><code>ok: AGENTS.md
ok: docs/workflow/config.yml
ok: docs/standards/index.yml
ok: docs/features/index.yml</code></pre></figure>
      <p>Open <code>AGENTS.md</code> and make sure the project’s own guidance is present. Read <code>docs/workflow/config.yml</code> to see the effective policy. Keep the CLI version and the installed AW version separate when reporting an installation issue.</p>`],
    ['choose-optional-enforcement', 'Review the installed workflow checks', `
      <p><code>aw init</code> installs <code>.scripts/aw-gate.js</code> and enables gates, tracking, telemetry, spec traceability, workflow tracing, and behavior pins by default. Inspect the choices in <code>docs/workflow/config.yml</code> from the target checkout. A freshness policy should name which events it checks and whether it uses a time window or compares scoped files.</p>
      <p>For example, a repo can treat review as stale when reviewed files change while giving a periodic workflow audit an age limit. The ${guideLink('gates', 'Gates &amp; receipts')} chapter explains the two modes and how to read missing or stale results.</p>`],
    ['verify-a-first-session', 'Verify a first session', `
      <p>Check global skill availability with <code>aw doctor</code>. Then open a new session in the initialized checkout and give ${skill('aw-help')} a concrete request. For a broken link in the local README, expect a narrow edit and a rendered link check. Confirm the advice points at this checkout’s policy.</p>
      <p>If <code>aw status</code> is healthy but the agent cannot see the skill, inspect the global skill installation and the agent’s skill link. If the skill is available but reads the wrong config, first confirm the agent’s working directory and repository root.</p>`],
    ['install-from-a-checkout', 'Install from an AW checkout', `
      <p>The bundled installer is also available if you are working from an AW source checkout.</p>
      <figure class="command"><figcaption>From the AW source checkout</figcaption><pre tabindex="0"><code>skills/aw-init/scripts/install.sh --repo /path/to/target/repo</code></pre></figure>
      <p>For this installer, add <code>--with-gates</code> to include the deterministic helper. ${sourceLink('skills/aw-init/SKILL.md', 'Bundled installer instructions')}.</p>`],
  ],
  roles: [
    ['product', 'Product defines the outcome', `
      <p>State the problem, who encounters it, and which outcome matters. For bulk undo, identify who can use it, what must be restored, and which cases are still open. A PRD can preserve the original proposal. Put accepted behavior in the living spec where design and engineering can use it.</p>
      <p>Give the next role an example they can challenge. If an edit succeeds on three of four items, does undo restore just the successful three or attempt all four? Treat that as a product decision when it changes the promise to users.</p>`],
    ['design', 'Design makes the experience observable', `
      <p>Show the flow and the states a person will encounter. In the bulk-edit example, show how the person learns what will change, when they can undo it, and what recovery looks like after partial success. Probe a specific unresolved interpretation when seeing it could change the outcome.</p>
      <p>Capture what a person could explain after using the probe. If they misunderstood the affected count, carry that observation and the proposed correction into the ${guideLink('living-specs', 'living spec')}. See ${guideLink('experience-discovery', 'Experience discovery')} for the authorization and feedback steps.</p>`],
    ['engineering', 'Engineering returns evidence with the change', `
      <p>Work from the accepted examples. Map ordinary, empty, partial, and recovery cases to checks where they matter. If the requirements leave an implementation-sensitive choice open, bring the concrete example back to the owner and record the outcome.</p>
      <p>Return the changed revision, checks that ran, any unverified state, and the easiest way for someone else to inspect the actual result. A local checkpoint can preserve an open item without making it look accepted.</p>`],
    ['worked-handoff', 'Follow a prototype decision across roles', `
      <p>The public experience-discovery case asks a contributor to make an uncertain interpretation inspectable. An explicitly requested prototype can proceed within its stated scope. A human reaction, even a negative one, becomes evidence for the next decision.</p>
      ${handoffFlow('The handoff carries the decision and evidence each role needs.', [
        ['aw-prd', 'Product to design', 'Pass the user outcome, an example, and the point where different interpretations matter.'],
        ['aw-spec', 'Design to engineering', 'Pass the prototype observation, agreed behavior, open questions, and acceptance cases.'],
        ['aw-review', 'Engineering to review', 'Return the actual page or diff, checked scenarios, revision, and remaining evidence.'],
      ])}
      <p>${sourceLink(discoveryCases, 'Read S2 and S7 in the public acceptance scenarios')}. If the prototype is technically correct and a person says it feels wrong, the experience issue remains open until addressed or explicitly deferred.</p>`],
    ['before-the-pr', 'Review the same promise across roles', `
      <p>Have the reviewer trace the accepted behavior from the spec to the visible states and checks. For bulk undo, make sure the proof for full success does not quietly stand in for the partial-success policy. Link the decisions and checks so the next person can see how the team resolved the boundary.</p>`],
  ],
  credits: [
    ['theory-and-practice', 'Theory and practice', `<p><a href="${naur}">Peter Naur’s Programming as Theory Building</a> supplies the account of programming as a shared understanding. The ${guideLink('theory-building', 'Theory introduction')} applies the idea to agent-assisted changes. ${guideLink('essays', 'The essays')} develop the arguments about engineering judgment, checks, corrections, and handovers.</p>`],
    ['how-to-check-a-source', 'How to check a source in the guide', `
      <p>A guide excerpt that links to a commit shows the file as it was at that revision. Follow the link and compare the surrounding section when an example seems at odds with your installation. For a skill page, its source link identifies the bundled reference underneath the worked example.</p>
      <p>For example, begin with the ${sourceLink(progressSpec, 'public workstream spec')}, then compare the related verification file before treating its manual scenarios as automated test coverage.</p>`],
    ['contribute', 'Contribute a correction', `
      <p>Point to the guide section and the source behavior you observed. Include the installed AW version or source commit, the command or scope, and what happened. A concrete example helps a maintainer decide whether to fix an explanation or revisit a living requirement.</p>
      <p><a href="${repo.replace('/blob/main/', '')}">View the project on GitHub</a>.</p>`],
  ],
};

export const essayDetails = {
  'code-without-a-theory': [
    ['the-first-explanation', 'The first explanation is part of the work', '<p>When an agent produces a program before a team has discussed its constraints, the code may be the only coherent account of how it works. As soon as the team needs to change it, somebody must reconstruct why it was built that way and decide which behavior matters.</p>'],
    ['use-a-reference', 'Use a reference where one exists', '<p>If the program is replacing something that already runs, pick the observations worth preserving and compare the new behavior. For an unfamiliar product or architecture choice, expose the alternatives and ask somebody who understands the context to review them.</p>'],
    ['review-the-ability-to-change', 'Review the ability to change it', '<p>Ask a contributor to explain the path from the problem to the new code and to name the next change that would challenge their explanation. Capture the relevant decision or missing constraint so the next review can start from that evidence.</p><p><a href="?page=theory-building">Programming as theory building</a> · <a href="?page=behavior-pins">Behavior pins</a></p>'],
  ],
  'did-you-wash-your-hands': [
    ['the-claim-and-the-check', 'Keep the claim close to the check', '<p>A gate can see a recorded review, just as a checklist can show that somebody claimed to have washed their hands. The record is useful when somebody can connect it to an observed action. It remains a limited statement about a particular scope and moment.</p>'],
    ['state-the-limit', 'State the limit of the evidence', '<p>A passing test can show that the sample inputs behave as expected. A fresh receipt can show that a workflow recorded the check recently enough. The reviewer still needs to see which inputs and files were involved and decide whether the remaining uncertainty is acceptable.</p>'],
    ['use-it-in-review', 'Use it in the next review', '<p>Replace “checks passed” with the command, revision, relevant scenarios, and an honest account of anything you could not verify. Give the next reader enough detail to repeat the check or identify where a second check is needed.</p><p><a href="?page=gates">Gates &amp; receipts</a> · <a href="?page=proof-over-trust">Proof over trust</a></p>'],
  ],
  'teaching-the-repo-what-you-keep-correcting': [
    ['find-the-repeated-cause', 'Find the cause behind repeat corrections', '<p>Repeated corrections can mean that the work depends on a convention already understood by the team but hard to discover in the repo. Collect examples and check whether the same mistaken assumption explains them.</p>'],
    ['write-the-scope', 'Write the scope of the lesson', '<p>Preserve what happened, why the original approach failed, and a practical check or action for the next contributor. Cite the current code or decision. A lesson specific to one dependency or version should say so.</p>'],
    ['promote-when-earned', 'Promote a lesson when it earns a rule', '<p>A durable standard is worth maintaining when the rule applies repeatedly and reviewers can test compliance. A focused regression check may carry a different kind of lesson more reliably. Revisit guidance when the code or team’s assumptions change.</p><p><a href="?page=learnings">Learnings</a> · <a href="?page=standards">Standards</a></p>'],
  ],
  'picking-up-where-the-last-agent-stopped': [
    ['the-next-action', 'Write the next action as a concrete operation', '<p>A new session needs to know what was attempted, what remains, and which result supports the claim of progress. Record one actionable next step, with the command or file and the uncertainty it is meant to resolve.</p>'],
    ['reconcile', 'Reconcile the note with the checkout', '<p>Compare the note with the branch, revision, current diffs, and the source spec. If the code changed after a check, determine what needs to be repeated. A checkpoint can help find the evidence without making the evidence current by itself.</p>'],
    ['keep-intent-durable', 'Keep intent where future contributors will find it', '<p>Use the local workstream for live execution and a living spec or decision for information that must outlast that work. When work moves to another worktree, deliberately transfer the checkpoint and reconcile it there.</p><p><a href="?page=workstreams">Workstreams</a> · <a href="?page=session-memory">Session memory</a></p>'],
  ],
};
