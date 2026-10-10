#!/usr/bin/env node
'use strict';

// Acceptance-first coverage for stage-aware tracking. These exercise the real
// CLI, not agent routing: provider execution/order still needs runtime evidence.
// Invalid telemetry is deliberately dropped silently, so negative cases assert
// no filesystem writes rather than a blocking non-zero exit.

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const CLI = path.resolve(__dirname, '..', '..', '.scripts', 'aw-gate.js');
let passed = 0;

function write(root, rel, content) {
  const abs = path.join(root, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content);
}

function fixture(name, test, config = '') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aw-skill-routing-'));
  write(root, 'docs/workflow/config.yml', [
    'tracking:',
    '  enabled: true',
    '  rotation: none',
    '  path: docs/metrics/skills.jsonl',
    '  session_file: .aw/session',
    config,
    '',
  ].join('\n'));
  try {
    test(root);
    passed += 1;
    process.stdout.write(`ok - ${name}\n`);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function run(root, args) {
  return spawnSync(process.execPath, [CLI, ...args], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, AW_REPO_ROOT: root },
  });
}

function track(root, ...args) {
  const result = run(root, ['track', ...args]);
  assert.strictEqual(result.status, 0, result.stderr);
  assert.strictEqual(result.stdout, '', 'tracking stays silent');
  assert.strictEqual(result.stderr, '', 'tracking stays silent');
}

function rows(root) {
  const abs = path.join(root, 'docs/metrics/skills.jsonl');
  return fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8').trim().split('\n').map(JSON.parse) : [];
}

function route(stage, mode, id = 'route-1', event) {
  return ['--stage', stage, '--mode', mode, '--invocation-id', id,
    ...(event ? ['--event', event] : [])];
}

function unchanged(root, before) {
  assert.deepStrictEqual(snapshot(root), before, 'invalid or disabled tracking must write nothing');
}

function snapshot(root, rel = '') {
  const result = {};
  for (const entry of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
    const file = path.join(rel, entry.name);
    if (entry.isDirectory()) {
      result[`${file}/`] = true;
      Object.assign(result, snapshot(root, file));
    } else {
      result[file] = fs.readFileSync(path.join(root, file), 'utf8');
    }
  }
  return result;
}

for (const command of ['tracking-schema', 'shipping-tracking-schema']) fixture(`${command} reports v2 without reading config or writing tracking state`, (root) => {
  // Existing data and an expired session must be untouched by capability reads.
  write(root, '.aw/session', 'existing-session\n');
  write(root, 'docs/metrics/skills.jsonl', '{"historical":true}\n');
  const old = new Date('2020-01-01T00:00:00Z');
  fs.utimesSync(path.join(root, '.aw/session'), old, old);
  for (const config of [null, 'tracking:\n  enabled: false\n', 'tracking:\n  enabled: true\n']) {
    if (config === null) fs.rmSync(path.join(root, 'docs/workflow/config.yml'));
    else write(root, 'docs/workflow/config.yml', config);
    const before = snapshot(root);
    const result = run(root, [command]);
    assert.strictEqual(result.status, 0, result.stderr);
    assert.strictEqual(result.stdout, '2\n');
    assert.strictEqual(result.stderr, '');
    unchanged(root, before);
    assert.strictEqual(fs.statSync(path.join(root, '.aw/session')).mtimeMs, old.getTime());
  }
});

fixture('unsupported old-helper capability response cannot authorize v2 emission', (root) => {
  // Model the old public command boundary: unknown commands exit 2, while
  // legacy `track` ignores extra flags. Do not send v2 flags through that path.
  const legacyHelper = path.join(root, 'legacy-helper.js');
  write(root, 'legacy-helper.js', [
    "const fs = require('fs');",
    "if (process.argv[2] === 'tracking-schema') {",
    "  process.stdout.write('Usage: track <skill>\\n');",
    "  process.exit(2);",
    '}',
    "if (process.argv[2] === 'track') fs.writeFileSync('incorrect-legacy-event', 'invocation');",
    '',
  ].join('\n'));
  const before = snapshot(root);
  const capability = spawnSync(process.execPath, [legacyHelper, 'tracking-schema'], { cwd: root, encoding: 'utf8' });
  assert.strictEqual(capability.status, 2);
  const supportsV2 = capability.status === 0 && capability.stdout.trim() === '2';
  assert.strictEqual(supportsV2, false);
  if (supportsV2) spawnSync(process.execPath, [legacyHelper, 'track', 'aw-spec', ...route('create_spec', 'direct')], { cwd: root });
  unchanged(root, before);
});

