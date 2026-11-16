import { groups, groupPages } from './field-guide-content.mjs';
import { newTab } from './field-guide-articles.mjs';

const pages = groups.flatMap(group => groupPages(group).map(page => ({ ...page, group })));
const pageId = new URLSearchParams(location.search).get('page');
const page = pages.find(candidate => candidate.id === pageId) ?? pages[0];
const path = item => item.id === 'overview' ? 'field-guide.html' : '?page=' + item.id;
const firstPage = group => group.pages[0];
const find = selector => document.querySelector(selector);
const header = find('.guide-header');

document.title = page.title + ' · AW Field Guide';

function articleList(items) {
  return '<ul>' + items.map(item =>
    `<li><a href="${item.externalUrl ?? path(item)}"${item.externalUrl ? ' ' + newTab : ''}${item.id === page.id && !item.externalUrl ? ' aria-current="page"' : ''}>${item.navLabel ?? item.title}</a></li>`
  ).join('') + '</ul>';
}

find('.sidebar-nav').innerHTML = groups.map((group, index) => `
  <div class="nav-group">
    <h2><span aria-hidden="true">0${index + 1}</span> ${group.title}</h2>
    ${articleList(group.pages)}
    ${(group.subgroups ?? []).map(subgroup => `
      <div class="skill-group"><h3>${subgroup.title}</h3>${articleList(subgroup.pages)}</div>
    `).join('')}
  </div>
`).join('');

find('.top-links').innerHTML = groups.slice(1).map(group =>
  `<a href="${path(firstPage(group))}"${group === page.group ? ' aria-current="true"' : ''}>${group.title}</a>`
).join('');

