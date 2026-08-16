import { strict as assert } from 'node:assert';
import test from 'node:test';
import { corsHeaders } from '../index.js';

const url = new URL('https://claudio-apphasia.workers.dev/api/sentence');
const allow = (origin, env = {}) => corsHeaders(origin, env, url)['Access-Control-Allow-Origin'];

// The app calling its own API. A same-origin POST still sends Origin, so this
// has to be allowed explicitly — rejecting it broke the deployed app.
test('the app may call the API it is served from', () => {
  assert.equal(allow('https://claudio-apphasia.workers.dev'), 'https://claudio-apphasia.workers.dev');
});

test('a request with no Origin header is left alone', () => {
  assert.equal(allow(null), undefined);
});

test('the dev server is allowed', () => {
  assert.equal(allow('http://localhost:5173'), 'http://localhost:5173');
});

test('a configured origin is allowed', () => {
  const env = { ALLOWED_ORIGINS: 'https://claudio.example, https://other.example' };
  assert.equal(allow('https://other.example', env), 'https://other.example');
});

test('an unknown origin gets no allow header', () => {
  assert.equal(allow('https://evil.example'), undefined);
});

test('a lookalike origin is not allowed', () => {
  assert.equal(allow('https://claudio-apphasia.workers.dev.evil.example'), undefined);
});
