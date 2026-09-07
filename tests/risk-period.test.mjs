import test from 'node:test';
import assert from 'node:assert/strict';
import { periodOverlapsDay } from '../src/lib/risk-normalization.ts';

test('evening forecast ending tomorrow at midnight is valid today', () => {
  assert.equal(periodOverlapsDay('2026-09-07T18:00:00', '2026-09-08T00:00:00', '2026-09-07'), true);
});
test('midnight end is not valid on the following day', () => {
  assert.equal(periodOverlapsDay('2026-09-07T18:00:00', '2026-09-08T00:00:00', '2026-09-08'), false);
});
test('daytime, month and year boundaries', () => {
  for (const [start, end, day] of [
    ['2026-09-07T06:00:00', '2026-09-07T12:00:00', '2026-09-07'],
    ['2026-09-30T18:00:00', '2026-10-01T00:00:00', '2026-09-30'],
    ['2026-12-31T18:00:00', '2027-01-01T00:00:00', '2026-12-31'],
  ]) assert.equal(periodOverlapsDay(start, end, day), true);
});
test('missing, reversed, old and future periods are rejected', () => {
  for (const [start, end] of [
    [undefined, undefined], ['', 'bad'],
    ['2026-09-07T12:00:00', '2026-09-07T06:00:00'],
    ['2026-09-06T06:00:00', '2026-09-06T12:00:00'],
    ['2026-09-08T06:00:00', '2026-09-08T12:00:00'],
  ]) assert.equal(periodOverlapsDay(start, end, '2026-09-07'), false);
});
