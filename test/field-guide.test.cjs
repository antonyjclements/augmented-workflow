const { test } = require('node:test');
const assert = require('node:assert/strict');

test('every guide article has substantive sections and valid article links', async () => {
  const { groups, groupPages } = await import('../assets/field-guide-content.mjs');
  const pages = groups.flatMap(groupPages);
  const byId = new Map(pages.map(page => [page.id, page]));
  assert.equal(byId.size, pages.length);

  for (const page of pages) {
    const sectionIds = page.sections.map(([id]) => id);
    assert.ok(sectionIds.length >= 3, page.id);
    assert.equal(new Set(sectionIds).size, sectionIds.length, page.id);

    const markup = [
      page.intro, page.preface, ...(page.meta ?? []), ...(page.facts ?? []).map(([, value]) => value),
      ...page.sections.map(([, , content]) => content),
    ].join(' ');
    assert.doesNotMatch(markup, /href="(?:technical|usage-guide)\.html"/, page.id);
    for (const [, target, anchor] of markup.matchAll(/href="\?page=([a-z0-9-]+)(?:#([a-z0-9-]+))?"/g)) {
      assert.ok(byId.has(target), page.id + ' links to missing article ' + target);
      if (anchor) {
        assert.ok(byId.get(target).sections.some(([id]) => id === anchor), page.id + ' links to missing section ' + anchor);
      }
    }
  }

  const install = byId.get('install');
  assert.match(install.intro, /aw-cli.*recommended/);
  assert.match(install.sections[0][2], /pipx install git\+https:\/\/github\.com\/antonyjclements\/aw-cli\.git\naw install/);
  assert.match(install.sections[0][2], /aw init\naw status/);
  assert.ok(install.sections.at(-1)[2].includes('skills/aw-init/scripts/install.sh'));

  const concepts = byId.get('concepts');
  assert.ok(concepts.preface);
  assert.match(concepts.sections.find(([id]) => id === 'from-problem-to-concept')[2], /<table>/);
  assert.match(byId.get('theory-building').aside.href, /Naur\.pdf$/i);
});

test('skill pages retain the generated source sections and independent replacement keys', async () => {
  const { groups, groupPages } = await import('../assets/field-guide-content.mjs');
  const { skillReferences } = await import('../assets/field-guide-skills.mjs');
  const pages = groups.flatMap(groupPages).filter(page => page.skill);
  assert.deepEqual(pages.map(page => page.id).sort(), Object.keys(skillReferences).sort());

  for (const page of pages) {
    const reference = skillReferences[page.id];
    assert.deepEqual(page.sections.slice(1), reference.sections, page.id);
    const [exampleId, , example] = page.sections[0];
    assert.equal(exampleId, page.id === 'aw-help' ? 'before-and-after' : 'worked-example');
    assert.match(example, page.id === 'aw-help' ? /aw-debug/ : /<ol class="concept-steps">[\s\S]+Source for this walkthrough/);
    assert.equal(page.skill.source, reference.source, page.id);
    assert.match(page.skill.source, new RegExp('/blob/[a-f0-9]{40}/skills/' + page.id + '/SKILL\\.md$'));
  }

  const byId = new Map(pages.map(page => [page.id, page]));
  assert.deepEqual(byId.get('aw-spec').skill.keys, ['steps.brainstorm', 'steps.create_spec']);
  assert.deepEqual(byId.get('aw-ship').skill.keys, ['steps.commit', 'steps.commit_push_pr']);
  const help = byId.get('aw-help');
  assert.deepEqual(help.skill.keys, []);
  assert.match(help.sections.find(([id]) => id === 'routing-reference')[2], /<table>/);
  assert.ok(help.sections.some(([id]) => id === 'before-and-after'));
});