const template = document.createElement('template');
function textOf(html) {
  template.innerHTML = html.replaceAll(/<\/?(?:p|li|pre|div|td|th|h[1-6])\b[^>]*>/g, ' ');
  return template.content.textContent.replaceAll(/\s+/g, ' ').trim();
}
function escape(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

const breadcrumb = `
  <p class="breadcrumb"><a href="field-guide.html">Field guide</a> / <a href="${path(firstPage(page.group))}">${page.group.title}</a>${page.stage ? ' / ' + page.stage : ''}</p>
`;
const wren = page.wren
  ? `<div class="article-wren"><img data-guide-wren="${page.wren}" data-wren-pose="${page.wren}" data-wren-theme="light" src="assets/wren/wren-${page.wren}.png" alt="" width="88" height="88"></div>`
  : '';

function factPanel(items, className) {
  return '<dl class="' + className + '">' + items.map(([label, value]) =>
    `<div><dt>${label}</dt><dd>${value}</dd></div>`
  ).join('') + '</dl>';
}

function readingTime(article) {
  const copy = [article.intro, article.preface ?? '', ...article.sections.map(([, , body]) => body)].join(' ');
  return Math.max(1, Math.ceil(textOf(copy).split(' ').length / 180)) + ' min read';
}

function skillHeader(skill) {
  const invocation = '/' + page.id + (skill.hint ? ' ' + skill.hint : '');
  const keys = skill.keys.map(key => `<code>workflow.${key}.skill</code>`).join('<br>');
  const facts = factPanel([
    ['Stage', page.stage + ' · ' + skill.stageInfo],
    ['Config key', keys || 'Direct invocation'],
    ['Source', `<a href="${skill.source}"><code>skills/${page.id}/SKILL.md</code></a>`],
    ['Replace it', keys
      ? '<a href="?page=replaceable-steps">Set the configured provider</a> for the relevant stage.'
      : 'Use it directly. No dedicated replacement key.'],
  ], 'skill-facts');
  return `
    <div class="skill-plate">
      <div class="skill-feature">
        <div>
          <p class="eyebrow">Skill · ${page.stage}</p>
          <h1>${page.title}</h1>
          ${skill.tagline ? '<p class="skill-tagline">' + skill.tagline + '</p>' : ''}
          <p class="skill-description">${escape(page.intro)}</p>
          <pre class="skill-invocation"><code>${escape(invocation)}</code></pre>
        </div>
        ${wren}
      </div>
      ${facts}
    </div>
  `;
}

const meta = [...(page.showReadingTime ? [readingTime(page)] : []), ...(page.meta ?? [])];
const articleHeader = find('.article-header');
articleHeader.classList.toggle('skill-header', Boolean(page.skill));
articleHeader.innerHTML = breadcrumb + (page.skill ? skillHeader(page.skill) : `
  <p class="eyebrow">${page.group.title}${page.topic ? ' · ' + page.topic : ''}</p>
  ${wren}
  <h1${page.narrowTitle ? ' class="narrow-title"' : ''}>${page.title}</h1>
  <p class="lede">${page.intro}</p>
  ${meta.length ? '<p class="meta">' + meta.map(item => '<span>' + item + '</span>').join('') + '</p>' : ''}
`);

const facts = page.facts ? factPanel(page.facts, 'facts') : '';
const preface = page.preface && !page.skill ? `<div class="article-preface">${page.preface}</div>` : '';
const skillSource = page.skill ? `<div class="article-preface">
  <p class="eyebrow">Bundled skill instructions</p>
  ${page.preface}
</div>` : '';
const sectionAliases = {
  ...(!page.sections.some(([id]) => id === 'details') ? { details: page.sections[0][0] } : {}),
  ...page.aliases,
};
const sectionFromHash = () => {
  const id = location.hash.slice(1);
  return Object.hasOwn(sectionAliases, id) ? sectionAliases[id] : id;
};
const readingOrder = groups.flatMap(group => ['Start here', 'Theory', 'Concepts'].includes(group.title)
  ? group.pages
  : []);
const readingIndex = readingOrder.findIndex(item => item.id === page.id);
const previous = readingOrder[readingIndex - 1];
const next = readingIndex < 0 ? undefined : readingOrder[readingIndex + 1];
const folds = previous || next ? `
  <nav class="article-folds" aria-label="Adjacent chapters">
    ${previous ? `<a href="${path(previous)}"><span>← Previous fold</span><strong>${previous.navLabel ?? previous.title}</strong></a>` : ''}
    ${next ? `<a class="next-fold" href="${path(next)}"><span>Next fold →</span><strong>${next.navLabel ?? next.title}</strong></a>` : ''}
  </nav>
  <footer class="concept-footer"><a href="field-guide.html">Augmented Workflow field guide</a></footer>
` : '';
find('.article-body').innerHTML = facts + preface + page.sections.map(([id, title, content, externalUrl], index) => `
  ${index === 1 ? skillSource : ''}
  <section id="${id}" aria-labelledby="${id}-title">
    ${Object.entries(sectionAliases).filter(([, target]) => target === id)
      .map(([alias]) => `<span id="${alias}" class="legacy-anchor"></span>`).join('')}
    <h2 id="${id}-title"><a class="heading-link" href="${externalUrl ?? '#' + id}"${externalUrl ? ' ' + newTab : ''}>${title}</a></h2>
    ${content}
  </section>
`).join('') + folds;
for (const table of document.querySelectorAll('.article-body table')) {
  const frame = document.createElement('div');
  frame.className = 'table-scroll';
  table.before(frame);
  frame.append(table);
}

find('.outline-nav').innerHTML = `
  <p class="outline-title" aria-hidden="true">On this page</p>
  <ul>${page.sections.map(([id, title]) => `<li><a href="#${id}">${title}</a></li>`).join('')}</ul>
`;
if (page.aside) {
  const note = find('.outline-note');
  note.innerHTML = `<strong>${page.aside.title}</strong><p>${page.aside.text}</p><a href="${page.aside.href}">${page.aside.label}&nbsp;→</a>`;
  note.hidden = false;
}

for (const button of document.querySelectorAll('.sidebar-toggle, .outline-toggle')) {
  button.addEventListener('click', () => {
    button.setAttribute('aria-expanded', String(button.getAttribute('aria-expanded') === 'false'));
  });
}

const headings = page.sections.map(([id]) => document.getElementById(id));
const outlineLinks = [...document.querySelectorAll('.outline-nav a')];
let activeOutline;
let outlineFrame;
function updateOutline() {
  const pageHeight = document.documentElement.scrollHeight - innerHeight;
  header.style.setProperty('--reading-progress', (pageHeight > 0 ? scrollY / pageHeight * 100 : 0) + '%');
  const threshold = header.offsetHeight + 32;
  let current = headings.findLastIndex(heading => heading.getBoundingClientRect().top <= threshold);
  if (scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 2) {
    const target = headings.findIndex(heading => heading.id === sectionFromHash()
      && heading.getBoundingClientRect().top >= header.offsetHeight
      && heading.getBoundingClientRect().top < innerHeight);
    current = target < 0 ? headings.length - 1 : target;
  }
  const next = outlineLinks[Math.max(0, current)];
  if (next === activeOutline) return;
  activeOutline?.removeAttribute('aria-current');
  next.setAttribute('aria-current', 'location');
  activeOutline = next;
}
function scheduleOutlineUpdate() {
  cancelAnimationFrame(outlineFrame);
  outlineFrame = requestAnimationFrame(updateOutline);
}
window.addEventListener('scroll', scheduleOutlineUpdate, { passive: true });
window.addEventListener('resize', scheduleOutlineUpdate);
window.addEventListener('hashchange', scheduleOutlineUpdate);
const initialSection = headings.find(heading => heading.id === sectionFromHash());
initialSection?.scrollIntoView();
updateOutline();

const themeButton = find('.theme-button');
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
function isDark() {
  const current = document.documentElement.dataset.theme;
  return current ? current === 'dark' : systemTheme.matches;
}
function updateTheme() {
  const dark = isDark();
  themeButton.setAttribute('aria-pressed', String(dark));
  const theme = dark ? 'dark' : 'light';
  const suffix = dark ? '-dark.png' : '.png';
  for (const bird of document.querySelectorAll('[data-guide-wren]')) {
    const source = 'assets/wren/wren-' + bird.dataset.guideWren + suffix;
    if (bird.dataset.wrenTheme) bird.dataset.wrenTheme = theme;
    if (bird.tagName === 'IMG') bird.src = source;
    else bird.style.setProperty('--wren-rest', `url("${source}")`);
  }
  window.dispatchEvent(new Event('aw-wren-theme-change'));
}
themeButton.addEventListener('click', () => {
  const theme = isDark() ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem('aw-field-guide-theme', theme);
  } catch {}
  updateTheme();
});
systemTheme.addEventListener('change', updateTheme);
updateTheme();
import('./wren-idle.js');

