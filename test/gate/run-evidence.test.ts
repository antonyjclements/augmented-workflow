'use strict';
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const helper = process.env.AW_RUN_HELPER || path.resolve(__dirname, '../../.scripts/aw-gate.js');
const roots = [];
let passed = 0;
function git(root, args) {
  const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' });
  assert.strictEqual(result.status, 0, result.stderr);
  return result.stdout;
}
function repo(ignore = true) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aw-run-evidence-')); roots.push(root);
  git(root, ['init', '-q']);
  fs.writeFileSync(path.join(root, '.gitignore'), ignore ? '/.aw/runs/\n/.aw/tmp/\n' : '');
  fs.mkdirSync(path.join(root, 'docs/workflow'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs/workflow/config.yml'), 'tracking:\n  enabled: false\ngates:\n  enabled: false\n');
  return root;
}
function run(root, args, status = 0) {
  const result = spawnSync(process.execPath, [helper, 'run', ...args], {
    env: { ...process.env, AW_REPO_ROOT: root }, encoding: 'utf8',
  });
  assert.strictEqual(result.status, status, result.stderr || result.stdout);
  return result;
}
function json(root, args) { return JSON.parse(run(root, args).stdout); }
function start(root, slug = 'one') {
  return json(root, ['start', '--session', `2026-11-06-${slug}`, '--summary', 'Scoped test task']);
}
function sourcePath(root, record) { return path.join(root, `docs/sessions/${record.session_id}.md`); }
function fill(root, record) {
  const file = sourcePath(root, record);
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(
    '## What Worked\n\n_none_', '## What Worked\n\n- Focused tests passed.'
  ).replace('## Corrections Made\n\n_none_', '## Corrections Made\n\n- User requested a real source before citing the lesson.'));
}
function report(record, overrides = {}) {
  return { outcome: 'completed', summary: 'Scoped implementation complete', corrections_status: 'reviewed',
    checks: [{ name: 'focused tests', status: 'passed', evidence: { session: record.session_id, section: 'What Worked' } }],
    corrections: [{ kind: 'correction', topic: 'source-provenance', summary: 'Missing source corrected',
      evidence: { session: record.session_id, section: 'Corrections Made' } }], ...overrides };
}
function finish(root, record, input = report(record), status = 0) {
  const dir = path.join(root, '.aw/tmp'); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'report.json'), JSON.stringify(input));
  return run(root, ['finish', '--id', record.run_id, '--input', '.aw/tmp/report.json'], status);
}
function test(name, fn) { fn(); passed++; process.stdout.write(`ok ${passed} - ${name}\n`); }
try {
  // @spec:WFE-001
  test('explicit lifecycle works with tracking and gates disabled; no tracking/session/gate writes', () => {
    const root = repo(); const record = start(root); fill(root, record);
    const result = JSON.parse(finish(root, record).stdout);
    assert.strictEqual(result.run_id, record.run_id); assert.strictEqual(result.status, 'finished');
    assert.strictEqual(result.report.outcome, 'completed'); assert.match(result.source_sha256, /^[a-f0-9]{64}$/);
    assert.match(record.start_context.worktree_sha256, /^[a-f0-9]{64}$/);
    assert.notStrictEqual(result.finish_context.worktree_sha256, record.start_context.worktree_sha256);
    assert.match(result.finish_context.limitations, /check execution state not inferred/);
    assert.strictEqual(fs.existsSync(path.join(root, '.aw/session')), false);
    assert.strictEqual(fs.existsSync(path.join(root, '.aw-gate-state.json')), false);
    assert.match(finish(root, record, report(record), 1).stderr, /immutable/);
  });
  // @spec:WFE-002
  test('worktree fingerprint identifies untracked contents, not just dirty status', () => {
    const one = repo(); const two = repo(); const same = repo();
    fs.writeFileSync(path.join(one, 'untracked.txt'), 'one');
    fs.writeFileSync(path.join(two, 'untracked.txt'), 'two');
    fs.writeFileSync(path.join(same, 'untracked.txt'), 'one');
    const a = start(one).start_context; const b = start(two).start_context; const c = start(same).start_context;
    assert.strictEqual(a.head, null); assert.strictEqual(a.dirty, b.dirty);
    assert.notStrictEqual(a.worktree_sha256, b.worktree_sha256);
    assert.strictEqual(a.worktree_sha256, c.worktree_sha256);
  });
  // @spec:WFE-002
  test('start creates a real reusable final source citation and distinct parallel IDs', () => {
    const root = repo(); const one = start(root); const two = start(root, 'two');
    assert.notStrictEqual(one.run_id, two.run_id);
    assert.match(fs.readFileSync(sourcePath(root, one), 'utf8'), new RegExp(`run_id: ${one.run_id}`));
    assert.match(run(root, ['start', '--session', one.session_id, '--summary', 'collision'], 1).stderr, /already exists/);
    assert.strictEqual(fs.readFileSync(sourcePath(root, one), 'utf8').includes('collision'), false);
  });
  // @spec:WFE-001
  test('unsafe or nonlocal identity and unknown CLI flags fail before writes', () => {
    const root = repo();
    for (const session of ['../../escape', 'UUID', '/tmp/source', '2026-11-06-x\ny']) {
      assert.match(run(root, ['start', '--session', session, '--summary', 'task'], 1).stderr, /session/);
    }
    run(root, ['start', '--session', '2026-11-06-one', '--summary', 'task', '--execute', 'true'], 1);
    assert.strictEqual(fs.existsSync(path.join(root, '.aw')), false);
    assert.strictEqual(fs.existsSync(path.join(root, 'docs/sessions')), false);
  });
  // @spec:WFE-002
  test('unignored local records and symlinked ancestors are refused', () => {
    const root = repo(false);
    assert.match(run(root, ['start', '--session', '2026-11-06-one', '--summary', 'task'], 1).stderr, /git-ignored/);
    assert.strictEqual(fs.existsSync(path.join(root, 'docs/sessions')), false);
    const safe = repo(); const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'aw-run-outside-')); roots.push(outside);
    fs.symlinkSync(outside, path.join(safe, '.aw'));
    assert.match(run(safe, ['start', '--session', '2026-11-06-one', '--summary', 'task'], 1).stderr, /symlink/);
    assert.deepStrictEqual(fs.readdirSync(outside), []);
  });
  // @spec:WFE-002
  test('unbacked passed checks, empty correction evidence and wrong session cannot finish', () => {
    const root = repo(); const record = start(root);
    assert.match(finish(root, record, report(record), 1).stderr, /no content/);
    fill(root, record);
    const wrong = report(record); wrong.corrections[0].evidence.session = '2026-11-06-other';
    assert.match(finish(root, record, wrong, 1).stderr, /this run source session/);
    const bad = report(record); bad.checks[0].status = 'success';
    assert.match(finish(root, record, bad, 1).stderr, /check status/);
    assert.strictEqual(json(root, ['review']).excluded[0].reason, 'active');
  });
  // @spec:WFE-002
  test('transcript/unknown fields rejected; strings are not executed', () => {
    const root = repo(); const record = start(root); fill(root, record);
    assert.match(finish(root, record, report(record, { transcript: 'private conversation' }), 1).stderr, /unsupported field transcript/);
    const input = report(record, { summary: '$(touch injected); `touch injected`' });
    input.checks.push({ name: 'command never run', status: 'not-run', reason: 'Runtime unavailable' });
    finish(root, record, input);
    assert.strictEqual(fs.existsSync(path.join(root, 'injected')), false);
    assert.strictEqual(json(root, ['review']).coverage.completed, 1);
  });
  // @spec:WFE-002
  test('quoted/commented metadata is canonicalized and duplicate identity fields are rejected', () => {
    const root = repo(); const one = start(root); fill(root, one);
    const file = sourcePath(root, one);
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('run_state: active', 'run_state: "active" # still active'));
    finish(root, one);
    assert.match(fs.readFileSync(file, 'utf8'), /^run_state: finished$/m);
    assert.strictEqual(json(root, ['review']).coverage.completed, 1);
    const two = start(root, 'two'); fill(root, two); const other = sourcePath(root, two);
    fs.writeFileSync(other, fs.readFileSync(other, 'utf8').replace('run_state: active', 'run_state: active\nrun_state: active'));
    assert.match(finish(root, two, report(two), 1).stderr, /exactly one run_state/);
  });
  // @spec:WFE-001
  test('unknown capture and skipped checks remain explicit; skipped checks need reasons', () => {
    const root = repo(); const record = start(root); fill(root, record);
    assert.match(finish(root, record, report(record, { checks: [{ name: 'runtime', status: 'skipped' }] }), 1).stderr, /reason/);
    finish(root, record, report(record, { corrections_status: 'unknown', corrections: [], checks: [] }));
    assert.deepStrictEqual(json(root, ['review']).coverage, { completed: 1, capture_reviewed: 0, capture_unknown: 1 });
  });
  // @spec:WFE-003
  test('recurrence requires two completed distinct sessions; duplicate mentions count once', () => {
    const root = repo(); const one = start(root); fill(root, one);
    const input = report(one); input.corrections.push(input.corrections[0]); finish(root, one, input);
    assert.deepStrictEqual(json(root, ['review']).observations, []);
    const two = start(root, 'two'); fill(root, two); finish(root, two);
    const review = json(root, ['review']);
    assert.strictEqual(review.observations.length, 1); assert.strictEqual(review.observations[0].distinct_sessions, 2);
    assert.ok(review.observations[0].alternative_explanations.length);
    assert.strictEqual(review.evaluation, 'not-run'); assert.match(review.adoption, /human approval/);
    assert.deepStrictEqual(json(root, ['review', '--ids', one.run_id]).observations, []);
  });
  // @spec:WFE-003
  test('active, partial, abandoned and unknown outcomes excluded; clean session is not recurrence', () => {
    const root = repo(); start(root);
    for (const outcome of ['partial', 'abandoned', 'unknown']) {
      const record = start(root, outcome); fill(root, record); finish(root, record, report(record, { outcome }));
    }
    const clean = start(root, 'clean'); fill(root, clean); finish(root, clean, report(clean, { corrections: [] }));
    const review = json(root, ['review']);
    assert.strictEqual(review.excluded.length, 4); assert.strictEqual(review.coverage.completed, 1);
    assert.deepStrictEqual(review.observations, []);
  });
  // @spec:WFE-002
  test('changed/missing source is excluded rather than treated as corroboration', () => {
    const root = repo(); const one = start(root); fill(root, one); finish(root, one);
    fs.appendFileSync(sourcePath(root, one), '\nDifferent evidence\n');
    assert.match(json(root, ['review']).excluded[0].reason, /source changed/);
    fs.unlinkSync(sourcePath(root, one));
    assert.match(json(root, ['review']).excluded[0].reason, /source unavailable/);
  });
  // @spec:WFE-002
  test('processed status and exact Git-archived source survive retention; source ID cannot be recycled', () => {
    const root = repo(); const one = start(root); fill(root, one); finish(root, one);
    const file = sourcePath(root, one);
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('status: unprocessed', 'status: processed'));
    assert.strictEqual(json(root, ['review']).coverage.completed, 1);
    git(root, ['add', 'docs', '.gitignore']);
    git(root, ['-c', 'user.name=AW test', '-c', 'user.email=aw@example.test', '-c', 'core.hooksPath=/dev/null', 'commit', '-qm', 'archive source']);
    fs.unlinkSync(file);
    assert.strictEqual(json(root, ['review']).coverage.completed, 1);
    assert.match(run(root, ['start', '--session', one.session_id, '--summary', 'reuse'], 1).stderr, /Git history/);
  });
  // @spec:WFE-003
  test('review is read-only and reports malformed or missing selected runs', () => {
    const root = repo(); const one = start(root); fill(root, one); finish(root, one);
    const before = git(root, ['status', '--porcelain']);
    const file = path.join(root, `.aw/runs/${one.run_id}.json`);
    const bytes = fs.readFileSync(file); const modified = fs.statSync(file).mtimeMs;
    json(root, ['review']);
    assert.strictEqual(git(root, ['status', '--porcelain']), before);
    assert.deepStrictEqual(fs.readFileSync(file), bytes); assert.strictEqual(fs.statSync(file).mtimeMs, modified);
    fs.writeFileSync(file, '{broken'); assert.strictEqual(json(root, ['review']).excluded.length, 1);
    const absent = '00000000-0000-4000-8000-000000000000';
    assert.strictEqual(json(root, ['review', '--ids', absent]).excluded[0].run_id, absent);
    run(root, ['review', '--ids', `${one.run_id},${one.run_id}`], 1);
  });
  // @spec:WFE-002
  test('partial/promisor clone never attempts history recovery or source-identity guessing', () => {
    const root = repo(); const one = start(root); fill(root, one); finish(root, one);
    git(root, ['config', 'remote.origin.promisor', 'true']);
    assert.strictEqual(json(root, ['review']).coverage.completed, 1);
    fs.unlinkSync(sourcePath(root, one));
    assert.match(json(root, ['review']).excluded[0].reason, /partial\/promisor/);
    assert.match(run(root, ['start', '--session', '2026-11-06-new', '--summary', 'new task'], 1).stderr, /partial\/promisor/);
    assert.strictEqual(fs.existsSync(path.join(root, 'docs/sessions/2026-11-06-new.md')), false);
  });
  // @spec:WFE-003
  test('no runs is a valid empty review and creates no local state', () => {
    const root = repo(); assert.deepStrictEqual(json(root, ['review']).scope, []);
    assert.strictEqual(fs.existsSync(path.join(root, '.aw')), false);
  });
} finally { for (const root of roots) fs.rmSync(root, { recursive: true, force: true }); }
process.stdout.write(`\n${passed} passing\n`);