fixture('Phase 1 schema2 probe does not authorize shipping tracking', (root) => {
  // Reduced protocol fixture, not model/runtime routing evidence. Phase 1
  // ignored tracking-schema arguments and silently dropped shipping modes.
  const phase1Helper = path.join(root, 'phase1-helper.js');
  write(root, 'phase1-helper.js', [
    "const fs = require('fs');",
    "if (process.argv[2] === 'tracking-schema') { process.stdout.write('2\\n'); process.exit(0); }",
    "if (process.argv[2] === 'track') {",
    "  fs.writeFileSync('unsupported-shipping-attempt', 'tracking was attempted');",
    '  process.exit(0);',
    '}',
    "process.stderr.write('unknown command\\n'); process.exit(2);",
    '',
  ].join('\n'));
  const before = snapshot(root);
  const misleading = spawnSync(process.execPath, [phase1Helper, 'tracking-schema', 'aw-ship'], { cwd: root, encoding: 'utf8' });
  assert.strictEqual(misleading.status, 0);
  assert.strictEqual(misleading.stdout.trim(), '2');
  const capability = spawnSync(process.execPath, [phase1Helper, 'shipping-tracking-schema'], { cwd: root, encoding: 'utf8' });
  assert.strictEqual(capability.status, 2);
  const supportsShipping = capability.status === 0 && capability.stdout.trim() === '2';
  assert.strictEqual(supportsShipping, false);
  if (supportsShipping) spawnSync(process.execPath, [phase1Helper, 'track', 'aw-ship', ...route('commit', 'local-commit')], { cwd: root });
  unchanged(root, before);
});

fixture('shipping probe accepts neither wrong versions nor failing exact-version output', (root) => {
  const helper = path.join(root, 'unsupported-helper.js');
  for (const [status, stdout] of [[2, '2\n'], [0, '3\n'], [0, 'supports 2\n'], [0, '']]) {
    write(root, 'unsupported-helper.js', `process.stdout.write(${JSON.stringify(stdout)}); process.exit(${status});\n`);
    const before = snapshot(root);
    const capability = spawnSync(process.execPath, [helper, 'shipping-tracking-schema'], { cwd: root, encoding: 'utf8' });
    assert.strictEqual(capability.status === 0 && capability.stdout.trim() === '2', false);
    unchanged(root, before);
  }
});

fixture('local shipping records one invocation and the actual commit provider', (root) => {
  track(root, 'aw-ship', ...route('commit', 'local-commit', 'local-1'));
  track(root, 'custom-commit', ...route('commit', 'local-commit', 'local-1', 'stage'));
  assert.deepStrictEqual(rows(root).map((row) => [row.skill, row.event, row.workflow_step, row.mode]), [
    ['aw-ship', 'invocation', 'commit', 'local-commit'],
    ['custom-commit', 'stage', 'commit', 'local-commit'],
  ]);
  assert.ok(rows(root).every((row) => row.schema_version === 2 && row.invocation_id === 'local-1'));
}, 'workflow:\n  steps:\n    commit:\n      skill: custom-commit\n    commit_push_pr:\n      skill: custom-pr');

fixture('full shipping keeps independent commit and PR stages in one invocation', (root) => {
  track(root, 'aw-ship', ...route('commit_push_pr', 'full-pr', 'full-1'));
  track(root, 'custom-pr', ...route('commit_push_pr', 'full-pr', 'full-1', 'stage'));
  track(root, 'custom-commit', ...route('commit', 'full-pr', 'full-1', 'stage'));
  const events = rows(root);
  assert.strictEqual(events.filter((row) => row.event === 'invocation').length, 1);
  assert.deepStrictEqual(events.filter((row) => row.event === 'stage').map((row) => [row.skill, row.workflow_step]), [
    ['custom-pr', 'commit_push_pr'], ['custom-commit', 'commit'],
  ]);
  assert.ok(events.every((row) => row.mode === 'full-pr' && row.invocation_id === 'full-1'));
}, 'workflow:\n  steps:\n    commit:\n      skill: custom-commit\n    commit_push_pr:\n      skill: custom-pr');

