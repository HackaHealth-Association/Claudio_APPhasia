// worker/index.js
//
// The whole backend: three endpoints, no server to keep warm, no disk.
//
//   GET  /api/health    liveness + which providers are configured
//   POST /api/sentence  typed keywords -> one German sentence (+ alternatives)
//   POST /api/speak     a sentence -> audio bytes, streamed back inline
//
// Everything else is served from the built frontend, so the app is a single
// origin and a single deploy.

import { generateSentence, normalizeTokens, tokensKey } from './sentence.js';
import { synthesize, ttsSettings } from './tts.js';

// Upstreams get a hard deadline: a hung API must never hang the app.
const SENTENCE_TIMEOUT_MS = 12_000;
const TTS_TIMEOUT_MS = 15_000;

// Burst protection. Held in isolate memory, so it is a speed bump against a
// runaway loop rather than a real quota — see README for the durable option.
const RATE_LIMIT = { windowMs: 60_000, maxRequests: 60 };
const recentRequests = new Map();

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (!url.pathname.startsWith('/api/')) {
      // Static asset or SPA route.
      if (env.ASSETS) return env.ASSETS.fetch(request);
      return new Response('Not found', { status: 404 });
    }

    const origin = request.headers.get('Origin');
    const cors = corsHeaders(origin, env);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (origin && !cors['Access-Control-Allow-Origin']) {
      return json({ error: 'Origin not allowed.' }, 403, {});
    }

    try {
      if (url.pathname === '/api/health') return handleHealth(env, cors);

      if (rateLimited(request)) {
        return json({ error: 'Zu viele Anfragen. Bitte kurz warten.' }, 429, cors);
      }
      if (url.pathname === '/api/sentence' && request.method === 'POST') {
        return await handleSentence(request, env, ctx, cors);
      }
      if (url.pathname === '/api/speak' && request.method === 'POST') {
        return await handleSpeak(request, env, ctx, cors);
      }
      return json({ error: 'Not found' }, 404, cors);
    } catch (error) {
      // The therapist gets a sentence they can act on; the technical detail
      // goes to the logs and to `detail` for whoever is debugging.
      console.error(error);
      return json({ error: friendly(error), detail: describe(error) }, 500, cors);
    }
  },
};

// --- endpoints -------------------------------------------------------------

function handleHealth(env, cors) {
  return json(
    {
      ok: true,
      provider: env.LLM_PROVIDER || 'groq_fast',
      tts: Boolean(ttsSettings(env).apiKey),
    },
    200,
    cors
  );
}

async function handleSentence(request, env, ctx, cors) {
  const body = await readJson(request);
  const tokens = normalizeTokens(body.tokens ?? body.keywords);
  if (!tokens.length) return json({ error: 'Keine Wörter ausgewählt.' }, 400, cors);

  const cacheKey = await cacheRequest('sentence', tokensKey(tokens));
  const cached = await cacheMatch(cacheKey);
  if (cached) return withCors(cached, cors);

  const result = await withTimeout(
    (signal) => generateSentence(tokens, env, { signal }),
    SENTENCE_TIMEOUT_MS,
    'Die Satzgenerierung hat zu lange gedauert.'
  );

  const response = json(result, 200, cors, { 'Cache-Control': 'public, max-age=86400' });
  ctx.waitUntil(cachePut(cacheKey, response.clone()));
  return response;
}

