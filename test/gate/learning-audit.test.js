#!/usr/bin/env node
'use strict';

// Learning audit-trail enforcement inside `aw-gate.js check`.
//
// A learning with an empty `derived-from` cannot be traced back to the session
// that produced it, so it can never be corroborated, expired on schedule, or
// attributed. The guard exists to fail on that, and on an `evidence-count` that
// disagrees with the identifier list.
//
// Per docs/standards/guard-verification.md this suite injects the violations
// the guard exists to catch and asserts a non-zero exit, and covers the
// excluded cases so a guard that fires on everything fails here too.
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

// Gates on, but no freshness checks configured: this suite is about the audit
// trail, and an unrecorded freshness gate would fail for an unrelated reason.
// A bare `checks:` opens an empty child mapping in this config parser. An
// inline `checks: {}` would misparse — flow maps are outside the supported
// subset — and the gate loop would then iterate string indices.
const CFG = ['gates:', '  enabled: true', '  checks:', ''].join('\n');
const CFG_DISABLED = ['gates:', '  enabled: false', '  checks:', ''].join('\n');

function makeRepo(configYml) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aw-learning-'));
  spawnSync('git', ['-C', root, 'init', '-q'], { encoding: 'utf8' });
  spawnSync('git', ['-C', root, 'config', 'user.email', 't@t'], { encoding: 'utf8' });
  spawnSync('git', ['-C', root, 'config', 'user.name', 't'], { encoding: 'utf8' });
  fs.mkdirSync(path.join(root, 'docs', 'workflow'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs', 'workflow', 'config.yml'), configYml);
  fs.writeFileSync(path.join(root, 'seed.txt'), 'seed\n');
  spawnSync('git', ['-C', root, 'add', '.'], { encoding: 'utf8' });
  spawnSync('git', ['-C', root, 'commit', '-q', '-m', 'seed'], { encoding: 'utf8' });
  return root;
}

function writeLearning(root, name, frontmatter) {
  const dir = path.join(root, 'docs', 'learnings');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, name),
    ['---', ...frontmatter, '---', '', '# Lesson', '', 'Body text.', ''].join('\n')
  );
}

function run(root) {
  return spawnSync(process.execPath, [CLI, 'check'], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, AW_REPO_ROOT: root },
  });
}

function goodFrontmatter() {
  return [
    'title: A good learning',
    'scope: repo',
    'status: tentative',
    'evidence-count: 2',
    'unconfirmed-runs: 0',
    'derived-from:',
    '  - 2026-08-01-first-session',
    '  - 2026-08-02-second-session',
  ];
}

// --- The violations the guard exists to catch ----------------------------

{
  // Injected violation: the exact shape observed in a real consuming repo —
  // a correction-triggered learning written mid-session with nothing to cite.
  const root = makeRepo(CFG);
  writeLearning(root, '2026-08-10-empty-trail.md', [
    'title: Empty trail',
    'scope: repo',
    'status: tentative',
    'evidence-count: 1',
    'unconfirmed-runs: 0',
    'derived-from: []',
  ]);
  const res = run(root);
  assert.strictEqual(res.status, 1, `expected exit 1, got ${res.status}: ${res.stdout}${res.stderr}`);
  assert.ok(/empty derived-from/.test(res.stderr), `expected empty-derived-from message, got: ${res.stderr}`);
  assert.ok(/2026-08-10-empty-trail\.md/.test(res.stderr), 'failure names the offending file');
  ok('inline empty derived-from fails the check');
}

{
  // The same defect written as an omitted block list rather than `[]`.
  const root = makeRepo(CFG);
  writeLearning(root, '2026-08-10-no-items.md', [
    'title: No items',
    'evidence-count: 1',
    'derived-from:',
    'tags:',
    '  - workflow',
  ]);
  const res = run(root);
  assert.strictEqual(res.status, 1, `expected exit 1, got ${res.status}`);
  assert.ok(/empty derived-from/.test(res.stderr), `expected empty-derived-from message, got: ${res.stderr}`);
  ok('block derived-from with no identifiers fails the check');
}