fixture('same shipping provider and self-overrides preserve the explicit actual stage', (root) => {
  track(root, 'aw-ship', ...route('commit_push_pr', 'full-pr', 'same-1'));
  for (const provider of ['shared-provider', 'aw-ship']) {
    track(root, provider, ...route('commit_push_pr', 'full-pr', 'same-1', 'stage'));
    track(root, provider, ...route('commit', 'full-pr', 'same-1', 'stage'));
  }
  assert.deepStrictEqual(rows(root).map((row) => row.workflow_step), [
    'commit_push_pr', 'commit_push_pr', 'commit', 'commit_push_pr', 'commit',
  ]);
}, 'workflow:\n  steps:\n    commit:\n      skill: shared-provider\n    commit_push_pr:\n      skill: shared-provider');

fixture('full shipping without a commit does not invent a commit stage', (root) => {
  track(root, 'aw-ship', ...route('commit_push_pr', 'full-pr', 'no-commit'));
  track(root, 'custom-pr', ...route('commit_push_pr', 'full-pr', 'no-commit', 'stage'));
  assert.strictEqual(rows(root).length, 2);
  assert.ok(rows(root).every((row) => row.workflow_step === 'commit_push_pr'));
});

fixture('description modes never write or refresh sessions for any provider', (root) => {
  write(root, '.aw/session', 'existing-session\n');
  write(root, 'docs/metrics/skills.jsonl', '{"historical":true}\n');
  const old = new Date('2020-01-01T00:00:00Z');
  fs.utimesSync(path.join(root, '.aw/session'), old, old);
  const before = snapshot(root);
  for (const mode of ['description-only', 'description-update']) {
    for (const skill of ['aw-ship', 'custom-pr']) {
      for (const event of ['invocation', 'stage']) {
        track(root, skill, ...route('commit_push_pr', mode, 'description-1', event));
      }
    }
  }
  unchanged(root, before);
  assert.strictEqual(fs.statSync(path.join(root, '.aw/session')).mtimeMs, old.getTime());
});

fixture('direct route records an explicit create_spec invocation', (root) => {
  track(root, 'aw-spec', ...route('create_spec', 'direct'));
  const [row] = rows(root);
  assert.strictEqual(row.schema_version, 2);
  assert.strictEqual(row.event, 'invocation');
  assert.strictEqual(row.skill, 'aw-spec');
  assert.strictEqual(row.workflow_step, 'create_spec');
  assert.strictEqual(row.mode, 'direct');
  assert.strictEqual(row.invocation_id, 'route-1');
  assert.strictEqual(row.source, 'skill');
  assert.ok(Number.isFinite(Date.parse(row.ts)));
  assert.strictEqual(row.session_id, fs.readFileSync(path.join(root, '.aw/session'), 'utf8').trim());
});

fixture('exploratory public invocation and executed stages remain distinct', (root) => {
  track(root, 'aw-spec', ...route('brainstorm', 'exploratory', 'route-2'));
  track(root, 'custom-discovery', ...route('brainstorm', 'exploratory', 'route-2', 'stage'));
  track(root, 'custom-writer', ...route('create_spec', 'exploratory', 'route-2', 'stage'));
  const events = rows(root);
  assert.strictEqual(events.filter((row) => row.event === 'invocation').length, 1);
  assert.deepStrictEqual(events.filter((row) => row.event === 'stage').map((row) => [row.skill, row.workflow_step]), [
    ['custom-discovery', 'brainstorm'], ['custom-writer', 'create_spec'],
  ]);
  assert.ok(events.every((row) => row.mode === 'exploratory' && row.invocation_id === 'route-2'));
  assert.strictEqual(new Set(events.map((row) => row.session_id)).size, 1);
}, 'workflow:\n  steps:\n    brainstorm:\n      skill: custom-discovery\n    create_spec:\n      skill: custom-writer');

