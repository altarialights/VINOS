type Connection = EventTarget & { saveData?: boolean };
type AmbientEntry = {
  root: HTMLElement; video: HTMLVideoElement; near: boolean; visible: number;
  desired: boolean; pending: boolean; blocked: boolean; decoded: boolean;
  frame?: number; frameTimeout?: ReturnType<typeof setTimeout>;
};

/** One owner for both independent videos; no frame seeking and no stored preferences. */
export function initAmbient() {
  const abort = new AbortController();
  const options = { signal: abort.signal };
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  const variant = matchMedia('(max-width:767px)').matches ? 'mobile' : 'desktop';
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-ambient-toggle]')];
  const entries: AmbientEntry[] = [...document.querySelectorAll<HTMLElement>('[data-ambient]')].map(root => ({
    root, video: root.querySelector<HTMLVideoElement>('video')!, near: false, visible: 0,
    desired: false, pending: false, blocked: false, decoded: false,
  }));
  let manualPause = false;
  let ready = false;
  let dead = false;
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  const prohibited = () => reduced.matches || Boolean(connection?.saveData);
  const state = (entry: AmbientEntry, value: string) => { entry.root.dataset.state = value; };
  const cancelFrame = (entry: AmbientEntry) => {
    if (entry.frame !== undefined) entry.video.cancelVideoFrameCallback?.(entry.frame);
    clearTimeout(entry.frameTimeout); entry.frame = undefined;
  };
  const controls = () => {
    const blocked = entries.some(e => e.visible > 0 && e.blocked);
    const label = reduced.matches ? 'Ambiente estático' : connection?.saveData ? 'Ahorro de datos activo' : manualPause || blocked ? 'Activar ambiente' : 'Pausar ambiente';
    buttons.forEach(button => {
      button.hidden = false; button.disabled = prohibited();
      button.setAttribute('aria-label', label); button.querySelector('span')!.textContent = label;
      button.querySelector('path')!.setAttribute('d', manualPause || blocked ? 'M6 3l10 7-10 7z' : 'M7 4v12M13 4v12');
    });
  };
  const reveal = (entry: AmbientEntry) => {
    if (!entry.desired || dead || entry.video.paused) return;
    entry.decoded = true; entry.root.dataset.decoded = 'true'; state(entry, 'playing');
  };
  const decodedFrame = (entry: AmbientEntry) => {
    cancelFrame(entry);
    if ('requestVideoFrameCallback' in entry.video) entry.frame = entry.video.requestVideoFrameCallback(() => reveal(entry));
    else entry.frameTimeout = setTimeout(() => { if (entry.video.readyState >= 2) reveal(entry); }, 80);
  };
  const load = (entry: AmbientEntry) => {
    if (entry.video.hasAttribute('src') || prohibited() || !ready) return;
    entry.video.muted = true; entry.video.defaultMuted = true;
    entry.video.src = entry.video.dataset[variant]!;
    entry.root.dataset.variant = variant;
    entry.video.preload = 'auto'; entry.video.load(); state(entry, 'loading');
  };
  const stop = (entry: AmbientEntry) => {
    entry.desired = false; cancelFrame(entry); entry.video.pause();
    if (prohibited()) { entry.root.dataset.decoded = 'false'; state(entry, 'poster'); }
    else state(entry, entry.blocked ? 'fallback' : entry.video.hasAttribute('src') ? 'paused' : 'poster');
  };
  async function play(entry: AmbientEntry) {
    if (entry.pending || entry.blocked || !entry.desired) return;
    if (!entry.video.paused) { if (!entry.decoded) decodedFrame(entry); return; }
    entry.pending = true; state(entry, 'loading');
    try {
      await entry.video.play();
      if (!entry.desired || dead || prohibited() || document.hidden) { entry.video.pause(); return; }
      decodedFrame(entry);
    } catch (error) {
      // A late cancellation is expected when scrolling away, hiding or pausing.
      if (entry.desired && !dead && (error as DOMException).name !== 'AbortError') {
        entry.blocked = true; entry.root.dataset.decoded = 'false'; state(entry, 'fallback');
      }
    } finally { entry.pending = false; controls(); }
  }
  function sync() {
    if (dead) return;
    const allowed = ready && !prohibited() && !manualPause && !document.hidden;
    const visible = entries.filter(e => e.visible > .01).sort((a, b) => b.visible - a.visible);
    const active = allowed ? visible[0] : undefined;
    entries.forEach(entry => { if (entry !== active) stop(entry); });
    if (allowed) entries.filter(e => e.near && !e.blocked).forEach(load);
    if (active) { active.desired = true; load(active); void play(active); }
    controls();
  }
  const nearObserver = new IntersectionObserver(records => {
    records.forEach(record => { const entry = entries.find(e => e.root === record.target)!; entry.near = record.isIntersecting; }); sync();
  }, { rootMargin: '500px 0px', threshold: 0 });
  const visibleObserver = new IntersectionObserver(records => {
    records.forEach(record => { const entry = entries.find(e => e.root === record.target)!; entry.visible = record.isIntersecting ? record.intersectionRatio : 0; }); sync();
  }, { threshold: [0, .01, .15, .4, .7, 1] });
  entries.forEach(entry => {
    nearObserver.observe(entry.root); visibleObserver.observe(entry.root);
    entry.video.addEventListener('error', () => { entry.blocked = true; entry.root.dataset.decoded = 'false'; state(entry, 'fallback'); controls(); }, options);
    entry.video.addEventListener('playing', () => { if (!entry.desired || document.hidden) entry.video.pause(); else decodedFrame(entry); }, options);
  });
  buttons.forEach(button => button.addEventListener('click', () => {
    const retry = entries.some(e => e.visible > 0 && e.blocked);
    manualPause = retry ? false : !manualPause;
    if (retry) entries.forEach(entry => { entry.blocked = false; if (entry.video.error) { entry.video.removeAttribute('src'); entry.video.load(); } });
    ready = true; sync();
  }, options));
  reduced.addEventListener('change', sync, options);
  connection?.addEventListener('change', sync, options);
  document.addEventListener('visibilitychange', sync, options);
  const afterLoad = () => { idleTimer = setTimeout(() => { ready = true; sync(); }, 400); };
  if (document.readyState === 'complete') afterLoad(); else window.addEventListener('load', afterLoad, { ...options, once: true });
  window.addEventListener('pageshow', sync, options);
  window.addEventListener('pagehide', event => {
    entries.forEach(stop);
    if (!event.persisted) { dead = true; clearTimeout(idleTimer); nearObserver.disconnect(); visibleObserver.disconnect(); abort.abort(); }
  }, options);
  controls();
}