const search = find('.search-dialog');
const searchButton = find('.search-button');
const input = find('#guide-search');
const searchResults = find('.search-results');
const searchStatus = find('.search-status');
const isApple = /mac|iphone|ipad/i.test(navigator.platform);
find('.search-button kbd').textContent = isApple ? '⌘K' : 'Ctrl K';
searchButton.setAttribute('aria-label', 'Search the guide');
let index;
let searchTrigger;

function indexPages() {
  return pages.map(item => ({
    item,
    title: item.title.toLowerCase(),
    intro: textOf([item.intro, item.preface ?? '', item.skill?.hint ?? ''].join(' ')).toLowerCase(),
    sections: item.sections.map(([id, title, content]) => ({
      id, title: textOf(title), text: (textOf(title) + ' ' + textOf(content)).toLowerCase(),
    })),
  }));
}

function renderSearch() {
  const terms = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  searchResults.replaceChildren();
  if (!terms.length) {
    searchStatus.textContent = 'Search by topic, command, or skill name.';
    return;
  }
  const matches = index.flatMap(({ item, title, intro, sections }) => {
    const allText = [title, intro, ...sections.map(section => section.text)].join(' ');
    if (!terms.every(term => allText.includes(term))) return [];
    const titleMatches = terms.every(term => title.includes(term));
    const section = titleMatches ? undefined : sections.find(candidate => terms.every(term => candidate.text.includes(term)));
    return [{ item, section, rank: titleMatches ? 2 : Number(Boolean(section)) }];
  }).sort((left, right) => right.rank - left.rank);
  searchStatus.textContent = matches.length
    ? matches.length + (matches.length === 1 ? ' result' : ' results')
    : 'No results. Try a different word or skill name.';
  for (const { item, section } of matches) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    const detail = document.createElement('small');
    link.href = item.externalUrl ?? (path(item) + (section ? '#' + section.id : ''));
    if (item.externalUrl) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    link.textContent = item.title;
    detail.textContent = item.group.title + (item.externalUrl ? ' · Opens in a new tab' : section ? ' / ' + section.title : '');
    link.append(detail);
    li.append(link);
    searchResults.append(li);
  }
}

function openSearch(trigger) {
  if (search.open) return;
  searchTrigger = trigger;
  index ??= indexPages();
  renderSearch();
  search.showModal();
  input.select();
}

searchButton.addEventListener('click', () => openSearch(searchButton));
search.addEventListener('close', () => searchTrigger?.focus({ preventScroll: true }));
search.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    event.preventDefault();
    search.close();
  }
});
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    const focused = document.activeElement;
    openSearch(focused === document.body ? searchButton : focused);
  }
});
find('.search-close').addEventListener('click', () => search.close());
input.addEventListener('input', renderSearch);
find('.search-form').addEventListener('submit', event => {
  event.preventDefault();
  searchResults.querySelector('a')?.click();
});
searchResults.addEventListener('click', event => {
  if (event.target.closest('a') && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) search.close();
});
