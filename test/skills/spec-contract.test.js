#!/usr/bin/env node
'use strict';

// Static instruction contracts only. These assertions do not demonstrate model
// routing, hook execution, artifact preservation, or runtime permissions; the
// consolidation evaluation records that separate evidence.
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const spec = () => read('skills/aw-spec/SKILL.md');
const reference = (name) => read(`skills/aw-spec/references/${name}.md`);
let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log(`ok - ${name}`); }
  catch (error) { failed++; console.error(`not ok - ${name}\n${error.message}`); }
}
function includes(text, patterns) {
  const normalized = text.replace(/\s+/g, ' ');
  for (const pattern of patterns) assert(pattern.test(normalized), `missing instruction contract: ${pattern}`);
}

// A1-A9: requested artifacts take precedence over the ambiguity of the input.
test('one canonical entrypoint replaces both retired spec skills', () => {
  const skills = fs.readdirSync(path.join(root, 'skills')).filter((name) =>
    fs.existsSync(path.join(root, 'skills', name, 'SKILL.md')));
  assert.strictEqual(skills.length, 20);
  assert(skills.includes('aw-spec'));
  for (const old of ['aw-brainstorm', 'aw-create-spec']) {
    assert(!fs.existsSync(path.join(root, 'skills', old)), `${old} must be retired`);
  }
});

test('requested output is selected before direct versus exploratory routing', () => {
  const body = spec();
  includes(body, [/requested output before ambiguity/i, /PRD.*aw-prd/, /plan.*aw-plan/i,
    /research.*aw-research/i, /exploration.only/i, /no (?:settled|accepted) (?:feature )?intent/i,
    /trivial.*(?:direct|lightweight)/i, /clear.*direct/i, /no compulsory interview/i,
    /consequential ambiguity/i]);
  assert(body.indexOf('## Requested Output') < body.indexOf('## Stage Routing'));
});