fixture('nested PRD preservation shares the spec route without a second public count', (root) => {
  for (const mode of ['direct', 'exploratory']) {
    const stage = mode === 'direct' ? 'create_spec' : 'brainstorm';
    const id = `prd-to-spec-${mode}`;
    track(root, 'aw-spec', ...route(stage, mode, id));
    track(root, 'aw-prd', ...route('prd', mode, id, 'stage'));
    track(root, 'aw-spec', ...route(stage, mode, id, 'stage'));
    const events = rows(root).filter((row) => row.invocation_id === id);
    assert.strictEqual(events.filter((row) => row.event === 'invocation').length, 1);
    assert.strictEqual(events[1].workflow_step, 'prd');
    assert.strictEqual(events[1].skill, 'aw-prd');
    assert.strictEqual(events[1].mode, mode);
  }
});

fixture('same custom provider records the actual stage, not the first configured match', (root) => {
  track(root, 'shared-provider', ...route('create_spec', 'direct', 'direct-run', 'stage'));
  track(root, 'shared-provider', ...route('brainstorm', 'exploratory', 'explore-run', 'stage'));
  track(root, 'shared-provider', ...route('create_spec', 'exploratory', 'explore-run', 'stage'));
  assert.deepStrictEqual(rows(root).map((row) => [row.workflow_step, row.invocation_id]), [
    ['create_spec', 'direct-run'], ['brainstorm', 'explore-run'], ['create_spec', 'explore-run'],
  ]);
}, 'workflow:\n  steps:\n    brainstorm:\n      skill: shared-provider\n    create_spec:\n      skill: shared-provider');

fixture('bundled self-overrides cannot force aw-spec first-match attribution', (root) => {
  track(root, 'aw-spec', ...route('create_spec', 'direct'));
  track(root, 'aw-spec', ...route('brainstorm', 'exploratory', 'route-2', 'stage'));
  assert.deepStrictEqual(rows(root).map((row) => row.workflow_step), ['create_spec', 'brainstorm']);
}, 'workflow:\n  steps:\n    brainstorm:\n      skill: aw-spec\n    create_spec:\n      skill: aw-spec');

fixture('no create_spec event is invented when exploration ends without that stage', (root) => {
  track(root, 'aw-spec', ...route('brainstorm', 'exploratory'));
  track(root, 'custom-discovery', ...route('brainstorm', 'exploratory', 'route-1', 'stage'));
  assert.strictEqual(rows(root).length, 2);
  assert.ok(rows(root).every((row) => row.workflow_step === 'brainstorm'));
});

fixture('legacy commands and historical rows keep their original interpretation', (root) => {
  const historical = { ts: '2026-07-27T12:34:56.000Z', session_id: 'old-session', skill: 'aw-brainstorm', workflow_step: 'brainstorm', source: 'skill' };
  const historicalLine = JSON.stringify(historical) + '\n';
  write(root, 'docs/metrics/skills.jsonl', historicalLine);
  track(root, 'aw-create-spec');
  track(root, 'aw-plan');
  track(root, 'aw-help');
  track(root, 'aw-spec', ...route('create_spec', 'direct', 'route-3'));
  track(root, 'aw-spec', ...route('create_spec', 'direct', 'route-3', 'stage'));
  const events = rows(root);
  assert.deepStrictEqual(events[0], historical);
  assert.ok(fs.readFileSync(path.join(root, 'docs/metrics/skills.jsonl'), 'utf8').startsWith(historicalLine));
  assert.strictEqual(events[1].workflow_step, 'create_spec');
  assert.strictEqual(events[2].workflow_step, 'plan');
  assert.strictEqual(events[3].workflow_step, undefined);
  assert.ok(events.slice(0, 4).every((row) => row.event === undefined && row.schema_version === undefined));
  assert.strictEqual(events.filter((row) => (row.event || 'invocation') === 'invocation').length, 5);
});

fixture('historical shipping rows and legacy commit inference remain unchanged', (root) => {
  const historical = { ts: '2026-07-27T12:34:56.000Z', session_id: 'old-shipping', skill: 'aw-commit-push-pr', workflow_step: 'commit_push_pr', source: 'skill' };
  const historicalLine = JSON.stringify(historical) + '\n';
  write(root, 'docs/metrics/skills.jsonl', historicalLine);
  track(root, 'aw-commit');
  track(root, 'aw-commit-push-pr');
  track(root, 'shared-provider');
  track(root, 'aw-ship', ...route('commit_push_pr', 'full-pr', 'new-shipping'));
  const events = rows(root);
  assert.deepStrictEqual(events[0], historical);
  assert.ok(fs.readFileSync(path.join(root, 'docs/metrics/skills.jsonl'), 'utf8').startsWith(historicalLine));
  assert.deepStrictEqual(events.slice(1, 4).map((row) => row.workflow_step), ['commit', 'commit_push_pr', 'commit']);
  assert.ok(events.slice(0, 4).every((row) => row.event === undefined && row.schema_version === undefined && row.mode === undefined));
  assert.strictEqual(events[4].skill, 'aw-ship');
  assert.strictEqual(events[4].schema_version, 2);
}, 'workflow:\n  steps:\n    commit:\n      skill: shared-provider\n    commit_push_pr:\n      skill: shared-provider');

