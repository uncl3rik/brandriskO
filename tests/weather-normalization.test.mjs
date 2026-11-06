import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeWeather, weatherDate } from '../src/lib/weather-normalization.ts';

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

test('precipitation needs a valid interval and missing values stay missing', () => {
  const reading = { ...step('2026-09-20T13:00:00Z', { air_temperature: 12, precipitation_amount_mean: 0, cloud_area_fraction: 4 }), intervalParametersStartTime: '2026-09-20T12:00:00Z' };
  const result = normalizeWeather(forecast([reading]), now);
  assert.equal(result.precipitation, 0);
  assert.equal(result.cloudCover, 4);
  assert.equal(normalizeWeather(forecast([{ ...reading, intervalParametersStartTime: undefined }]), now).precipitation, null);
  assert.equal(normalizeWeather(forecast([{ ...reading, intervalParametersStartTime: reading.time }]), now).precipitation, null);
  const missing = normalizeWeather(forecast([{ ...reading, data: { air_temperature: 12, precipitation_amount_mean: 9999, cloud_area_fraction: 9999 } }]), now);
  assert.equal(missing.precipitation, null);
  assert.equal(missing.cloudCover, null);
});

test('daily moments use Swedish dates and nearest upcoming local noon, not daily extremes', () => {
  const result = normalizeWeather(forecast([
    step('2026-09-20T13:00:00Z'),
    step('2026-09-20T22:00:00Z'),
    step('2026-09-21T10:00:00Z', { air_temperature: 14 }),
    step('2026-09-21T13:00:00Z', { air_temperature: 20 }),
  ]), now);
  assert.equal(result.days.length, 2);
  assert.equal(result.days[1].validAt, '2026-09-21T10:00:00Z');
  assert.equal(result.days[1].temperature, 14);
  assert.equal(weatherDate('2026-09-20T22:00:00Z'), '2026-09-21');
  assert.equal(weatherDate('2026-12-20T23:00:00Z'), '2026-12-21');
});

test('daily moments stay ordered and limited to five days', () => {
  const readings = Array.from({ length: 8 }, (_, i) => step(`2026-09-${20 + i}T13:00:00Z`)).reverse();
  const result = normalizeWeather(forecast(readings), now);
  assert.deepEqual(result.days.map(day => weatherDate(day.validAt)), ['2026-09-20', '2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24']);
});

test('wind direction and gust preserve zero and reject sentinel values', () => {
  const valid = normalizeWeather(forecast([step('2026-09-20T13:00:00Z', { wind_speed: 0, wind_from_direction: 0, wind_speed_of_gust: 0 })]), now);
  assert.equal(valid.windDirection, 0);
  assert.equal(valid.gust, 0);
  const missing = normalizeWeather(forecast([step('2026-09-20T13:00:00Z', { wind_speed: 5, wind_from_direction: 9999, wind_speed_of_gust: -1 })]), now);
  assert.equal(missing.windDirection, null);
  assert.equal(missing.gust, null);
  assert.equal(missing.days[0].windDirection, null);
});