// A10: the single bundled writer preserves the existing artifact contracts.
test('only the shared writer owns the bundled living-spec template', () => {
  const writer = reference('spec-writing');
  includes(writer, [/## Default Spec Format/, /# <Feature Name>/, /## Default Index Format/]);
  for (const text of [spec(), reference('discovery'), reference('synthesis-summary')]) {
    assert(!text.includes('# <Feature Name>'), 'do not duplicate the living-spec template');
  }
  includes(spec(), [/sole bundled.*writer/i, /references\/spec-writing\.md/]);
});

test('writer preserves schema, provenance, existing metadata and requirement IDs', () => {
  includes(reference('spec-writing'), [/docs\/standards\/index\.yml/, /existing schema/i,
    /existing (?:frontmatter|metadata)/i, /stable requirement IDs/i,
    /trace-annotate spec --file <spec> --line <heading-line> --id <ID>/,
    /no-op when disabled/i, /status: promoted/, /promoted: YYYY-MM-DD/,
    /promoted_to:/, /PRD body unchanged/i, /do not.*archiv/i,
    /blocking.*deferred/i, /do not.*(?:filename|code alone)/i,
    /existing.*feature.*(?:duplicate|second)/i]);
});

test('external PRDs are preserved once and unavailable sources are blockers', () => {
  includes(spec(), [/reuse.*existing imported/i, /before.*(?:spec|promotion)/i,
    /(?:unavailable|inaccessible).*source/i, /do not invent/i, /stored version without refetching/i]);
  includes(read('skills/aw-prd/SKILL.md'), [/reuse.*existing.*(?:artifact|import)/i,
    /import.only.*no spec/i, /promoted: YYYY-MM-DD/, /body unchanged/i]);
});

// A12-A14: the two stage keys stay independently replaceable.
test('stage overrides are independent, non-recursive and never silently bypassed', () => {
  includes(spec(), [/workflow\.steps\.brainstorm\.skill/, /workflow\.steps\.create_spec\.skill/,
    /independently/i, /brainstorm.*first/i, /create.spec.*(?:after|then)/i,
    /already.*valid spec/i, /do not.*(?:write|writer).*again/i,
    /self.reference/i, /do not.*(?:reinvoke|recurs)/i,
    /unavailable.*provider/i, /report.*(?:blocker|limitation)/i]);
});

test('tracking distinguishes one public invocation from actual internal stages', () => {
  includes(spec(), [/tracking-schema/, /trimmed stdout is exactly `2`/, /no v2 tracking commands/, /must not fall back to a generic public tracking call/]);
  includes(spec(), [/track aw-spec --stage <brainstorm\|create_spec> --mode <direct\|exploratory> --event invocation --invocation-id <token>/,
    /track <provider> --stage <brainstorm\|create_spec> --mode <direct\|exploratory> --event stage --invocation-id <token>/,
    /one public invocation/i, /reuse the token/i, /exploratory mode persists/i,
    /replace.*generic public tracking call/i, /never both/i,
    /do not emit stages.*skipped/i, /tracking is not completion evidence/i, /--stage prd --mode <direct\|exploratory> --event stage --invocation-id <token>/]);
  includes(read('skills/aw-prd/SKILL.md'), [/internal `prd` stage/i, /suppress that public call/i, /caller already emitted/i]);
});

test('hook ownership requires current evidence, not merely an existing spec', () => {
  const body = spec();
  includes(body, [/prd_review/, /discovery/, /spec_review/,
    /enabled.*non.empty/i, /current evidence/i, /spec alone is not evidence/i,
    /artifact.*(?:version|hash|state)/i, /missing.*hook/i,
    /direct.*(?:no|never).*discovery/i]);
  includes(reference('discovery'), [/discovery.*before.*writer/i]);
  includes(reference('spec-writing'), [/spec_review.*before.*human review/i]);
});

// A4/A11: discovery must not widen artifact or prototype authority.
test('discovery preserves exploratory and prototype consent boundaries', () => {
  includes(reference('discovery'), [/one question at a time/i,
    /wait for agreement before creating/i, /silence is not agreement/i,
    /broad build request.*does not authorize/i, /human reaction/i,
    /declines.*no prototype/i, /do not repeat/i, /unresolved.*visible/i,
    /exploration.only.*(?:no|never).*spec/i, /references\/universal-brainstorming\.md/]);
  includes(reference('universal-brainstorming'), [/non-software/, /Save summary to disk/, /Done/]);
});

test('handoffs preserve spec review permissions without publication or implementation', () => {
  includes(reference('spec-writing'), [/human_review\.spec\.reviewers/, /high.risk/i,
    /user asked.*review/i, /aw-request-human-review spec <spec path>/,
    /aw-plan <spec path>/]);
  includes(spec(), [/does not authorize.*(?:implementation|publication)/i,
    /(?:do not|never).*commit.*push.*PR/i]);
});

// A7: planning does not independently accept new product intent.
test('an explicit plan request does not silently create a prerequisite spec', () => {
  includes(read('skills/aw-plan/SKILL.md'), [/do not create a spec solely.*plan request/i,
    /missing durable product intent.*(?:authorization|blocker)/i,
    /effective `create_spec`.*aw-spec/i, /not.*second writer/i]);
});

// A7: review must actually target the written plan before subsequent handoffs.
test('plan document review uses the actual path before human and execution handoffs', () => {
  const body = read('skills/aw-plan/SKILL.md');
  const start = body.indexOf('## Phase 5: Review and Handoff');
  const review = body.indexOf('aw-review <plan path>', start);
  const human = body.indexOf('aw-request-human-review plan <plan path>', start);
  const next = body.indexOf('Then summarize', start);
  assert(review > start && review < human && human < next, 'actual plan review must precede handoff');
  includes(body.slice(start), [/workflow\.steps\.review\.skill/, /Document Review/,
    /bare.*(?:document|mode).*token/i, /actual.*review/i, /never.*stamp.*(?:without|before)/i]);
});

test('affected callers route to aw-spec without active legacy commands', () => {
  for (const name of ['aw-prd', 'aw-plan', 'aw-work', 'aw-help']) {
    const body = read(`skills/${name}/SKILL.md`);
    assert(body.includes('aw-spec'), `${name} needs the canonical handoff`);
    assert(!/\baw-(?:brainstorm|create-spec)\b/.test(body), `${name} contains a retired command`);
  }
  includes(read('skills/aw-help/SKILL.md'), [/requested output before ambiguity/i,
    /research.*aw-research/i, /exploration.only/i, /commit.*aw-ship/i]);
});

test('router stays within budget and each lazy reference exists', () => {
  const body = spec().replace(/^---\n[\s\S]*?\n---\n/, '');
  assert(body.trim().split(/\s+/).length <= 2200, 'skill-body budget exceeded');
  for (const match of body.matchAll(/references\/([a-z-]+\.md)/g)) {
    assert(fs.existsSync(path.join(root, 'skills/aw-spec/references', match[1])), match[0]);
  }
});


// Released old shell functions cannot be patched retroactively by a new archive.
test('migration docs require a fresh reviewed installer bootstrap', () => {
  includes(read('README.md'), [/Do not launch a pre-consolidation/, /git -C \/tmp\/aw-reviewed-upgrade checkout <approved-consolidation-commit-or-tag>/]);
  includes(read('skills/aw-init/SKILL.md'), [/Never bootstrap this migration/, /old running functions can overwrite custom skills/]);
});

console.log(`\n${passed} passed; ${failed} failed (static contracts, not runtime behavior)`);
if (failed) process.exitCode = 1;
