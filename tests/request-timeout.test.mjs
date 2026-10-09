import test from 'node:test';
import assert from 'node:assert/strict';
import { requestTimeout } from '../src/lib/request-timeout.ts';

test('a stalled request is aborted at its deadline', async () => {
  const timeout = requestTimeout(10);
  await new Promise(resolve => timeout.signal.addEventListener('abort', resolve, { once: true }));
  assert.equal(timeout.signal.aborted, true);
  timeout.dispose();
});

test('cleanup aborts immediately and is safe to repeat', () => {
  const timeout = requestTimeout(60000);
  let events = 0;
  timeout.signal.addEventListener('abort', () => events++);
  timeout.dispose();
  timeout.dispose();
  assert.equal(timeout.signal.aborted, true);
  assert.equal(events, 1);
});
