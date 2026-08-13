#!/usr/bin/env node
'use strict';

// Derived-state validation inside `aw-gate.js check`.
//
// Registries and the context wiki are generated from source artifacts, so they
// drift silently: a spec never indexed, an index entry pointing at a renamed
// file, a learning citing a session log that retention deleted. Nothing fails
// at runtime — an agent just follows a pointer to a file that is not there.
//
// Per docs/standards/guard-verification.md this suite injects each violation
// and asserts a non-zero exit, and covers the excluded and near-miss cases so a
// guard that fires on everything fails here too.
//
// Dependency-free: runs the real CLI against a throwaway git repo via AW_REPO_ROOT.

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const CLI = path.resolve(__dirname, '..', '..', '.scripts', 'aw-gate.js');

let passed = 0;
function ok(name) {
  passed += 1;
  process.stdout.write(`ok - ${name}\n`);
}

const CFG = ['gates:', '  enabled: true', '  checks:', ''].join('\n');

function makeRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aw-derived-'));
  spawnSync('git', ['-C', root, 'init', '-q'], { encoding: 'utf8' });
  spawnSync('git', ['-C', root, 'config', 'user.email', 't@t'], { encoding: 'utf8' });
  spawnSync('git', ['-C', root, 'config', 'user.name', 't'], { encoding: 'utf8' });
  fs.mkdirSync(path.join(root, 'docs', 'workflow'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs', 'workflow', 'config.yml'), CFG);
  fs.writeFileSync(path.join(root, 'seed.txt'), 'seed\n');
  spawnSync('git', ['-C', root, 'add', '.'], { encoding: 'utf8' });
  spawnSync('git', ['-C', root, 'commit', '-q', '-m', 'seed'], { encoding: 'utf8' });
  return root;
}

function write(root, rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

function run(root) {
  return spawnSync(process.execPath, [CLI, 'check'], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, AW_REPO_ROOT: root },
  });
}

// A feature spec plus a matching index entry: the shape everything else varies.
function seedFeature(root) {
  write(root, 'docs/features/alpha/spec.md', '# Alpha\n');
  write(
    root,
    'docs/features/index.yml',
    ['features:', '  - key: alpha', '    title: Alpha', '    spec: docs/features/alpha/spec.md', '    tags:', '      - one', ''].join('\n')
  );
}

// --- The violations the guard exists to catch ----------------------------

{
  const root = makeRepo();
  seedFeature(root);
  write(root, 'docs/features/beta/spec.md', '# Beta\n');
  const res = run(root);
  assert.strictEqual(res.status, 1, `expected exit 1, got ${res.status}: ${res.stdout}`);
  assert.ok(/spec not indexed: docs\/features\/beta\/spec\.md/.test(res.stderr), res.stderr);
  ok('a feature spec missing from the index fails the check');
}

{
  const root = makeRepo();
  write(
    root,
    'docs/decisions/index.yml',
    ['decisions:', '  - path: docs/decisions/2026-01-01-gone.md', '    title: Gone', ''].join('\n')
  );
  const res = run(root);
  assert.strictEqual(res.status, 1, `expected exit 1, got ${res.status}`);
  assert.ok(/indexed path missing: docs\/decisions\/2026-01-01-gone\.md/.test(res.stderr), res.stderr);
  ok('an index entry pointing at a missing file fails the check');
}

{
  const root = makeRepo();
  seedFeature(root);
  write(
    root,
    'docs/learnings/2026-08-01-cites-a-path.md',
    ['---', 'title: Cites a path', 'evidence-count: 1', 'derived-from:', '  - 2026-08-01-a-session', '---', '', 'See docs/sessions/2026-08-01-a-session.md for detail.', ''].join('\n')
  );
  const res = run(root);
  assert.strictEqual(res.status, 1, `expected exit 1, got ${res.status}`);
  assert.ok(/cites a session by path/.test(res.stderr), res.stderr);
  ok('a durable artifact citing a session by path fails the check');
}

{
  const root = makeRepo();
  seedFeature(root);
  write(root, 'docs/context/wiki.md', '# Wiki\n\n- `docs/features/nope/spec.md` — gone\n');
  const res = run(root);
  assert.strictEqual(res.status, 1, `expected exit 1, got ${res.status}`);
  assert.ok(/referenced path missing: docs\/features\/nope\/spec\.md/.test(res.stderr), res.stderr);
  ok('a wiki pointing at a missing path fails the check');
}

{
  // A malformed index must be reported, not silently half-read. A parser that
  // guessed here would report safety it does not provide.
  const root = makeRepo();
  write(root, 'docs/standards/index.yml', ['standards:', '\t- path: docs/standards/a.md', ''].join('\n'));
  const res = run(root);
  assert.strictEqual(res.status, 1, `expected exit 1, got ${res.status}`);
  assert.ok(/tab used for indentation/.test(res.stderr), res.stderr);
  ok('an index indented with a tab fails the check');
}

