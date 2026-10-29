/* Animate pose transitions inside each mascot's fixed page box. */
(() => {
  'use strict';
  const idleDelay = 10000;
  const frameDelay = 125;
  const edges = [
    ['alert', 'in-flight'], ['in-flight', 'perched'],
    ['perched', 'gathering'], ['gathering', 'alert']
  ];
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const button = document.querySelector('[data-wren-motion]');
  const mascots = [];
  const sheets = new Map();
  let enabled = true;
  try { enabled = localStorage.getItem('aw-wren-motion') !== 'off'; } catch { /* Storage may be unavailable. */ }
  let timer;
  let animation;
  let active;
  let generation = 0;

  function allowed() { return enabled && !preference.matches && !document.hidden; }
  function paint(mascot, rest) { Object.assign(mascot.element.style, rest); }
  function cancel() {
    generation++;
    clearTimeout(timer);
    cancelAnimationFrame(animation);
    if (active) paint(active, active.rest);
    active = null;
  }
  function schedule() { if (allowed()) timer = setTimeout(play, idleDelay); }
  function reset() { cancel(); schedule(); }
  function load(url) {
    if (!sheets.has(url)) {
      const promise = new Promise(resolve => {
        const image = new Image();
        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);
        image.src = url;
      });
      sheets.set(url, promise);
      promise.then(ok => { if (!ok) sheets.delete(url); });
    }
    return sheets.get(url);
  }
  function frameStyle(url, frame) {
    return {
      backgroundImage:`url("${url}")`, backgroundSize:'400% 200%',
      backgroundPosition:`${(frame % 4) * 100 / 3}% ${Math.floor(frame / 4) * 100}%`
    };
  }
  async function play() {
    if (!allowed()) return;
    schedule();
    const token = generation;
    const visible = mascots.filter(({element}) => {
      const box = element.getBoundingClientRect();
      return box.width > 0 && box.height > 0 && box.top >= 0 && box.left >= 0 && box.bottom <= innerHeight && box.right <= innerWidth;
    });
    if (!visible.length) return;
    const mascot = visible[Math.floor(Math.random() * visible.length)];
    const first = edges.findIndex(edge => edge[0] === mascot.pose);
    const cycle = edges.map((_, index) => edges[(first + index) % edges.length]);
    const urls = cycle.map(edge => `assets/wren/sprites/wren-${edge[0]}-to-${edge[1]}-${mascot.theme}.png`);
    const ready = await Promise.all(urls.map(load));
    if (!ready.every(Boolean) || token !== generation || !allowed()) return;
    // Reject any older pending playback when a load takes longer than one idle interval.
    generation++;
    const playbackToken = generation;
    cancelAnimationFrame(animation);
    if (active) paint(active, active.rest);
    active = mascot;
    let started;
    function tick(now) {
      if (playbackToken !== generation || !allowed()) return;
      started ??= now;
      // Adjacent sheets share an endpoint; show it once at each handoff.
      const step = Math.floor((now - started) / frameDelay);
      if (step >= cycle.length * 7) {
        paint(mascot, mascot.rest);
        active = null;
        animation = null;
        return;
      }
      const segment = Math.floor(step / 7);
      paint(mascot, frameStyle(urls[segment], step % 7));
      animation = requestAnimationFrame(tick);
    }
    animation = requestAnimationFrame(tick);
  }
  for (const image of document.querySelectorAll('.wren-hero, .wren-signoff')) {
    const initialize = () => {
      if (!image.naturalWidth) return;
      const element = document.createElement('span');
      element.className = `${image.className} wren-sprite`;
      element.setAttribute('aria-hidden', 'true');
      const rest = {backgroundImage:`url("${image.getAttribute('src')}")`,backgroundSize:'87.5% 87.5%',backgroundPosition:'50% 50%'};
      const mascot = {element, rest, pose:image.dataset.wrenPose, theme:image.dataset.wrenTheme};
      paint(mascot, rest);
      image.replaceWith(element);
      mascots.push(mascot);
    };
    if (image.complete) initialize();
    else image.addEventListener('load', initialize, {once:true});
  }
  function updateButton() {
    if (!button) return;
    button.hidden = false;
    button.disabled = preference.matches;
    button.setAttribute('aria-pressed', String(enabled && !preference.matches));
    button.textContent = preference.matches ? 'Wren motion: reduced' : `Wren motion: ${enabled ? 'on' : 'off'}`;
  }
  button?.addEventListener('click', () => {
    enabled = !enabled;
    try { localStorage.setItem('aw-wren-motion', enabled ? 'on' : 'off'); } catch { /* Keep this visit's choice. */ }
    updateButton(); reset();
  });
  for (const event of ['pointermove','pointerdown','keydown','scroll','touchstart','wheel','resize']) window.addEventListener(event, reset, {passive:true});
  document.addEventListener('visibilitychange', reset);
  window.addEventListener('pagehide', cancel);
  window.addEventListener('pageshow', reset);
  preference.addEventListener('change', () => { updateButton(); reset(); });
  updateButton(); schedule();
})();
