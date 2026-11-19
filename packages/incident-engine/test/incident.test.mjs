import assert from 'node:assert/strict';
import test from 'node:test';
import { episodeKey, deliveryKey, nextIncidentStatus } from '../src/index.ts';

test('episode identity is canonical across timezone formats and stable on retry', () => {
  const a = episodeKey('demo', 'ab321', '2026-11-19T11:00:00Z');
  const b = episodeKey('demo', 'ab321', '2026-11-19T16:30:00+05:30');
  assert.equal(a, b);
  assert.notEqual(a, episodeKey('demo', 'ab321', '2026-11-19T11:05:00Z'));
  assert.notEqual(a, episodeKey('production', 'ab321', '2026-11-19T11:00:00Z'));
});

test('delivery identity changes for status but not for a repeated webhook', () => {
  const key = episodeKey('demo', 'ab321', '2026-11-19T11:00:00Z');
  assert.equal(deliveryKey(key, 'firing'), deliveryKey(key, 'firing'));
  assert.notEqual(deliveryKey(key, 'firing'), deliveryKey(key, 'resolved', '2026-11-19T11:10:00Z'));
});

test('late firing retries cannot reopen a resolved incident', () => {
  assert.equal(nextIncidentStatus('resolved', 'firing'), 'resolved');
  assert.equal(nextIncidentStatus('firing', 'resolved'), 'resolved');
  assert.equal(nextIncidentStatus('firing', 'firing'), 'firing');
});

test('reject invalid fingerprints and timestamps', () => {
  assert.throws(() => episodeKey('demo', '../../etc', '2026-11-19T11:00:00Z'));
  assert.throws(() => episodeKey('demo', 'abc', 'not-a-date'));
});
