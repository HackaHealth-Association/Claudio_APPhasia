// src/api/client.js
//
// The single place that talks to the backend.
//
// In production the API is served from the same origin as this page, so the
// base URL is empty. VITE_API_URL only exists for pointing a local frontend at
// a deployed backend.

const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const SENTENCE_TIMEOUT_MS = 15_000;
const SPEECH_TIMEOUT_MS = 20_000;

export class ApiError extends Error {}

async function request(path, { timeoutMs, signal, ...options }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);

  try {
    const response = await fetch(`${BASE_URL}${path}`, { ...options, signal: controller.signal });
    if (!response.ok) {
      let message = `Der Server hat mit Fehler ${response.status} geantwortet.`;
      try {
        const body = await response.json();
        if (body?.error) message = body.error;
      } catch {
        // keep the generic message
      }
      throw new ApiError(message);
    }
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      if (signal?.aborted) throw error; // caller cancelled on purpose
      throw new ApiError('Der Server antwortet nicht.');
    }
    if (error instanceof ApiError) throw error;
    throw new ApiError('Keine Verbindung zum Server.');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}

/**
 * Fired once when the app loads so the first real request never pays a
 * cold start. Failures are deliberately ignored.
 */
export function warmUp() {
  return request('/api/health', { method: 'GET', timeoutMs: 5000 })
    .then((response) => response.json())
    .catch(() => null);
}

/** Typed keywords -> { sentence, alternatives, source }. */
export async function fetchSentence(tokens, { signal } = {}) {
  const response = await request('/api/sentence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokens }),
    timeoutMs: SENTENCE_TIMEOUT_MS,
    signal,
  });
  return response.json();
}

/** A sentence -> a playable object URL. Caller revokes it when done. */
export async function fetchSpeech(sentence, { signal } = {}) {
  const response = await request('/api/speak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sentence }),
    timeoutMs: SPEECH_TIMEOUT_MS,
    signal,
  });
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
