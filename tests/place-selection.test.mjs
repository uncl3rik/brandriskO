import test from 'node:test';
import assert from 'node:assert/strict';
import { selectPlaces, placeKind } from '../src/lib/place-selection.ts';

const city = { name: 'Uppsala', addresstype: 'city' };
const municipality = { name: 'Uppsala kommun', addresstype: 'city', type: 'administrative' };
test('a city is preferred to its municipality regardless of upstream order', () => {
  assert.deepEqual(selectPlaces([municipality, city], 'Uppsala'), [city]);
});
test('explicit municipality searches retain municipality', () => {
  assert.deepEqual(selectPlaces([city, municipality], 'Uppsala kommun'), [municipality]);
  assert.deepEqual(selectPlaces([city], 'Uppsala kommun'), []);
  assert.equal(placeKind(municipality), 'municipality');
});
test('same-name villages remain ambiguous even in the same municipality', () => {
  const villages = [{ name: 'Björkby', type: 'village', lat: '59' }, { name: 'Björkby', type: 'village', lat: '60' }];
  assert.deepEqual(selectPlaces(villages, ' björkby '), villages);
});
test('exact town match takes precedence over partial matches', () => {
  assert.deepEqual(selectPlaces([city, { name: 'Gamla Uppsala', type: 'village' }], 'UPPSALA'), [city]);
});
test('postcode and unknown-type searches keep available results', () => {
  const postcode = { name: '753 10', addresstype: 'postcode' };
  assert.deepEqual(selectPlaces([postcode], '753 10'), [postcode]);
  assert.deepEqual(selectPlaces([], 'Okänd ort'), []);
});
