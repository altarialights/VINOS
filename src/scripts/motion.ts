import { motion, chapterAt } from '../config/motion-v2';
import type { gsap as GSAP } from 'gsap';

declare global { interface Window { nexusMotionFallback?: number; nexusMotionFallbackExceeded?: boolean } }
type Timeline = ReturnType<typeof GSAP.timeline>;
type Pinned = { timeline: Timeline; destination: (id: string) => number | undefined; seek: (id: string) => void };
const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** Native scroll; one controller owns navigation, scene choreography and stacked parallax. */
export async function initMotion() {
  const root = document.documentElement;
  const track = document.querySelector<HTMLElement>('.track')!;
  const stage = document.querySelector<HTMLElement>('.stage')!;
  const chapters = [...document.querySelectorAll<HTMLElement>('.chapter')];
  const dots = [...document.querySelectorAll<HTMLAnchorElement>('.chapter-dots a')];
  const desktop = matchMedia(motion.desktopQuery);
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const abort = new AbortController();
  const options = { signal: abort.signal };
  let dispose: (() => void) | undefined;
  let pinned: Pinned | undefined;
  let generation = 0;
  let activeId = 'inicio';
  let navigationFrame = 0;
  let pendingFocus: HTMLElement | undefined;
  const oldRestoration = history.scrollRestoration;
  history.scrollRestoration = 'manual';

  function cancelNavigation() {
    cancelAnimationFrame(navigationFrame); navigationFrame = 0; pendingFocus = undefined;
  }
  function focusWhenReady() {
    if (!pendingFocus) return;
    if (!pinned || !pendingFocus.classList.contains('chapter') || Number(getComputedStyle(pendingFocus).opacity) > .98) {
      if (!navigationFrame) { pendingFocus.focus({ preventScroll: true }); pendingFocus = undefined; }
    }
  }
  function navigate(id: string, immediate = false, push = false) {
    const target = document.getElementById(id);
    if (!target) return;
    cancelNavigation();
    const sceneTop = pinned?.destination(id);
    const top = sceneTop ?? Math.max(0, target.getBoundingClientRect().top + scrollY - document.querySelector('header')!.getBoundingClientRect().height - 16);
    const destination = Math.min(top, Math.max(0, root.scrollHeight - innerHeight));
    if (push && location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    pendingFocus = target;
    if (immediate || reduced.matches || Math.abs(destination - scrollY) < 2) {
      scrollTo({ top: destination, behavior: 'auto' });
      if (sceneTop !== undefined) pinned?.seek(id);
      focusWhenReady(); return;
    }
    const from = scrollY;
    const start = performance.now();
    const duration = motion.navigationSeconds * 1000;
    const step = (now: number) => {
      const t = clamp((now - start) / duration);
      const eased = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      scrollTo({ top: from + (destination - from) * eased, behavior: 'auto' });
      if (t < 1) navigationFrame = requestAnimationFrame(step);
      else { navigationFrame = 0; focusWhenReady(); }
    };
    navigationFrame = requestAnimationFrame(step);
  }
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || !document.getElementById(link.hash.slice(1))) return;
    event.preventDefault(); navigate(link.hash.slice(1), false, true);
  }, options);
  window.addEventListener('wheel', cancelNavigation, { ...options, passive: true });
  window.addEventListener('touchstart', cancelNavigation, { ...options, passive: true });
  window.addEventListener('keydown', event => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Tab', 'Escape'].includes(event.key)) cancelNavigation(); }, options);
  window.addEventListener('hashchange', () => navigate(location.hash.slice(1) || 'inicio'), options);

  function stackedParallax() {
    if (reduced.matches) return () => {};
    let frame = 0;
    let height = innerHeight;
    let width = innerWidth;
    type Row = { chapter: HTMLElement; top: number; height: number; active: boolean; layers: { el: HTMLElement; amount: number }[] };
    const rows: Row[] = chapters.map((chapter, index) => ({
      chapter, top: 0, height: 0, active: false,
      layers: [
        ...(index === 0 ? [{ el: stage.querySelector<HTMLElement>('.scene-camera')!, amount: motion.mobile.backgroundPx }] : []),
        ...[...chapter.querySelectorAll<HTMLElement>('.static-art')].map(el => ({ el, amount: index === 2 ? motion.mobile.foregroundPx : motion.mobile.subjectPx })),
        ...[...chapter.querySelectorAll<HTMLElement>('[data-foreground]')].map(el => ({ el, amount: el.dataset.foreground === 'left' ? motion.mobile.foregroundPx : 20 })),
      ],
    }));
    const measure = () => {
      height = innerHeight;
      rows.forEach(row => { row.top = row.chapter.getBoundingClientRect().top + scrollY; row.height = row.chapter.offsetHeight; });
      request();
    };
    const render = () => {
      frame = 0; if (document.hidden) return;
      rows.filter(row => row.active).forEach(row => {
        const progress = clamp((scrollY + height - row.top) / (height + row.height)) - .5;
        row.layers.forEach(({ el, amount }) => { el.style.transform = `translate3d(0,${(progress * amount).toFixed(2)}px,0)`; });
      });
    };
    const request = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(render); };
    const observer = new IntersectionObserver(records => {
      records.forEach(record => { const row = rows.find(row => row.chapter === record.target)!; row.active = record.isIntersecting; }); request();
    }, { threshold: 0 });
    rows.forEach(row => observer.observe(row.chapter));
    const resize = () => { if (innerWidth !== width) { width = innerWidth; measure(); } };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else request(); };
    const resizeObserver = new ResizeObserver(measure);
    chapters.forEach(chapter => resizeObserver.observe(chapter));
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    measure();
    return () => {
      observer.disconnect(); resizeObserver.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visibility);
      rows.forEach(row => row.layers.forEach(({ el }) => el.style.removeProperty('transform')));
    };
  }

  async function setMode() {
    const run = ++generation;
    const wasPinned = Boolean(pinned);
    const inNarrative = wasPinned && scrollY < track.offsetTop + track.offsetHeight - innerHeight;
    cancelNavigation(); dispose?.(); dispose = undefined; pinned = undefined;
    if (!desktop.matches) {
      root.classList.remove('motion-desktop', 'enhanced');
      chapters.forEach(chapter => { chapter.inert = false; chapter.removeAttribute('aria-hidden'); });
      dispose = stackedParallax();
      if (inNarrative) navigate(activeId, true);
      clearTimeout(window.nexusMotionFallback);
      return;
    }
    root.classList.add('motion-desktop');
    clearTimeout(window.nexusMotionFallback);
    window.nexusMotionFallback = window.setTimeout(() => {
      if (run !== generation || root.classList.contains('enhanced')) return;
      generation++; root.classList.remove('motion-desktop');
      chapters.forEach(chapter => { chapter.inert = false; chapter.removeAttribute('aria-hidden'); });
      dispose = stackedParallax();
    }, 6000);
    chapters.forEach((chapter, index) => { chapter.inert = index !== 0; chapter.setAttribute('aria-hidden', String(index !== 0)); });
    try {
      const [g, s] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (run !== generation) return;
      const { gsap } = g; const { ScrollTrigger } = s;
      const firstImages = [...stage.querySelectorAll<HTMLImageElement>('[data-layer="bottle"] img, .ambient-poster')];
      await Promise.allSettled(firstImages.map(img => img.decode()));
      if (run !== generation) return;
      gsap.registerPlugin(ScrollTrigger);
      clearTimeout(window.nexusMotionFallback);
      const layer = (name: string) => stage.querySelector<HTMLElement>(`[data-layer="${name}"]`)!;
      const loaded = new Set<string>();
      const prepare = (name: string) => {
        if (loaded.has(name)) return;
        loaded.add(name);
        const img = layer(name).querySelector<HTMLImageElement>('img')!;
        if (img.dataset.src) {
          img.style.visibility = 'hidden'; img.loading = 'eager'; img.src = img.dataset.src;
          void img.decode().then(() => { img.style.visibility = ''; }).catch(() => {});
        }
      };
      prepare('leaves');
      let timeline!: Timeline;
      let trigger!: ReturnType<typeof ScrollTrigger.create>;
      let previous = -1;
      const accessibility = () => {
        const time = timeline.time();
        const current = chapterAt(time);
        chapters.forEach(chapter => {
          const visible = Number(gsap.getProperty(chapter, 'opacity')) > motion.visibleThreshold;
          if (chapter.inert === visible) { chapter.inert = !visible; chapter.setAttribute('aria-hidden', String(!visible)); chapter.style.pointerEvents = visible ? 'auto' : 'none'; }
        });
        if (current !== previous) {
          previous = current; activeId = chapters[current]!.id; stage.dataset.chapter = activeId;
          dots.forEach((dot, index) => index === current ? dot.setAttribute('aria-current', 'true') : dot.removeAttribute('aria-current'));
        }
        focusWhenReady();
      };
      const context = gsap.context(() => {
        timeline = gsap.timeline({ paused: true, onUpdate: accessibility });
        gsap.set(chapters, { opacity: 0 }); gsap.set(chapters[0]!, { opacity: 1 });
        gsap.set(layer('bottle'), { x: 0, y: 0, xPercent: -50, yPercent: -50, rotation: 7, scale: 1, opacity: 1 });
        gsap.set([layer('grapes'), layer('glass')], { x: 0, y: 0, xPercent: -50, yPercent: -50, scale: .96, rotation: 0, opacity: 0 });
        gsap.set(layer('leaves'), { x: 0, y: 0, xPercent: -50, yPercent: -50, rotation: 0, opacity: .22 });
        timeline.fromTo('.scene-camera', { scale: motion.camera.startScale, xPercent: 0, yPercent: 0 }, { scale: motion.camera.endScale, xPercent: motion.camera.xPercent, yPercent: motion.camera.yPercent, duration: motion.duration, ease: 'none' }, 0);
        timeline.to('[data-depth="bottle"], [data-depth="grapes"], [data-depth="glass"]', { yPercent: -3.2, xPercent: 1.2, duration: motion.duration, ease: 'none' }, 0);
        timeline.to('[data-depth="leaves"]', { yPercent: -4.8, xPercent: 2, duration: motion.duration, ease: 'none' }, 0);
        timeline.to(layer('leaves'), { opacity: .12, duration: motion.duration, ease: 'none' }, 0);
        timeline.fromTo('.desktop-foreground .foreground-right', { yPercent: 0, xPercent: 0 }, { yPercent: -5, xPercent: 2, duration: motion.duration, ease: 'none' }, 0);
        timeline.fromTo('.desktop-foreground .foreground-left', { yPercent: 0, xPercent: 0 }, { yPercent: -7, xPercent: -2, duration: motion.duration, ease: 'none' }, 0);
        motion.scenes.forEach(scene => timeline.addLabel(scene.id, scene.at));
        motion.scenes.slice(0, -1).forEach((scene, i) => {
          const at = scene.at + scene.hold;
          timeline.to(chapters[i]!, { opacity: 0, duration: scene.transition * .56, ease: 'power1.inOut' }, at);
          timeline.to(chapters[i + 1]!, { opacity: 1, duration: scene.transition * .56, ease: 'power1.inOut' }, at + scene.transition * .44);
        });
        timeline.to(layer('bottle'), { xPercent: -42, scale: .97, opacity: 0, duration: .95, ease: 'power1.inOut' }, .8);
        timeline.to(layer('grapes'), { scale: 1, opacity: 1, duration: .85, ease: 'power1.inOut' }, 2.4);
        timeline.to('.reading-veil', { opacity: 1, duration: .85, ease: 'none' }, 2.4);
        timeline.to(layer('grapes'), { scale: 1.025, opacity: 0, duration: .7, ease: 'power1.inOut' }, 4.05);
        timeline.to(layer('glass'), { scale: 1, opacity: 1, duration: .8, ease: 'power1.inOut' }, 4.2);
        timeline.to(layer('glass'), { scale: 1.045, duration: 2.95, ease: 'none' }, 5);
        timeline.to('.sequence-exit', { opacity: 1, duration: .8, ease: 'none' }, motion.duration - .8);
        trigger = ScrollTrigger.create({ id: 'nexus-narrative', trigger: track, start: 'top top', end: 'bottom bottom', animation: timeline, scrub: motion.scrub,
          onUpdate(self) { if (self.progress > .18) prepare('grapes'); if (self.progress > .36) prepare('glass'); },
        });
      }, stage);
      pinned = {
        timeline,
        destination(id) { const label = timeline.labels[id]; return label === undefined ? undefined : trigger.start + (trigger.end - trigger.start) * (label + .08) / motion.duration; },
        seek(id) { const label = timeline.labels[id]; if (label !== undefined) { trigger.getTween()?.pause(); timeline.time(label + .08); accessibility(); } },
      };
      root.classList.add('enhanced'); accessibility(); ScrollTrigger.refresh();
      dispose = () => {
        context.revert(); root.classList.remove('enhanced', 'motion-desktop');
        chapters.forEach(chapter => { chapter.inert = false; chapter.removeAttribute('aria-hidden'); chapter.style.removeProperty('pointer-events'); });
        dots.forEach(dot => dot.removeAttribute('aria-current')); delete stage.dataset.chapter;
      };
      void document.fonts.ready.then(() => { if (run === generation) ScrollTrigger.refresh(); });
      if (location.hash) navigate(location.hash.slice(1), true);
    } catch {
      if (run !== generation) return;
      root.classList.remove('motion-desktop', 'enhanced');
      chapters.forEach(chapter => { chapter.inert = false; chapter.removeAttribute('aria-hidden'); });
      dispose = stackedParallax();
    }
  }
  desktop.addEventListener('change', setMode, options);
  reduced.addEventListener('change', () => { if (!desktop.matches) void setMode(); }, options);
  window.addEventListener('pagehide', event => {
    cancelNavigation();
    if (!event.persisted) { generation++; dispose?.(); abort.abort(); history.scrollRestoration = oldRestoration; }
  }, options);
  await setMode();
}
