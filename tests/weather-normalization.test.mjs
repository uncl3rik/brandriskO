import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeWeather } from '../src/lib/weather-normalization.ts';

const now = Date.parse('2026-09-20T12:30:00Z');
const step = (time, data = { air_temperature: 0, relative_humidity: 50, wind_speed: 0 }) => ({ time, data });
const forecast = (steps) => ({ createdTime: '2026-09-20T12:00:00Z', geometry: { type: 'Point', coordinates: [18.077, 59.33] }, timeSeries: steps });

test('chooses earliest upcoming step, not expired or far future data', () => {
  const result = normalizeWeather(forecast([step('2026-09-20T15:00:00Z'), step('2026-09-20T12:00:00Z'), step('2026-09-20T13:00:00Z')]), now);
  assert.equal(result.validAt, '2026-09-20T13:00:00Z');
  assert.equal(result.temperature, 0);
  assert.equal(result.wind, 0);
  assert.equal(result.latitude, 59.33);
  assert.equal(normalizeWeather(forecast([step('2026-09-20T16:00:00Z')]), now), null);
});
test('missing sentinels and invalid values never become weather readings', () => {
  const result = normalizeWeather(forecast([step('2026-09-20T13:00:00Z', { air_temperature: -3, relative_humidity: 9999, wind_speed: -1 })]), now);
  assert.equal(result.temperature, -3);
  assert.equal(result.humidity, null);
  assert.equal(result.wind, null);
  assert.equal(normalizeWeather(forecast([step('2026-09-20T13:00:00Z', {})]), now), null);
});
test('rejects stale model runs, malformed geometry and timestamps without timezone', () => {
  const body = forecast([step('2026-09-20T13:00:00Z')]);
  assert.equal(normalizeWeather({ ...body, createdTime: '2026-09-19T12:00:00Z' }, now), null);
  assert.equal(normalizeWeather({ ...body, createdTime: '2026-09-21T12:00:00Z' }, now), null);
  assert.equal(normalizeWeather({ ...body, geometry: {} }, now), null);
  assert.equal(normalizeWeather(forecast([step('2026-09-20T13:00:00')]), now), null);
  for (const input of [null, {}, [], 'invalid']) assert.equal(normalizeWeather(input, now), null);
});
