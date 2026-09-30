/** Ambient drift uses the new brand photography and pauses outside the viewport. */
export function initAmbient() {
  const abort = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
  const scenes = [...document.querySelectorAll<HTMLElement>('[data-ambient]')];
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-ambient-toggle]')];
  const visible = new Set<Element>();
  let paused = false;
  const sync = () => {
    const staticMode = reduced.matches || Boolean(connection?.saveData);
    scenes.forEach(scene => { scene.dataset.state = !staticMode && !paused && !document.hidden && visible.has(scene) ? 'playing' : 'paused'; });
    buttons.forEach(button => {
      button.hidden = false; button.disabled = staticMode;
      const label = staticMode ? 'Ambiente estático' : paused ? 'Activar ambiente' : 'Pausar ambiente';
      button.setAttribute('aria-label', label); button.setAttribute('aria-pressed', String(paused));
      button.querySelector('span')!.textContent = label;
      button.querySelector('path')!.setAttribute('d', paused ? 'M6 3l10 7-10 7z' : 'M7 4v12M13 4v12');
    });
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)); sync();
  });
  scenes.forEach(scene => observer.observe(scene));
  buttons.forEach(button => button.addEventListener('click', () => { paused = !paused; sync(); }, { signal: abort.signal }));
  reduced.addEventListener('change', sync, { signal: abort.signal });
  connection?.addEventListener('change', sync, { signal: abort.signal });
  document.addEventListener('visibilitychange', sync, { signal: abort.signal });
  window.addEventListener('pageshow', sync, { signal: abort.signal });
  window.addEventListener('pagehide', event => { if (!event.persisted) { observer.disconnect(); abort.abort(); } }, { signal: abort.signal });
  sync();
}
