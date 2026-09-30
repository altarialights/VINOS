/** V2 supersedes only the motion contract of the immutable V1 handoff. */
export const motion = {
  version: '2.2.0',
  desktopQuery: '(min-width:1100px) and (min-height:700px) and (prefers-reduced-motion:no-preference)',
  scrollScreens: 5.1,
  scrub: .7,
  navigationSeconds: .85,
  visibleThreshold: .04,
  mobile: { backgroundPx: 8, subjectPx: 16, foregroundPx: 24 },
  camera: { startScale: 1.02, endScale: 1.055, xPercent: -1.6, yPercent: -1 },
  scenes: [
    { id: 'inicio', at: 0, hold: .8, transition: .95, copy: 'left' },
    { id: 'origen', at: 1.75, hold: .65, transition: .85, copy: 'left' },
    { id: 'uva', at: 3.25, hold: .8, transition: .95, copy: 'right' },
    { id: 'nariz', at: 5, hold: .85, transition: 1, copy: 'right' },
    { id: 'boca', at: 6.85, hold: 1.1, transition: 0, copy: 'right' },
  ],
  duration: 7.95,
} as const;
export function chapterAt(time: number): number {
  for (let i = motion.scenes.length - 1; i > 0; i--) {
    const previous = motion.scenes[i - 1]!;
    if (time >= previous.at + previous.hold + previous.transition / 2) return i;
  }
  return 0;
}
