#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const CLI = path.resolve(__dirname, '../../.scripts/aw-gate.js');
const markerName = 'aw-workspace.yml';
const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'aw-workspace-')));
const home = path.join(root, 'home');
const workspace = path.join(home, 'apps');
const shell = path.join(workspace, 'shell app');
const frontend = path.join(workspace, 'frontend');
const cwd = path.join(shell, 'src');
const other = path.join(home, 'other');
const configFile = path.join(shell, 'docs/workflow/config.yml');
const env = { ...process.env, HOME: home, USERPROFILE: home, AW_REPO_ROOT: shell };
delete env.AW_WORKSPACE_ROOT;

function marker(dir) {
  const file = path.join(dir, markerName);
  fs.writeFileSync(file, '# Presence opts in to workspace mode.\n');
  return file;
}

function run(dir, args = [], overrides = {}, nodeArgs = []) {
  return spawnSync(process.execPath, [...nodeArgs, CLI, 'workspace', ...args], {
    cwd: dir,
    env: { ...env, ...overrides },
    encoding: 'utf8',
  });
}

function resolve(dir, args = [], overrides = {}, nodeArgs = []) {
  const result = run(dir, ['--json', ...args], overrides, nodeArgs);
  assert.strictEqual(result.status, 0, result.stderr);
  assert.strictEqual(result.stderr, '');
  return JSON.parse(result.stdout);
}

function expectWorkspace(dir, workspaceRoot, source, args, overrides, nodeArgs) {
  assert.deepStrictEqual(resolve(dir, args, overrides, nodeArgs), {
    mode: 'workspace',
    workspaceRoot,
    marker: path.join(workspaceRoot, markerName),
    source,
  });
}

function snapshot(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.map((entry) => {
    const file = path.join(dir, entry.name);
    return [entry.name, entry.isDirectory() ? snapshot(file) : fs.readFileSync(file, 'hex')];
  });
}

const repoMode = { mode: 'repo', workspaceRoot: null, marker: null, source: null };

try {
  for (const dir of [cwd, frontend, other, path.dirname(configFile)]) {
    fs.mkdirSync(dir, { recursive: true });
  }
  for (const repo of [shell, frontend]) execFileSync('git', ['-C', repo, 'init', '-q']);
  fs.writeFileSync(configFile, 'tracking:\n  enabled: true\ntelemetry:\n  enabled: true\n');

  // @spec:AWSPACE-001
  // Resolver precedence, Git boundary crossing, and invocation-relative paths.
  assert.deepStrictEqual(resolve(cwd), repoMode);
  const workspaceMarker = marker(workspace);
  marker(other);
  if (typeof process.getuid === 'function') {
    expectWorkspace(cwd, workspace, 'marker');
    expectWorkspace(frontend, workspace, 'marker');
    expectWorkspace(workspace, workspace, 'marker');
    const nearest = marker(shell);
    expectWorkspace(cwd, shell, 'marker');
    fs.unlinkSync(nearest);
  }
  expectWorkspace(cwd, other, 'env', [], { AW_WORKSPACE_ROOT: '../../../other' });
  expectWorkspace(cwd, workspace, 'flag', ['--workspace-root', '../..'], {
    AW_WORKSPACE_ROOT: other,
  });
  const readable = run(cwd, ['--workspace-root', workspace]);
  assert.strictEqual(readable.status, 0, readable.stderr);
  assert.match(readable.stdout, /workspace mode/);
  assert.ok(readable.stdout.includes(workspace));

  // An explicit invalid override fails even when a valid fallback exists.
  for (const [args, overrides] of [
    [['--workspace-root', 'missing'], { AW_WORKSPACE_ROOT: other }],
    [[], { AW_WORKSPACE_ROOT: 'missing' }],
    [['--workspace-root'], {}],
    [['--unknown'], {}],
  ]) {
    const rejected = run(cwd, args, overrides);
    assert.strictEqual(rejected.status, 1, rejected.stdout);
    assert.match(rejected.stderr, /workspace/);
    assert.strictEqual(rejected.stdout, '');
  }

  const directoryMarker = path.join(shell, markerName);
  fs.mkdirSync(directoryMarker);
  assert.strictEqual(run(cwd, ['--workspace-root', shell]).status, 1);
  fs.rmdirSync(directoryMarker);
  if (typeof process.getuid === 'function') {
    fs.symlinkSync(workspaceMarker, directoryMarker);
    expectWorkspace(cwd, workspace, 'marker');
    assert.strictEqual(run(cwd, ['--workspace-root', shell]).status, 1);
    fs.unlinkSync(directoryMarker);

    const uidStub = path.join(root, 'different-uid.cjs');
    fs.writeFileSync(uidStub, `process.getuid = () => ${process.getuid() + 1};\n`);
    assert.deepStrictEqual(resolve(cwd, [], {}, ['--require', uidStub]), repoMode);

    const homeMarker = marker(home);
    fs.unlinkSync(workspaceMarker);
    assert.deepStrictEqual(resolve(cwd), repoMode);
    expectWorkspace(cwd, home, 'flag', ['--workspace-root', home]);
    fs.unlinkSync(homeMarker);
    marker(workspace);
    const twelfth = path.join(workspace, ...Array(12).fill('nested'));
    const thirteenth = path.join(twelfth, 'nested');
    fs.mkdirSync(thirteenth, { recursive: true });
    expectWorkspace(twelfth, workspace, 'marker');
    assert.deepStrictEqual(resolve(thirteenth), repoMode);
  }

  // @spec:AWSPACE-002
  const before = snapshot(root);
  expectWorkspace(cwd, workspace, 'flag', ['--workspace-root', workspace]);
  if (typeof process.getuid === 'function') expectWorkspace(cwd, workspace, 'marker');
  assert.deepStrictEqual(snapshot(root), before, 'workspace resolution must not write state');
  process.stdout.write('ok - workspace resolution, bounds, ownership, and read-only fallback\n');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}

// @spec:AWSPACE-003
// Keep scope selection before the repo-specific providers. These checks cover
// the shipped skill instructions. Provider execution is an agent responsibility.
const project = path.resolve(__dirname, '../..');
for (const [skill, start, next] of [
  ['aw-work', '## Repository Scope', '## Phase 0'],
  ['aw-ship', '## Repository Scope', '## Stage Providers'],
  ['aw-check-workflow-compliance', '## Configuration', '## Evidence To Gather'],
]) {
  const instructions = fs.readFileSync(path.join(project, 'skills', skill, 'SKILL.md'), 'utf8');
  const first = instructions.indexOf(start);
  const end = instructions.indexOf(next);
  assert.ok(first >= 0 && end > first, `${skill} must scope repos before running its procedure`);
  const scope = instructions.slice(first, end);
  assert.match(scope, /aw-gate\.js workspace --json/);
  assert.match(scope, /own (guidance|config)|that repo's config/);
}
process.stdout.write('ok - work, shipping, and compliance declare repo-local workspace routing\n');