fixture('legacy callers retain their configured first-match fallback', (root) => {
  track(root, 'shared-provider');
  assert.strictEqual(rows(root)[0].workflow_step, 'brainstorm');
}, 'workflow:\n  steps:\n    brainstorm:\n      skill: shared-provider\n    create_spec:\n      skill: shared-provider');

const invalid = [
  ['aw-spec'],
  ['aw-ship'],
  ['aw-ship', ...route('commit_push_pr', 'description-only')],
  ['aw-ship', ...route('commit_push_pr', 'description-update')],
  ['custom-provider', ...route('review', 'full-pr')],
  ['aw-ship', ...route('commit', 'direct')],
  ['aw-ship', ...route('commit_push_pr', 'exploratory')],
  ['aw-ship', ...route('commit_push_pr', 'local-commit')],
  ['aw-ship', ...route('create_spec', 'full-pr')],
  ['custom-provider', ...route('commit_push_pr', 'local-commit')],
  ['aw-spec', ...route('create_spec', 'full-pr')],
  ['aw-spec', ...route('create_spec', 'local-commit')],
  ['aw-spec', '--stage', 'create_spec'],
  ['aw-spec', '--mode', 'direct'],
  ['aw-spec', '--stage', 'create_spec', '--mode', 'direct'],
  ['aw-spec', ...route('brainstorm', 'direct')],
  ['aw-spec', ...route('plan', 'direct')],
  ['aw-spec', ...route('create-spec', 'direct')],
  ['aw-spec', ...route('create_spec', 'unknown')],
  ['aw-spec', ...route('create_spec', 'Direct')],
  ['aw-spec', ...route('create_spec', 'direct', 'route-1', 'completion')],
  ['aw-spec', ...route('create_spec', 'direct', '')],
  ['aw-spec', ...route('create_spec', 'direct', 'contains spaces')],
  ['aw-spec', ...route('create_spec', 'direct', 'a'.repeat(129))],
  ['aw-spec', '--stage', '--mode', 'direct', '--invocation-id', 'route-1'],
  ['aw-spec', '--stage', 'create_spec', '--mode', '--invocation-id', 'route-1'],
  ['aw-spec', '--stage', 'create_spec', '--mode', 'direct', '--invocation-id'],
  ['aw-spec', ...route('create_spec', 'direct'), '--event'],
  ['aw-spec', ...route('create_spec', 'direct'), '--unexpected', 'value'],
  ['aw-spec', ...route('create_spec', 'direct'), '--stage', 'create_spec'],
  ['aw-spec', 'extra', ...route('create_spec', 'direct')],
  ['custom-provider', ...route('not_a_step', 'exploratory')],
  ['custom-provider', ...route('brainstorm', 'direct')],
  ['custom-provider', '--event', 'stage'],
];
invalid.forEach((args, index) => {
  fixture(`invalid tracking input ${index + 1} is silent and writes nothing`, (root) => {
    const before = snapshot(root);
    track(root, ...args);
    unchanged(root, before);
  });
});

fixture('configured unknown stage keys are not silently accepted', (root) => {
  const before = snapshot(root);
  track(root, 'custom-provider', ...route('typo_stage', 'direct'));
  unchanged(root, before);
}, 'workflow:\n  steps:\n    typo_stage:\n      skill: custom-provider');

fixture('explicit metadata supports other recognized workflow stages', (root) => {
  track(root, 'custom-monitor', ...route('monitor_pipeline', 'direct', 'route-4', 'stage'));
  assert.strictEqual(rows(root)[0].workflow_step, 'monitor_pipeline');
});

