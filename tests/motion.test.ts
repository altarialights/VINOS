import { test } from 'node:test';
import assert from 'node:assert/strict';
import { motion, chapterAt } from '../src/config/motion-v2';

test('scene labels have distinct reading holds and continuous transition boundaries', () => {
  motion.scenes.slice(0, -1).forEach((scene, index) => {
    assert.ok(Math.abs(scene.at + scene.hold + scene.transition - motion.scenes[index + 1]!.at) < .001);
    const fraction = scene.transition / (scene.hold + scene.transition);
    assert.ok(fraction >= .45 && fraction <= .6);
  });
  const last = motion.scenes.at(-1)!;
  assert.ok(Math.abs(last.at + last.hold - motion.duration) < .001);
  assert.equal(motion.scrub, .7);
});

test('rendered chapter selection reverses consistently and leaves both glass states on the right', () => {
  for (const [index, scene] of motion.scenes.entries()) {
    assert.equal(chapterAt(scene.at + .1), index);
  }
  assert.equal(chapterAt(0), 0); assert.equal(chapterAt(motion.duration), 4);
  assert.equal(motion.scenes[3].copy, motion.scenes[4].copy);
});