test('expanded walkthroughs connect practical handoffs while preserving the Skills index alias', async () => {
  const { groups, groupPages } = await import('../assets/field-guide-content.mjs');
  const pages = new Map(groups.flatMap(groupPages).map(page => [page.id, page]));
  const handoffs = [
    ['overview', 'try-it-on-one-change'],
    ['roles', 'worked-handoff'],
    ['evidence', 'read-the-evidence-together'],
    ['skills', 'find-a-route'],
  ];
  for (const [id, sectionId] of handoffs) {
    const section = pages.get(id).sections.find(([id]) => id === sectionId);
    assert.match(section[2], /<figure class="handoff-flow">[\s\S]*<ol role="list">[\s\S]*<figcaption>/);
  }
  assert.equal(pages.get('skills').aliases.details, 'orient');
  for (const [, , content, url] of pages.get('essays').sections) {
    assert.match(content, /href="\?page=[a-z-]+#worked-example"/);
    assert.match(url, /^https:\/\//);
  }
});

test('artifact chapters preserve lifecycle walkthroughs and pinned public examples', async () => {
  const { groups, groupPages } = await import('../assets/field-guide-content.mjs');
  const byId = new Map(groups.flatMap(groupPages).map(page => [page.id, page]));
  const chapters = {
    'living-specs': ['what-a-spec-holds', 'intent-versus-plan', 'how-a-spec-gets-written', 'the-feature-index', 'keeping-it-current'],
    plans: ['why-plans-expire', 'what-goes-in-a-plan', 'from-units-to-tickets', 'deepening-a-plan'],
    decisions: ['why-decisions-get-their-own-file', 'when-to-record-one', 'anatomy-of-a-record', 'superseding-a-decision', 'where-it-lives', 'how-agents-use-them'],
    learnings: ['from-correction-to-lesson', 'anatomy-of-a-learning', 'earning-trust', 'repo-global-and-org-scope', 'promotion-toward-standards'],
    standards: ['what-a-standard-is', 'anatomy-of-a-standard', 'the-index-is-the-entry-point', 'loading-only-what-applies', 'discovering-standards-from-the-code', 'org-wide-standards'],
  };
  for (const [id, sections] of Object.entries(chapters)) {
    const page = byId.get(id);
    assert.deepEqual(page.sections.map(([key]) => key), [...sections, 'related'], id);
    assert.ok(Object.values(page.aliases).every(target => sections.includes(target)), id);
    assert.ok(byId.has(new URLSearchParams(page.aside.href).get('page')), id);
    assert.match(page.sections.map(([, , body]) => body).join(''), /<figcaption><a href="https:\/\/github\.com\/[^"]+\/blob\/[a-f0-9]{40}\/docs\//, id);
  }

  const body = (id, section) => byId.get(id).sections.find(([key]) => key === section)[2];
  assert.equal([...body('decisions', 'superseding-a-decision').matchAll(/<time datetime=/g)].length, 3);
  assert.equal([...body('learnings', 'earning-trust').matchAll(/<th scope="row">/g)].length, 3);
  assert.equal([...body('plans', 'from-units-to-tickets').matchAll(/<li>/g)].length, 5);
  assert.equal([...body('standards', 'discovering-standards-from-the-code').matchAll(/<li>/g)].length, 4);
});

test('every concept chapter offers a sourced walkthrough and preserves its section links', async () => {
  const { groups, groupPages } = await import('../assets/field-guide-content.mjs');
  const group = groups.find(({ title }) => title === 'Concepts');
  const [overview, ...chapters] = groupPages(group);
  const overviewContent = overview.sections.map(([, , body]) => body).join('');
  const previousSections = {
    solutions: ['details', 'worked-example', 'reuse'],
    'session-memory': ['details', 'synthesis', 'worked-example'],
    gates: ['details', 'receipts', 'diagnose'],
    'spec-traces': ['details', 'worked-example', 'check-meaning'],
    workstreams: ['details', 'resume', 'worked-example', 'close'],
    'behavior-pins': ['details', 'compare', 'worked-example'],
    'experience-discovery': ['details', 'worked-example', 'carry-forward'],
    'replaceable-steps': ['details', 'keep-routes-distinct', 'worked-example'],
    workspaces: ['when-work-spans-repos', 'marking-the-folder', 'checking-with-the-cli', 'how-the-root-is-found', 'a-walk-with-limits', 'what-changes'],
  };

  assert.equal(chapters.length, 14);
  for (const page of chapters) {
    const sections = page.sections.map(([id]) => id);
    const article = page.sections.map(([, , body]) => body).join('');
    assert.ok(overviewContent.includes('?page=' + page.id + '"'), page.id);
    assert.equal(page.facts.length, 4, page.id);
    assert.ok(page.aside && page.meta.length > 0, page.id);
    assert.ok(sections.length >= 5, page.id);
    assert.equal(sections.at(-1), 'related', page.id);
    assert.match(article, /github\.com\/antonyjclements\/augmented-workflow\/blob\/[a-f0-9]{40}\//, page.id);
    assert.match(article, /class="command|class="concept-steps|class="compact-table/, page.id);
    for (const id of previousSections[page.id] ?? []) {
      assert.ok(sections.includes(id) || sections.includes(page.aliases?.[id]), page.id + '#' + id);
    }
  }
});

test('essay listings and links use the original GitHub Pages posts in a new tab', async () => {
  const { groups } = await import('../assets/field-guide-content.mjs');
  const [index, ...notes] = groups.find(group => group.title === 'Essays').pages;
  const expectedUrls = notes.map(note => 'https://antonyjclements.github.io/posts/' + note.id + '/');

  assert.equal(notes.length, 4);
  assert.deepEqual(index.sections.map(([, , , href]) => href), expectedUrls);
  for (const [position, note] of notes.entries()) {
    assert.equal(note.externalUrl, expectedUrls[position]);
    assert.ok(note.meta.some(markup => markup.includes('href="' + note.externalUrl + '" target="_blank" rel="noopener noreferrer"')));
  }
});

test('the introductory walkthroughs link from choices and examples to the applicable guide sections', async () => {
  const { groups, groupPages } = await import('../assets/field-guide-content.mjs');
  const pages = new Map(groups.flatMap(groupPages).map(page => [page.id, page]));
  const section = (pageId, sectionId) => pages.get(pageId).sections.find(([id]) => id === sectionId)[2];

  const ceremony = pages.get('ceremony');
  const tiers = ['trivial', 'small-fix', 'feature', 'high-risk'];
  assert.deepEqual(ceremony.sections.map(([id]) => id), ['one-question-decides-the-tier', ...tiers, 'recording-the-choice']);
  for (const tier of tiers) assert.ok(section('ceremony', 'one-question-decides-the-tier').includes('href="#' + tier + '"'));
  assert.match(section('ceremony', 'recording-the-choice'), /workflow-record tier --tier feature/);
  assert.match(section('theory-building', 'what-a-theory-holds'), /class="fold-diagram"/);
  for (const id of ['living-specs', 'decisions', 'learnings', 'standards', 'gates']) {
    assert.ok(section('theory-building', 'evidence-not-encoding').includes('href="?page=' + id + '"'));
  }
  const adoption = section('concepts', 'what-to-adopt-first');
  assert.match(adoption, /class="adoption-cards"/);
  assert.match(adoption, /Solo or pair[\s\S]*Small team[\s\S]*Larger team or multi-repo/);
});