fixture('opaque invocation token boundary accepts the documented maximum', (root) => {
  track(root, 'aw-spec', ...route('create_spec', 'direct', 'a'.repeat(128)));
  assert.strictEqual(rows(root)[0].invocation_id, 'a'.repeat(128));
});

fixture('disabled tracking makes no writes, including session refresh', (root) => {
  write(root, 'docs/workflow/config.yml', 'tracking:\n  enabled: false\n');
  write(root, '.aw/session', 'existing-session\n');
  write(root, 'docs/metrics/skills.jsonl', '{"historical":true}\n');
  const old = new Date('2020-01-01T00:00:00Z');
  fs.utimesSync(path.join(root, '.aw/session'), old, old);
  const before = snapshot(root);
  track(root, 'aw-spec', ...route('create_spec', 'direct'));
  track(root, 'aw-spec', ...route('create_spec', 'direct', 'route-1', 'stage'));
  track(root, 'aw-plan');
  track(root, 'aw-ship', ...route('commit', 'local-commit'));
  track(root, 'aw-ship', ...route('commit_push_pr', 'full-pr', 'disabled-ship', 'stage'));
  unchanged(root, before);
  assert.strictEqual(fs.statSync(path.join(root, '.aw/session')).mtimeMs, old.getTime());
});

fixture('missing configuration creates neither sessions nor telemetry', (root) => {
  fs.rmSync(path.join(root, 'docs/workflow/config.yml'));
  const before = snapshot(root);
  track(root, 'aw-spec', ...route('create_spec', 'direct'));
  unchanged(root, before);
});

fixture('monthly rotation still applies to explicit events', (root) => {
  write(root, 'docs/workflow/config.yml', 'tracking:\n  enabled: true\n  rotation: monthly\n');
  const beforeMonth = new Date().toISOString().slice(0, 7);
  track(root, 'aw-spec', ...route('create_spec', 'direct'));
  const afterMonth = new Date().toISOString().slice(0, 7);
  const names = fs.readdirSync(path.join(root, 'docs/metrics'));
  assert.strictEqual(names.length, 1);
  assert.ok([`skills-${beforeMonth}.jsonl`, `skills-${afterMonth}.jsonl`].includes(names[0]));
  const event = JSON.parse(fs.readFileSync(path.join(root, 'docs/metrics', names[0]), 'utf8'));
  assert.strictEqual(event.event, 'invocation');
});

fixture('stage telemetry neither stamps gates nor consumes their receipts', (root) => {
  for (const gate of ['review', 'capture', 'check_workflow_compliance', 'synthesize']) {
    track(root, 'aw-spec', ...route('create_spec', 'direct', `route-${gate}`, 'stage'));
    track(root, 'aw-ship', ...route('commit_push_pr', 'full-pr', `ship-${gate}`, 'stage'));
    const denied = run(root, ['record', gate]);
    assert.strictEqual(denied.status, 1, 'stage tracking must not satisfy a gate');
    assert.match(denied.stderr, /no receipt/);
    const receipt = run(root, ['receipt', gate, '--summary', `Actually checked ${gate}`]);
    assert.strictEqual(receipt.status, 0, receipt.stderr);
    const receiptPath = path.join(root, '.aw/receipts', `${gate}.json`);
    const original = fs.readFileSync(receiptPath, 'utf8');
    track(root, 'aw-spec', ...route('create_spec', 'direct', `route-${gate}`, 'stage'));
    track(root, 'aw-ship', ...route('commit_push_pr', 'full-pr', `ship-${gate}`, 'stage'));
    assert.strictEqual(fs.readFileSync(receiptPath, 'utf8'), original);
    const recorded = run(root, ['record', gate]);
    assert.strictEqual(recorded.status, 0, recorded.stderr);
    assert.ok(!fs.existsSync(receiptPath), 'record alone consumes its matching receipt');
    const state = JSON.parse(fs.readFileSync(path.join(root, '.aw-gate-state.json'), 'utf8'));
    assert.strictEqual(state[gate].receipt.summary, `Actually checked ${gate}`);
    assert.strictEqual(state['aw-spec'], undefined);
    assert.strictEqual(state['aw-ship'], undefined);
  }
}, 'gates:\n  enabled: true\n  require_receipt: true');

process.stdout.write(`\n${passed} passing\n`);
