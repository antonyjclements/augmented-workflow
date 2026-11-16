const { test } = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

const root = join(__dirname, '..');
const read = file => readFileSync(join(root, file), 'utf8');

test('the landing page loads the guide and the fixed Wren presentation', () => {
  const html = read('index.html');
  const guide = read('assets/field-guide.mjs');
  const css = read('assets/field-guide.css');

  assert.match(html, /<script type="module" src="assets\/field-guide\.mjs">/);
  assert.match(html, /data-wren-motion/);
  for (const [, asset] of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)) {
    assert.ok(existsSync(join(root, asset)), asset);
  }
  assert.match(guide, /class="article-wren".*data-wren-pose/);
  assert.match(guide, /import\('\.\/wren-idle\.js'\)/);
  assert.match(css, /paper-grain\.svg/);
  assert.ok(existsSync(join(root, 'assets/paper-grain.svg')));
  assert.doesNotMatch(css, /@keyframes wren|wren-idle-gesture/);
});

test('the former guide entry preserves old links at the project root', () => {
  const html = read('field-guide.html');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  assert.match(html, /<a href="\.\/">/);
  for (const base of ['https://example.test/', 'https://example.test/augmented-workflow/']) {
    const deepLink = '?page=roles#worked-handoff';
    const location = new URL('field-guide.html' + deepLink, base);
    location.replace = target => {
      assert.equal(target, base + deepLink);
      location.replaced = true;
    };
    runInNewContext(script, { URL, window: { location } });
    assert.equal(location.replaced, true);
  }
});

test('the standalone technical and usage pages are retired', () => {
  for (const filename of ['technical.html', 'usage-guide.html']) {
    assert.equal(existsSync(join(root, filename)), false);
  }
});
