import test from 'node:test';
import assert from 'node:assert/strict';
import { coordinatedSearch, normalizedQuery, redisCommand } from '../src/lib/geocode-coordinator.ts';

test('postal codes with and without spaces share a cache key', () => {
  assert.equal(normalizedQuery(' 75320 '), normalizedQuery('753 20'));
  assert.equal(normalizedQuery(' UPPSALA '), 'uppsala');
});
test('separate instances share cache and global lock across queries', async () => {
  const data = new Map();
  let locked = false;
  const command = async ([op, key, value]) => {
    if (op === 'GET') return data.get(key) ?? null;
    if (op === 'SET' && key.includes(':lock:')) {
      if (locked) return null;
      locked = true; return 'OK';
    }
    if (op === 'SET') { data.set(key, value); return 'OK'; }
    if (op === 'EVAL') return 1; // cooldown still holds the lock
  };
  let finish;
  const pending = new Promise(resolve => { finish = resolve; });
  const first = coordinatedSearch(command, 'uppsala', () => pending);
  await new Promise(resolve => setImmediate(resolve));
  await assert.rejects(coordinatedSearch(command, 'norrtälje', () => assert.fail('must not call upstream')), { code: 'busy' });
  finish(['Uppsala']);
  assert.deepEqual(await first, ['Uppsala']);
  assert.deepEqual(await coordinatedSearch(command, 'uppsala', () => assert.fail('must use shared cache')), ['Uppsala']);
});
test('coordination outage never bypasses the quota', async () => {
  await assert.rejects(coordinatedSearch(async () => { throw new Error('offline'); }, 'test', () => assert.fail('must not call upstream')));
});
test('upstream failure is not cached and still applies cooldown', async () => {
  const calls = [];
  const command = async args => { calls.push(args); return args[0] === 'GET' ? null : 'OK'; };
  await assert.rejects(coordinatedSearch(command, 'test', async () => { throw new Error('upstream'); }));
  assert.equal(calls.filter(args => args[0] === 'SET').length, 1);
  assert.equal(calls.at(-1)[0], 'EVAL');
});
test('Redis credentials require encrypted transport', () => {
  assert.throws(() => redisCommand('http://example.org', 'test'), { code: 'configuration' });
});
