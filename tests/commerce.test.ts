import { test } from 'node:test';
import assert from 'node:assert/strict';
import { demoAdapter, validDate, validCount, todayInMadrid, authorizedCheckout } from '../src/lib/commerce';
import { content } from '../src/lib/content';

test('demo never creates an order, reservation or request id', async () => {
  const date = '2099-10-10';
  assert.deepEqual(await demoAdapter.createCheckout(content.product.id, 'case3', 12), { status: 'demo' });
  assert.deepEqual(await demoAdapter.getTastingAvailability(date, 2), { status: 'demo' });
  assert.deepEqual(await demoAdapter.createTastingRequest({ date, persons: 2, slotId: 'example' }), { status: 'demo' });
  assert.deepEqual(await demoAdapter.getRetailers(content.product.id), []);
});
test('invalid quantities and unknown products or formats are rejected', async () => {
  for (const n of [0, -1, 1.5, 13, NaN, Infinity]) {
    assert.equal(validCount(n), false);
    await assert.rejects(demoAdapter.createCheckout(content.product.id, 'single', n));
  }
  await assert.rejects(demoAdapter.createCheckout('unknown', 'single', 1));
  await assert.rejects(demoAdapter.createCheckout(content.product.id, 'unknown', 1));
  assert.equal(validCount(1), true); assert.equal(validCount(12), true);
});
test('dates use Madrid civil date and reject invalid calendar dates', () => {
  assert.equal(todayInMadrid(new Date('2026-09-30T23:00:00Z')), '2026-10-01');
  assert.equal(validDate('2028-02-29', '2028-02-01'), true);
  assert.equal(validDate('2027-02-29', '2027-02-01'), false);
  assert.equal(validDate('2026-09-29', '2026-09-30'), false);
  assert.equal(validDate('not-a-date'), false);
});
test('checkout redirects require an explicitly authorized HTTPS origin', () => {
  const allowed = ['https://shop.example'];
  assert.equal(authorizedCheckout('https://shop.example/pay?q=1', allowed), true);
  for (const url of ['http://shop.example/pay', 'https://shop.example.evil/pay', 'javascript:alert(1)', 'https://name:secret@shop.example', '/checkout']) assert.equal(authorizedCheckout(url, allowed), false);
  assert.equal(authorizedCheckout('https://shop.example/pay', []), false);
});
test('adapter returns isolated product data', async () => {
  const first = await demoAdapter.getProduct(content.product.id);
  first.formats[0]!.label = 'Changed';
  assert.equal((await demoAdapter.getProduct(content.product.id)).formats[0]!.label, '1 botella');
});
