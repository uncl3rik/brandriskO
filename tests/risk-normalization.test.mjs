import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeLevel, normalizeProhibition, safeSourceUrl } from '../src/lib/risk-normalization.ts';

test('only documented range of integer risk levels is displayed', () => {
  for (const value of [undefined, null, -1, 0, 7, 1.5, '1', NaN]) assert.equal(normalizeLevel(value), null);
  for (let value = 1; value <= 6; value++) assert.equal(normalizeLevel(value), value);
});
test('absence requires exact observed code and text pair', () => {
  assert.equal(normalizeProhibition(' Inget eldningsförbud ', 2), 'none');
  for (const code of [undefined, 1, 3, 4, 5, '2']) assert.equal(normalizeProhibition('Inget eldningsförbud', code), 'unknown');
  for (const text of [undefined, '', 'Okänt eldningsförbud', 'Inget eldningsförbud?']) assert.equal(normalizeProhibition(text, 2), 'unknown');
});
test('explicit restrictions remain restrictions', () => {
  assert.equal(normalizeProhibition('Eldningsförbud', 3), 'prohibited');
  assert.equal(normalizeProhibition('Skärpt eldningsförbud', 4), 'severe');
});
test('source links only accept web protocols', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,test', '/relative', null]) assert.equal(safeSourceUrl(value), undefined);
  assert.equal(safeSourceUrl('https://example.org/beslut'), 'https://example.org/beslut');
});
