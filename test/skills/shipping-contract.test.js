#!/usr/bin/env node
'use strict';

// Instruction contracts only: these cannot prove a model selected the mode,
// obeyed permissions, or executed a hook. Runtime evidence is recorded separately.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const router = () => read('skills/aw-ship/SKILL.md');
const reference = (name) => read(`skills/aw-ship/references/${name}.md`);
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

// S1-S4: dispatch occurs before any mutating helper or provider call.
test('one canonical router replaces both shipping entrypoints', () => {
  const skills = fs.readdirSync(path.join(root, 'skills')).filter((name) =>
    fs.existsSync(path.join(root, 'skills', name, 'SKILL.md')));
  assert.strictEqual(skills.length, 20);
  assert(skills.includes('aw-ship'));
  for (const old of ['aw-commit', 'aw-commit-push-pr']) {
    assert(!fs.existsSync(path.join(root, 'skills', old)), `${old} must be retired`);
  }
});

test('mode and authority resolve before context, tracking or providers', () => {
  const text = router();
  includes(text, [/before.*(?:command|tracking|provider)/i, /local-commit/, /full-pr/,
    /description-only/, /description-update/, /description-only.*pasted.*(?:URL|number|ref)/i,
    /ambiguous.*ask/i, /explicit.*(?:limit|restriction)/i, /silence.*not.*(?:approval|authorization)/i]);
  assert(text.indexOf('## Select Mode') < text.indexOf('## Tracking'));
  assert(!/^First action.*track/m.test(text));
  assert(!/!`/.test(text), 'no unconditional pre-populated commands before dispatch');
});

test('local commit cannot escalate into remote publication', () => {
  includes(router(), [/local-commit.*never push.*(?:open|create).*PR/i]);
  includes(reference('commit-workflow'), [/local-commit.*stop.*(?:hash|subject)/i,
    /never push.*(?:open|create).*PR/i, /do not.*(?:compliance|CI).*local-commit/i]);
});

test('description modes are repo-read-only including hidden helper paths', () => {
  includes(router(), [/description.*skip all tracking/i, /no capability probe/i,
    /do not.*(?:fetch|checkout).*stage.*commit.*push/i,
    /no.*(?:review|capture).*compliance.*CI/i,
    /description-only.*(?:print|return).*stop/i]);
  includes(reference('pr-description-writing'), [/description-only.*description-update/,
    /never.*git fetch/i, /GIT_OPTIONAL_LOCKS=0/,
    /(?:API|MCP).*diff.*(?:metadata|commits)/i,
    /missing.*(?:evidence|refs).*blocker/i, /partial.*promisor.*lazily fetch/i,
    /API.*only.*do not run local history\/diff\/object reads/i]);
  includes(reference('pr-application'), [/description-update.*only.*(?:title|body).*target/i,
    /no.*(?:tracking|metrics).*commit.*push/i]);
});

test('stages remain independently configurable with self-reference protection', () => {
  includes(router(), [/workflow\.steps\.commit\.skill/,
    /workflow\.steps\.commit_push_pr\.skill/, /independently/i,
    /bundled self-reference/i, /never.*(?:reinvoke|recurs)/i,
    /unavailable.*provider/i, /do not silently.*(?:fallback|substitute)/i,
    /description.*(?:bypass|never invoke).*providers/i]);
  includes(reference('commit-workflow'), [/effective.*commit.*provider/i,
    /(?:commit hash|hashes).*exact commit message/i, /git\.commit\.skill.*migrate/i]);
});

test('tracking probes the shipping capability and represents actual stages', () => {
  includes(router(), [/shipping-tracking-schema/, /trimmed stdout is exactly `2`/,
    /older.*skip tracking/i, /no generic.*(?:fallback|tracking)/i,
    /track aw-ship --stage <commit\|commit_push_pr> --mode <local-commit\|full-pr> --event invocation --invocation-id <token>/,
    /track <provider> --stage <commit\|commit_push_pr> --mode <local-commit\|full-pr> --event stage --invocation-id <token>/,
    /one public invocation/i, /effective provider/i,
    /full-pr.*(?:persists|remains).*commit/i, /never both/i,
    /no.*(?:event|stage).*skipped/i, /tracking is not completion evidence/i]);
});

test('one shared commit procedure protects branch and unrelated work', () => {
  includes(reference('commit-workflow'), [/sole bundled.*commit/i, /git status/,
    /git diff HEAD/, /git log --oneline -10/, /detached HEAD/i,
    /declines.*(?:explicit|detached)/i, /main.*master.*default branch/i,
    /git checkout -b/, /unrelated.*(?:staged|changes|work)/i,
    /git diff --cached/, /(?:sensitive|credentials|\.env)/i,
    /file.level/i, /no `git add -p`/i, /git add -A.*git add \./,
    /scope_required/, /allowed_types/, /git status.*(?:after|verify)/i]);
  includes(reference('branch-creation'), [/unpushed.*commits/i,
    /Carry.*leave/i, /Never default silently/i, /stash.*conflicts/i,
    /do not auto.resolve/i, /base freshness was not verified/i]);
});

test('full workflow retains ordered preparation, push, compliance, PR and CI', () => {
  const flow = reference('full-pr-workflow');
  const headings = ['## 1. Resolve', '## 2. Prepare', '## 3. Commit and push',
    '## 4. Compliance', '## 5. Compose and apply', '## 6. Post-PR'];
  let previous = -1;
  for (const heading of headings) {
    const current = flow.indexOf(heading);
    assert(current > previous, `${heading} missing or out of order`);
    previous = current;
  }
  includes(flow, [/spec drift/i, /README\.md.*(?:blocker|before committing)/i,
    /capture checkpoint/i, /workflow\.steps\.review\.skill/,
    /workflow\.design\.hooks\.pre_pr\.skill/,
    /references\/commit-workflow\.md/, /git push -u origin HEAD/,
    /workflow\.steps\.check_workflow_compliance\.skill/,
    /skip.*trivial.*(?:explicit|state)/i, /docs\/metrics\/\*\*/,
    /after.*description/i, /do not create.*unpushed/i,
    /workflow\.steps\.monitor_pipeline\.skill/, /post_pr\.ci_monitor\.provider/,
    /failures.*current branch/i]);
});

test('existing PR rewrite needs explicit preview and target validation', () => {
  includes(reference('pr-application'), [/whether to rewrite/i,
    /New title:.*Apply\?/i, /declined.*do not apply/i,
    /(?:owner|repository).*PR.*(?:number|target)/i,
    /(?:changed|changes).*since.*(?:preview|read)/i,
    /--body-file/, /Never use.*--body-file -/i,
    /gh pr edit <ref>/, /--draft/]);
});

test('description quality, templates and existing evidence survive the merge', () => {
  includes(reference('pr-description-writing'), [/what the diff cannot show/i,
    /user.visible before\/after/i, /baseRefName/, /headRefOid/,
    /isCrossRepository/, /No commits to describe/,
    /preserve.*Demo.*Screenshots.*verbatim/i,
    /Never use.*BREAKING CHANGE.*confirmation/i, /%28.*%29/]);
  includes(reference('pr-application'), [/pull_request\.template\.title/,
    /pull_request\.template\.body/, /raw\.githubusercontent\.com/,
    /default_body/, /cannot be loaded.*(?:report|fall back)/i]);
});

test('GitHub failure respects mode boundaries and never implies success', () => {
  includes(reference('github-access'), [/MCP.*default/i, /gh.*fallback/i,
    /Neither/i, /description.*(?:stop|blocker)/i, /local-commit.*no.*GitHub/i,
    /(?:PR|remote step).*not.*(?:created|completed|run)/i,
    /remote.*(?:owner|repo)/i]);
});

test('human sign-off and targeted feedback remain separate', () => {
  includes(router(), [/aw-request-human-review/, /aw-resolve-pr-feedback/]);
  includes(read('skills/aw-request-human-review/SKILL.md'), [/independently.*aw-ship/i,
    /only for docs\/artifact sign-off PRs/i, /Do not run post-PR CI/i]);
  includes(read('skills/aw-help/SKILL.md'), [/local-commit/, /full-pr/,
    /description-only/, /description-update/, /aw-request-human-review/]);
});

test('affected callers have no active retired commands or implicit shipping', () => {
  for (const file of ['skills/aw-help/SKILL.md', 'skills/aw-work/references/shipping-workflow.md']) {
    const body = read(file);
    assert(!/\baw-commit(?:-push-pr)?\b/.test(body), `${file} contains a retired command`);
    assert(body.includes('aw-ship'));
  }
  includes(read('skills/aw-work/references/shipping-workflow.md'),
    [/only.*(?:explicit|authorized)/i, /implementation.*does not authorize/i,
      /local-commit/, /full-pr/, /workflow\.steps\.commit_push_pr\.skill/]);
});

test('router meets budget and lazy reference links exist', () => {
  const body = router().replace(/^---\n[\s\S]*?\n---\n/, '');
  assert(body.trim().split(/\s+/).length <= 2200, 'skill-body budget exceeded');
  for (const match of body.matchAll(/references\/([a-z-]+\.md)/g)) {
    assert(fs.existsSync(path.join(root, 'skills/aw-ship/references', match[1])), match[0]);
  }
});

console.log(`\n${passed} passed; ${failed} failed (static contracts, not runtime behavior)`);
if (failed) process.exitCode = 1;
