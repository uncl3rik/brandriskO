import test from 'node:test';
import assert from 'node:assert/strict';
import { windDirectionLabel } from '../src/lib/wind.ts';

test('wind directions describe the origin, including north wraparound', () => {
  assert.equal(windDirectionLabel(0), 'Från norr');
  assert.equal(windDirectionLabel(360), 'Från norr');
  assert.equal(windDirectionLabel(90), 'Från öst');
  assert.equal(windDirectionLabel(225), 'Från sydväst');
  assert.equal(windDirectionLabel(359), 'Från norr');
  assert.equal(windDirectionLabel(null), 'Riktning saknas');
  assert.equal(windDirectionLabel(9999), 'Riktning saknas');
});
