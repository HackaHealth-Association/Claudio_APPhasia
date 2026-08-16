// src/lib/tokens.js
//
// A token is one tap: { id, type, value, label }.
// `type` travels to the backend so the sentence builder knows what the word is.

let nextId = 0;

export function createToken({ type, value, label }) {
  nextId += 1;
  return {
    id: `t${nextId}`,
    type: type || 'custom',
    value: String(value),
    label: label ?? String(value),
  };
}

/**
 * Appends a token, merging consecutive single digits so tapping 1 then 8
 * produces "18" rather than "1" "8".
 */
export function appendToken(tokens, token) {
  const last = tokens[tokens.length - 1];
  const isDigit = token.type === 'number' && /^\d$/.test(token.value);
  const lastIsNumber = last && last.type === 'number' && /^\d+$/.test(last.value);

  if (isDigit && lastIsNumber) {
    const merged = { ...last, value: last.value + token.value };
    merged.label = merged.value;
    return [...tokens.slice(0, -1), merged];
  }
  return [...tokens, token];
}

/** Stable identity for a phrase — used to cache generated sentences. */
export function tokensKey(tokens) {
  return tokens.map((t) => `${t.type}:${t.value}`).join('|');
}

/** The shape the API expects: no ids, no labels. */
export function toApiTokens(tokens) {
  return tokens.map(({ type, value }) => ({ type, value }));
}
