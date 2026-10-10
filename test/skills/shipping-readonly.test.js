#!/usr/bin/env node
'use strict';

// Disposable Git fixture proof, not model-behavior proof. It demonstrates why
// the description instructions require configuration-only detection and API-only
// reads for partial/promisor clones. No real repository or remote is modified.
const assert = require('assert');
const cp = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aw-shipping-readonly-'));
const env = { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null',
  GIT_TERMINAL_PROMPT: '0', GIT_OPTIONAL_LOCKS: '0' };
function git(cwd, args, allowed = [0]) {
  const result = cp.spawnSync('git', args, { cwd, env, encoding: 'utf8' });
  assert(allowed.includes(result.status), `git ${args.join(' ')} exited ${result.status}: ${result.stderr}`);
  return result.stdout.trim();
}
function packs(repo) {
  const dir = path.join(repo, '.git/objects/pack');
  return fs.readdirSync(dir).filter((name) => name.endsWith('.pack')).sort()
    .map((name) => [name, crypto.createHash('sha256').update(fs.readFileSync(path.join(dir, name))).digest('hex')]);
}
function descriptionLocalReadsAllowed(repo) {
  // This is the instruction's prescribed configuration-only check. It is not a
  // shipping tool or a substitute for runtime permission evaluation.
  const partial = git(repo, ['config', '--get', 'extensions.partialClone'], [0, 1]);
  const promisor = git(repo, ['config', '--get-regexp', '^remote\\..*\\.(promisor|partialclonefilter)$'], [0, 1]);
  return !partial && !promisor;
}
try {
  const origin = path.join(root, 'origin');
  fs.mkdirSync(origin);
  git(origin, ['init', '-q', '-b', 'main']);
  git(origin, ['config', 'user.name', 'Shipping fixture']);
  git(origin, ['config', 'user.email', 'fixture@example.invalid']);
  git(origin, ['config', 'uploadpack.allowFilter', 'true']);
  fs.writeFileSync(path.join(origin, 'example.txt'), 'before\n');
  git(origin, ['add', 'example.txt']);
  git(origin, ['commit', '-q', '-m', 'fixture before']);
  fs.writeFileSync(path.join(origin, 'example.txt'), 'after\n');
  git(origin, ['commit', '-qam', 'fixture after']);
  const remote = pathToFileURL(origin).href;
  const unsafe = path.join(root, 'unsafe');
  const safe = path.join(root, 'safe');
  const full = path.join(root, 'full');
  for (const destination of [unsafe, safe]) {
    git(root, ['clone', '-q', '--no-checkout', '--filter=blob:none', remote, destination]);
  }
  git(root, ['clone', '-q', '--no-checkout', remote, full]);

  const beforeUnsafe = packs(unsafe);
  const output = git(unsafe, ['--no-pager', 'diff', '--no-ext-diff', '--no-textconv', 'HEAD~1', 'HEAD']);
  assert(output.includes('-before') && output.includes('+after'));
  assert(packs(unsafe).length > beforeUnsafe.length, 'negative control must prove diff lazily fetched missing blobs');
  console.log('ok - negative control: optional-lock-free diff still mutates a promisor clone');

  const beforeSafe = packs(safe);
  assert.strictEqual(descriptionLocalReadsAllowed(safe), false, 'promisor clone must require API-only evidence');
  assert.deepStrictEqual(packs(safe), beforeSafe, 'configuration-only routing must leave object packs unchanged');
  console.log('ok - safe recipe: detect partial clone using config only; skip local object reads');

  const beforeFull = packs(full);
  assert.strictEqual(descriptionLocalReadsAllowed(full), true, 'complete clone should allow local read-only evidence');
  const fullOutput = git(full, ['--no-pager', 'diff', '--no-ext-diff', '--no-textconv', 'HEAD~1', 'HEAD']);
  assert(fullOutput.includes('-before') && fullOutput.includes('+after'));
  assert.deepStrictEqual(packs(full), beforeFull, 'complete-clone diff must not change object packs');
  console.log('ok - near miss: complete clone permits local diff without object writes');
  console.log('\n3 passed (Git recipe fixtures, not agent routing or permission adherence)');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