{
  // A count that disagrees with the list: plausible-looking, still unusable.
  const root = makeRepo(CFG);
  writeLearning(root, '2026-08-10-count-mismatch.md', [
    'title: Count mismatch',
    'evidence-count: 3',
    'derived-from:',
    '  - 2026-08-01-first-session',
    '  - 2026-08-02-second-session',
  ]);
  const res = run(root);
  assert.strictEqual(res.status, 1, `expected exit 1, got ${res.status}`);
  assert.ok(
    /evidence-count 3 but 2 derived-from/.test(res.stderr),
    `expected mismatch message, got: ${res.stderr}`
  );
  ok('evidence-count disagreeing with the identifier list fails the check');
}

// --- Cases the guard must NOT fire on ------------------------------------

{
  const root = makeRepo(CFG);
  writeLearning(root, '2026-08-10-good.md', goodFrontmatter());
  const res = run(root);
  assert.strictEqual(res.status, 0, `expected exit 0, got ${res.status}: ${res.stderr}`);
  ok('a well-formed learning passes');
}

{
  // Inline flow list is a legitimate shape and must count its items, not read
  // as empty the way a naive `[` test would.
  const root = makeRepo(CFG);
  writeLearning(root, '2026-08-10-inline.md', [
    'title: Inline list',
    'evidence-count: 2',
    'derived-from: [2026-08-01-first-session, 2026-08-02-second-session]',
  ]);
  const res = run(root);
  assert.strictEqual(res.status, 0, `expected exit 0, got ${res.status}: ${res.stderr}`);
  ok('populated inline derived-from passes');
}

{
  // No learnings directory at all: a repo that has never captured one is not
  // in violation. A guard that fired here would fire on everything.
  const root = makeRepo(CFG);
  const res = run(root);
  assert.strictEqual(res.status, 0, `expected exit 0, got ${res.status}: ${res.stderr}`);
  ok('a repo with no learnings directory passes');
}

{
  // index.yml lives beside the learnings and is not one. Reading it as a
  // learning would report a phantom violation on every repo.
  const root = makeRepo(CFG);
  writeLearning(root, '2026-08-10-good.md', goodFrontmatter());
  fs.writeFileSync(
    path.join(root, 'docs', 'learnings', 'index.yml'),
    'learnings:\n  - path: docs/learnings/2026-08-10-good.md\n'
  );
  const res = run(root);
  assert.strictEqual(res.status, 0, `expected exit 0, got ${res.status}: ${res.stderr}`);
  ok('index.yml beside the learnings is not treated as a learning');
}

{
  // A learning that predates the repo's memory loop has no session to cite.
  // The exemption travels in the file, with a stated reason.
  const root = makeRepo(CFG);
  writeLearning(root, '2026-05-24-predates-memory-loop.md', [
    'title: Predates the memory loop',
    'evidence-count: 1',
    'derived-from: []',
    'audit-trail-exempt: predates the memory loop; no session log exists to cite',
  ]);
  const res = run(root);
  assert.strictEqual(res.status, 0, `expected exit 0, got ${res.status}: ${res.stderr}`);
  ok('an empty derived-from with a stated exemption reason passes');
}

{
  // Near-miss: the key is present but says nothing. A bare marker would let
  // anyone silence the guard without justifying it in the diff.
  const root = makeRepo(CFG);
  writeLearning(root, '2026-05-24-blank-exemption.md', [
    'title: Blank exemption',
    'evidence-count: 1',
    'derived-from: []',
    'audit-trail-exempt:',
  ]);
  const res = run(root);
  assert.strictEqual(res.status, 1, `expected exit 1, got ${res.status}`);
  assert.ok(/empty derived-from/.test(res.stderr), `expected failure, got: ${res.stderr}`);
  ok('an exemption with no stated reason exempts nothing');
}

{
  // gates.enabled false is the consumer's opt-out of enforcement entirely.
  const root = makeRepo(CFG_DISABLED);
  writeLearning(root, '2026-08-10-empty-trail.md', [
    'title: Empty trail',
    'evidence-count: 1',
    'derived-from: []',
  ]);
  const res = run(root);
  assert.strictEqual(res.status, 0, `expected exit 0, got ${res.status}: ${res.stderr}`);
  ok('gates disabled skips the audit check');
}

process.stdout.write(`\n${passed} passing\n`);