async function handleSpeak(request, env, ctx, cors) {
  const body = await readJson(request);
  let sentence = typeof body.sentence === 'string' ? body.sentence.trim() : '';

  // Convenience: /api/speak also accepts raw tokens, so a client that has not
  // pre-generated the sentence still works in one round trip.
  let generated = null;
  if (!sentence) {
    const tokens = normalizeTokens(body.tokens ?? body.keywords);
    if (!tokens.length) return json({ error: 'Kein Satz und keine Wörter übergeben.' }, 400, cors);
    generated = await withTimeout(
      (signal) => generateSentence(tokens, env, { signal }),
      SENTENCE_TIMEOUT_MS,
      'Die Satzgenerierung hat zu lange gedauert.'
    );
    sentence = generated.sentence;
  }
  if (sentence.length > 400) sentence = sentence.slice(0, 400);

  const settings = ttsSettings(env);
  const cacheKey = await cacheRequest(
    'speak',
    `${settings.model}|${settings.voice}|${settings.speed}|${sentence}`
  );
  const cached = await cacheMatch(cacheKey);
  if (cached) return withCors(cached, cors);

  const audio = await withTimeout(
    (signal) => synthesize(sentence, env, { signal }),
    TTS_TIMEOUT_MS,
    'Die Sprachausgabe hat zu lange gedauert.'
  );

  const response = new Response(audio.body, {
    status: 200,
    headers: {
      ...cors,
      'Content-Type': audio.contentType,
      'Cache-Control': 'public, max-age=86400',
      // The sentence rides along in a header so the client can display exactly
      // what is being spoken without a second request.
      'X-Sentence': encodeURIComponent(sentence),
      'Access-Control-Expose-Headers': 'X-Sentence',
    },
  });
  ctx.waitUntil(cachePut(cacheKey, response.clone()));
  return response;
}

// --- helpers ---------------------------------------------------------------

function corsHeaders(origin, env) {
  const base = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (!origin) return base; // same-origin request: no CORS needed

  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

  if (allowed.includes(origin) || allowed.includes('*') || isLocalhost) {
    return { ...base, 'Access-Control-Allow-Origin': origin };
  }
  return base;
}

function withCors(response, cors) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(cors)) headers.set(key, value);
  return new Response(response.body, { status: response.status, headers });
}

function json(payload, status, cors, extra = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', ...extra },
  });
}

async function readJson(request) {
  try {
    return (await request.json()) || {};
  } catch {
    return {};
  }
}

function rateLimited(request) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const now = Date.now();
  const hits = (recentRequests.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  hits.push(now);
  recentRequests.set(ip, hits);
  if (recentRequests.size > 5000) recentRequests.clear();
  return hits.length > RATE_LIMIT.maxRequests;
}

async function withTimeout(run, ms, message) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await run(controller.signal);
  } catch (error) {
    if (controller.signal.aborted) throw new Error(message);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/** Builds a synthetic GET request to use as a Cache API key. */
async function cacheRequest(namespace, value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return new Request(`https://apphasia.internal/${namespace}/${hex}`);
}

async function cacheMatch(key) {
  try {
    return (await caches.default.match(key)) || null;
  } catch {
    return null;
  }
}

async function cachePut(key, response) {
  try {
    await caches.default.put(key, response);
  } catch {
    // Caching is an optimisation; never fail a request over it.
  }
}

function describe(error) {
  const message = error?.message || String(error);
  // Never leak an API key to the browser or the logs of whoever reads this.
  return message.replace(/(sk-|key-|gsk_)[A-Za-z0-9_-]+/g, '***');
}

/** A one-line German explanation a therapist can act on mid-session. */
function friendly(error) {
  const message = describe(error);
  if (/zu lange gedauert/.test(message)) return message;
  if (/is not set|not set —/.test(message)) return 'Der Server ist nicht vollständig konfiguriert.';
  if (/40[13]|Invalid API Key|invalid_api_key/i.test(message)) {
    return 'Der Server kann den Sprachdienst nicht erreichen (Zugangsdaten).';
  }
  if (/Voice not found|404/i.test(message)) {
    return 'Die eingestellte Stimme gibt es nicht mehr (CARTESIA_VOICE_ID prüfen).';
  }
  if (/429|rate limit/i.test(message)) return 'Der Sprachdienst ist gerade ausgelastet.';
  return 'Der Satz konnte nicht erzeugt werden.';
}
