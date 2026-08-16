// worker/tts.js
//
// Cartesia text-to-speech. Returns audio bytes; the caller streams them
// straight to the browser instead of writing a file to disk.

const CARTESIA_URL = 'https://api.cartesia.ai/tts/bytes';
const CARTESIA_VERSION = '2026-08-14';

// Claudio's own voice, cloned from a 31-second recording. It is private to
// this Cartesia account, which also means it cannot be withdrawn from under us
// the way the previous one was: the old id
// (5ee0fed4-93b3-41df-bae2-d4345a88775b) was a public-library voice that
// Cartesia removed, and it started returning 404 mid-session.
//
// Fallback if the clone is ever unavailable: 40e0f496-a220-46bb-975a-7ef465b3d92b
// ("Vreni", Swiss-German, feminine) — the only other de-CH voice available.
const DEFAULT_VOICE = 'f4790968-50f6-451f-be13-f1fa2d47ac47';
const DEFAULT_MODEL = 'sonic-3';

// Slightly slowed down: easier to follow for someone with aphasia, and for a
// patient hearing an instruction for the first time.
const DEFAULT_SPEED = 0.8;

export function ttsSettings(env) {
  return {
    apiKey: env.CARTESIA_API_KEY,
    voice: env.CARTESIA_VOICE_ID || DEFAULT_VOICE,
    model: env.CARTESIA_MODEL || DEFAULT_MODEL,
    speed: Number(env.CARTESIA_SPEED ?? DEFAULT_SPEED),
  };
}

/**
 * @returns {Promise<{body: ReadableStream, contentType: string}>}
 */
export async function synthesize(sentence, env, { signal } = {}) {
  const settings = ttsSettings(env);
  if (!settings.apiKey) throw new Error('CARTESIA_API_KEY is not set.');

  const response = await fetch(CARTESIA_URL, {
    method: 'POST',
    signal,
    headers: {
      'content-type': 'application/json',
      'cartesia-version': CARTESIA_VERSION,
      authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model_id: settings.model,
      transcript: sentence,
      voice: { id: settings.voice },
      language: 'de',
      // mp3 rather than raw wav: roughly a tenth of the bytes over clinic wifi,
      // and every browser plays it.
      output_format: { container: 'mp3', bit_rate: 128000, sample_rate: 44100 },
      generation_config: { speed: settings.speed },
    }),
  });

  if (!response.ok) {
    let detail = '';
    try {
      detail = (await response.text()).slice(0, 300);
    } catch {
      detail = '<no body>';
    }
    throw new Error(`Cartesia returned ${response.status}: ${detail}`);
  }

  return { body: response.body, contentType: 'audio/mpeg' };
}
