const { execFileSync } = require('node:child_process');
const { writeFileSync } = require('node:fs');
const { resolve } = require('node:path');
const markdown = require('markdown-it')();

const ref = process.argv[2] ?? 'origin/main';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });
const revision = git('rev-parse', '--verify', ref + '^{commit}').trim();
const paths = git('ls-tree', '-r', '--name-only', revision, 'skills')
  .split('\n').filter(path => /^skills\/[^/]+\/SKILL\.md$/.test(path));
if (!paths.length) throw new Error('No bundled skills at ' + revision);

const sourceRoot = 'https://github.com/antonyjclements/augmented-workflow/blob/' + revision + '/';
const slug = title => title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
const render = tokens => markdown.renderer.render(tokens, markdown.options, {});
function sectionContent(tokens, file) {
  return render(tokens).replace(/href="([^"]+)"/g, (_, href) => {
    if (href.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(href)) return 'href="' + href + '"';
    const url = new URL(href, sourceRoot + file);
    return 'href="' + markdown.utils.escapeHtml(url.href) + '"';
  });
}

const skills = {};
for (const file of paths) {
  const source = git('show', revision + ':' + file);
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error('Missing skill frontmatter in ' + file);
  const [, frontmatter, body] = match;
  const name = file.split('/')[1];
  const hint = frontmatter.match(/^argument-hint:\s*(.+)$/m)?.[1] ?? '';
  const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1] ?? '';
  const unquote = value => value.replace(/^(['"])(.*)\1$/, '$2');
  const tokens = markdown.parse(body, {});
  const groups = [];
  const ids = new Set();
  let current = [];
  let heading;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'heading_open' && token.level === 0 && /^h[12]$/.test(token.tag)) {
      if (token.tag === 'h2' || current.length) groups.push({ heading, tokens: current });
      heading = token.tag === 'h2' ? tokens[i + 1] : undefined;
      current = [];
      i += 2;
    } else {
      current.push(token);
    }
  }
  groups.push({ heading, tokens: current });
  const sections = groups.filter(group => group.heading).map(({ heading: title, tokens }) => {
    const base = slug(title.content) || 'section';
    let id = base;
    for (let n = 2; ids.has(id); n++) id = base + '-' + n;
    ids.add(id);
    return [id, markdown.renderer.renderInline(title.children, markdown.options, {}), sectionContent(tokens, file)];
  });
  if (!sections.length) throw new Error('No reference sections in ' + file);
  const preface = groups.filter(group => !group.heading).map(group => sectionContent(group.tokens, file)).join('');
  skills[name] = { hint: unquote(hint), description: unquote(description), source: sourceRoot + file, preface, sections };
}

const output = '// Generated from bundled SKILL.md files. See scripts/update-field-guide-skills.cjs.\n'
  + 'export const skillReferences = ' + JSON.stringify(skills, null, 2) + ';\n';
writeFileSync(resolve(__dirname, '../assets/field-guide-skills.mjs'), output);