{
  const root = makeRepo();
  write(root, 'docs/standards/index.yml', ['standards:', '  - path: docs/standards/a.md', '    title: A', 'last_reviewed: 2026-01-01', ''].join('\n'));
  const res = run(root);
  assert.strictEqual(res.status, 1, `expected exit 1, got ${res.status}`);
  assert.ok(/indexed path missing: docs\/standards\/a\.md/.test(res.stderr), res.stderr);
  ok('a scalar sibling of the list does not mask a missing indexed path');
}

// --- Cases the guard must NOT fire on ------------------------------------

{
  const root = makeRepo();
  seedFeature(root);
  write(
    root,
    'docs/standards/a.md',
    '# A\n'
  );
  write(root, 'docs/standards/index.yml', ['standards:', '  - path: docs/standards/a.md', '    title: A', '    tags:', '      - x', ''].join('\n'));
  write(root, 'docs/product/prds/index.yml', 'prds: []\n');
  write(root, 'docs/context/wiki.md', '# Wiki\n\n- `docs/features/alpha/spec.md` — present\n');
  const res = run(root);
  assert.strictEqual(res.status, 0, `expected exit 0, got ${res.status}: ${res.stderr}`);
  ok('a consistent set of registries, wiki, and specs passes');
}

{
  // An empty registry is the installer's initial state, not a violation.
  const root = makeRepo();
  write(root, 'docs/product/prds/index.yml', 'prds: []\n');
  const res = run(root);
  assert.strictEqual(res.status, 0, `expected exit 0, got ${res.status}: ${res.stderr}`);
  ok('an empty "[]" registry passes');
}

{
  // A top-level scalar beside the list is ordinary YAML — the installer leaves
  // such an index alone rather than appending to it, and validation must not
  // reject the shape it deliberately preserves.
  const root = makeRepo();
  write(root, 'docs/standards/a.md', '# A\n');
  write(root, 'docs/standards/index.yml', ['standards:', '  - path: docs/standards/a.md', '    title: A', 'last_reviewed: 2026-01-01', ''].join('\n'));
  const res = run(root);
  assert.strictEqual(res.status, 0, `expected exit 0, got ${res.status}: ${res.stderr}`);
  ok('a scalar sibling of the list passes');
}

{
  // Comments and blank lines are ordinary in a hand-maintained index.
  const root = makeRepo();
  write(
    root,
    'docs/standards/index.yml',
    ['# generated by aw-refresh', '', 'standards:', '', '  # the first one', '  - path: docs/standards/a.md', '    title: A', ''].join('\n')
  );
  write(root, 'docs/standards/a.md', '# A\n');
  const res = run(root);
  assert.strictEqual(res.status, 0, `expected exit 0, got ${res.status}: ${res.stderr}`);
  ok('comments and blank lines in an index pass');
}

{
  // A repo with no docs/ tree at all — nothing derived, nothing to validate.
  const root = makeRepo();
  fs.rmSync(path.join(root, 'docs', 'workflow', 'config.yml'));
  write(root, 'docs/workflow/config.yml', CFG);
  const res = run(root);
  assert.strictEqual(res.status, 0, `expected exit 0, got ${res.status}: ${res.stderr}`);
  ok('a repo with no registries passes');
}

{
  // Near-miss: a session identifier is the correct citation and must not be
  // mistaken for a path. Firing here would punish the fix.
  const root = makeRepo();
  seedFeature(root);
  write(
    root,
    'docs/learnings/2026-08-01-cites-an-identifier.md',
    ['---', 'title: Cites an identifier', 'evidence-count: 1', 'derived-from:', '  - 2026-08-01-a-session', '---', '', 'Derived from 2026-08-01-a-session.', ''].join('\n')
  );
  const res = run(root);
  assert.strictEqual(res.status, 0, `expected exit 0, got ${res.status}: ${res.stderr}`);
  ok('citing a session by identifier rather than path passes');
}

{
  // Non-repo paths in the wiki (URLs, prose) are not file references.
  const root = makeRepo();
  seedFeature(root);
  write(root, 'docs/context/wiki.md', '# Wiki\n\nSee https://example.com/docs/thing.md and `some/other/path.md`.\n');
  const res = run(root);
  assert.strictEqual(res.status, 0, `expected exit 0, got ${res.status}: ${res.stderr}`);
  ok('wiki references outside docs/, scripts/, skills/ are not checked');
}

{
  const root = makeRepo();
  write(root, 'docs/workflow/config.yml', ['gates:', '  enabled: false', '  checks:', ''].join('\n'));
  write(root, 'docs/features/beta/spec.md', '# Beta\n');
  write(root, 'docs/features/index.yml', 'features: []\n');
  const res = run(root);
  assert.strictEqual(res.status, 0, `expected exit 0, got ${res.status}: ${res.stderr}`);
  ok('gates disabled skips derived-state validation');
}

process.stdout.write(`\n${passed} passing\n`);
