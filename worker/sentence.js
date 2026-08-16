// worker/sentence.js
//
// keywords -> one German sentence.
// Templates first (instant, free, deterministic), the model as the fallback.

import { chat, resolveProvider } from './llm.js';
import { SYSTEM_PROMPT, exampleMessages } from './prompt.js';
import { renderTemplate } from './templates.js';

const KNOWN_TYPES = new Set([
  'bodypart', 'action', 'symptom', 'topic', 'question',
  'direction', 'speed', 'number', 'operator', 'mood', 'phrase', 'custom',
]);

/**
 * Accepts either the typed token list the current frontend sends, or a plain
 * list of strings (older clients, curl, anything else). Plain strings are
 * tagged "custom" so the model still gets valid input.
 */
export function normalizeTokens(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => {
      if (typeof item === 'string') return { type: 'custom', value: item.trim() };
      if (item && typeof item.value === 'string') {
        const type = KNOWN_TYPES.has(item.type) ? item.type : 'custom';
        return { type, value: item.value.trim() };
      }
      return null;
    })
    .filter((token) => token && token.value.length > 0)
    .slice(0, 40);
}

/** Stable cache key: same buttons in the same order -> same key. */
export function tokensKey(tokens) {
  return tokens.map((t) => `${t.type}:${t.value}`).join('|');
}

export async function generateSentence(tokens, env, { signal } = {}) {
  const templated = renderTemplate(tokens);
  if (templated) return { sentence: templated, alternatives: [], source: 'template' };

  const provider = resolveProvider(env);
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...exampleMessages(),
    { role: 'user', content: JSON.stringify(tokens) },
  ];

  const raw = await chat(provider, messages, { signal });
  const parsed = parseReply(raw);
  if (!parsed.sentence) throw new Error('The model returned an empty sentence.');
  return { ...parsed, source: `llm:${provider.name}/${provider.model}` };
}

/**
 * The models are asked for JSON but do not always comply, so fall back to
 * treating the whole reply as the sentence rather than failing the request.
 */
function parseReply(raw) {
  const text = (raw || '').trim();
  if (!text) return { sentence: '', alternatives: [] };

  const json = text.startsWith('{') ? text : text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  if (json.startsWith('{')) {
    try {
      const data = JSON.parse(json);
      if (typeof data.sentence === 'string' && data.sentence.trim()) {
        return {
          sentence: oneSentence(data.sentence),
          alternatives: (Array.isArray(data.alternatives) ? data.alternatives : [])
            .filter((s) => typeof s === 'string' && s.trim())
            .map(oneSentence)
            .slice(0, 3),
        };
      }
    } catch {
      // fall through to the plain-text path
    }
  }
  return { sentence: oneSentence(text), alternatives: [] };
}

/** Guards rule 1 of the prompt: exactly one sentence, no quotes, no preamble. */
function oneSentence(text) {
  let out = text.trim().replace(/^["'«»]+|["'«»]+$/g, '');
  const firstLine = out.split('\n').find((line) => line.trim());
  if (firstLine) out = firstLine.trim();
  return out.slice(0, 300);
}
