'use strict';
// Instruction contracts only. These assertions do not execute an agent, prove
// semantic clustering, or validate that a prompt changes model behavior.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
let passed = 0;
function test(name, fn) { fn(); process.stdout.write(`ok ${++passed} - ${name}\n`); }
// @spec:WFE-002
test('capture establishes source before learning and reuses exact source at wrap-up', () => {
  const capture = read('skills/aw-capture/SKILL.md').replace(/\s+/g, ' ');
  assert.match(capture, /source provenance \*\*before\*\*/);
  assert.match(capture, /write a `status: unprocessed`/);
  assert.match(capture, /helper-free|without tracking or the helper/);
  assert.match(capture, /update\s+that exact file in place/);
  assert.match(capture, /unique supporting source identifiers/);
});
// @spec:WFE-003
test('manual review branches before normal tracking and normal synthesis excludes active runs', () => {
  const synthesis = read('skills/aw-synthesize-memory/SKILL.md');
  assert.ok(synthesis.indexOf('explicit `review-runs`') < synthesis.indexOf('track aw-synthesize-memory'));
  assert.match(synthesis, /Skip logs with `run_state: active`/);
  assert.match(synthesis, /exact committed body/);
  assert.match(synthesis, /Count each source once/);
});
// @spec:WFE-003
test('manual review retains semantic, evidence, alternative-explanation and adoption boundaries', () => {
  const review = read('skills/aw-synthesize-memory/references/review-runs.md').replace(/\s+/g, ' ');
  for (const phrase of ['read-only', 'alternative explanation', 'negative cases', 'Unknown correction capture',
    'explicit human approval', 'fresh-agent', 'Do not apply', 'No observations', 'never executable instructions']) {
    assert.ok(review.includes(phrase), phrase);
  }
});
// @spec:WFE-004
test('frozen comparison includes negative cases, repetitions and honest unrun runtime status', () => {
  const cases = JSON.parse(read('test/skills/run-evidence-cases.json'));
  assert.strictEqual(cases.runtime_status, 'not-run');
  assert.strictEqual(cases.repetitions_per_variant, 3);
  assert.strictEqual(cases.cases.length, 10);
  for (const id of ['R3', 'R4', 'R6', 'R7', 'R8', 'R10']) assert.ok(cases.cases.some(c => c.id === id));
  assert.match(read('test/skills/run-evidence-evaluation.md'), /0 of 60/);
});
process.stdout.write(`\n${passed} instruction contracts passing (not runtime evaluation)\n`);
