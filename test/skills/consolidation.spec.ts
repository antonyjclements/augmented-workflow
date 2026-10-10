// Executable acceptance coverage, not an agent/model behavior evaluation.
// Keep this runner in the configured *.spec.ts trace path; focused suites retain
// their conventional .js/.py names and can be run independently.
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8' });
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed`);
}

// @spec:AWSPEC-001, AWSPEC-002, AWSPEC-003, AWSPEC-005, AWSPEC-008
run(process.execPath, ['test/skills/spec-contract.test.js']);

// @spec:AWSHIP-001, AWSHIP-002, AWSHIP-003, AWSHIP-006
run(process.execPath, ['test/skills/shipping-contract.test.js']);

// @spec:AWSHIP-002
run(process.execPath, ['test/skills/shipping-readonly.test.js']);

// @spec:AWSPEC-004, AWSHIP-004
run(process.execPath, ['test/gate/skill-routing.test.js']);

// @spec:AWSPEC-006, AWSHIP-005
run('python3', ['test/installer/skill-migration.test.py']);

// @spec:AWSPEC-007
const cases = JSON.parse(fs.readFileSync(path.join(root, 'test/skills/consolidation-cases.json'), 'utf8'));
assert.equal(cases.cases.length, 16);
assert.equal(cases.runtime_protocol.repetitions_per_case_per_variant, 3);
assert.equal(cases.runtime_protocol.same_model_runtime_config_required, true);
assert.match(cases.runtime_protocol.unavailable_runtime_policy, /static contracts do not substitute/);
const evidence = fs.readFileSync(path.join(root, 'test/skills/consolidation-evaluation.md'), 'utf8');
assert.match(evidence, /Runtime evaluation/);
assert.match(evidence, /Behavioral claims/);
const shipping = JSON.parse(fs.readFileSync(path.join(root, 'test/skills/shipping-permissions-cases.json'), 'utf8'));
assert.equal(shipping.cases.length, 18);
assert.equal(shipping.runtime_protocol.repetitions_per_case_per_variant, 3);
assert.equal(shipping.runtime_protocol.same_model_runtime_config_required, true);
assert(shipping.runtime_protocol.release_gate.includes('genuine repeated runtime permission evaluation'));
const shippingEvidence = fs.readFileSync(path.join(root, 'test/skills/shipping-evaluation.md'), 'utf8');
assert.match(shippingEvidence, /Runtime evaluation/);
assert.match(shippingEvidence, /Behavioral claims/);
console.log('Combined consolidation acceptance coverage passed; model runtime evaluation remains separate.');
