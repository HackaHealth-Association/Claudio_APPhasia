import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchSentence } from '../api/client';
import { toApiTokens, tokensKey } from '../lib/tokens';

const DEBOUNCE_MS = 400;

/**
 * What to say when the backend cannot be reached: the words themselves, read
 * out by the browser. Not a sentence, but the session keeps going.
 */
function fallbackSentence(tokens) {
  return tokens
    .map((token) => (token.type === 'phrase' ? token.value : token.label))
    .join(' ')
    .trim();
}

/**
 * Keeps a ready-to-speak sentence in sync with the tokens on screen.
 *
 * The old flow started everything on the speaker tap, so the therapist waited
 * with nothing on screen. Here the sentence is generated in the background
 * while they are still choosing words, shown to them before it is spoken, and
 * cached per exact keyword sequence — so tapping the speaker is instant and a
 * wrong sentence can be corrected silently instead of out loud.
 */
export function useSentence(tokens) {
  const [sentence, setSentence] = useState('');
  const [alternatives, setAlternatives] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [error, setError] = useState(null);

  const cacheRef = useRef(new Map());
  const abortRef = useRef(null);
  const key = tokensKey(tokens);

  useEffect(() => {
    abortRef.current?.abort();

    if (!tokens.length) {
      setSentence('');
      setAlternatives([]);
      setStatus('idle');
      setError(null);
      return undefined;
    }

    const cached = cacheRef.current.get(key);
    if (cached) {
      setSentence(cached.sentence);
      setAlternatives(cached.alternatives || []);
      setStatus('ready');
      setError(null);
      return undefined;
    }

    setStatus('loading');
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const result = await fetchSentence(toApiTokens(tokens), { signal: controller.signal });
        if (controller.signal.aborted) return;
        cacheRef.current.set(key, result);
        setSentence(result.sentence);
        setAlternatives(result.alternatives || []);
        setStatus('ready');
      } catch (caught) {
        if (controller.signal.aborted) return;
        // Keep something speakable on screen so the speaker button still works.
        setSentence(fallbackSentence(tokens));
        setAlternatives([]);
        setError(caught.message);
        setStatus('error');
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // `key` is the real dependency — it changes exactly when the phrase does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  /** Cycles to the next alternative reading of the same keywords. */
  const useAlternative = useCallback(() => {
    if (!alternatives.length) return;
    const [next, ...rest] = alternatives;
    const updated = { sentence: next, alternatives: [...rest, sentence] };
    cacheRef.current.set(key, updated);
    setSentence(updated.sentence);
    setAlternatives(updated.alternatives);
  }, [alternatives, sentence, key]);

  return { sentence, alternatives, status, error, useAlternative };
}
