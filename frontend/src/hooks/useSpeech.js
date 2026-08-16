import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchSpeech } from '../api/client';

/**
 * Plays a sentence, with the browser's own voice as a safety net.
 *
 * A therapy session cannot stall because a server is slow: if the good voice
 * is unavailable, the browser speaks the sentence instead. Worse audio, but
 * the conversation continues.
 */
export function useSpeech() {
  const [status, setStatus] = useState('idle'); // idle | loading | playing
  const audioRef = useRef(null);
  const cacheRef = useRef(new Map()); // sentence -> object URL
  const abortRef = useRef(null);

  // Created on first use rather than during render: one <audio> element for
  // the whole session, so a new sentence replaces the old one instead of
  // layering over it.
  const getAudio = useCallback(() => {
    if (audioRef.current == null && typeof Audio !== 'undefined') {
      audioRef.current = new Audio();
    }
    return audioRef.current;
  }, []);

  useEffect(() => {
    const audio = getAudio();
    if (!audio) return undefined;
    const done = () => setStatus('idle');
    audio.addEventListener('ended', done);
    audio.addEventListener('error', done);
    return () => {
      audio.removeEventListener('ended', done);
      audio.removeEventListener('error', done);
    };
  }, [getAudio]);

  useEffect(() => {
    const cache = cacheRef.current;
    return () => {
      for (const url of cache.values()) URL.revokeObjectURL(url);
    };
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    const audio = getAudio();
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    setStatus('idle');
  }, [getAudio]);

  const getAudioUrl = useCallback(async (sentence, signal) => {
    const cached = cacheRef.current.get(sentence);
    if (cached) return cached;
    const url = await fetchSpeech(sentence, { signal });
    cacheRef.current.set(sentence, url);
    return url;
  }, []);

  /** Warms the audio for a sentence the user is likely to play next. */
  const prefetch = useCallback(
    (sentence) => {
      if (!sentence || cacheRef.current.has(sentence)) return;
      getAudioUrl(sentence).catch(() => {
        // A failed prefetch is not an error the user needs to see; speaking
        // will retry and fall back if it fails again.
      });
    },
    [getAudioUrl]
  );

  const speak = useCallback(
    async (sentence) => {
      if (!sentence) return;
      stop();
      setStatus('loading');

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const url = await getAudioUrl(sentence, controller.signal);
        if (controller.signal.aborted) return;
        const audio = getAudio();
        audio.src = url;
        await audio.play();
        setStatus('playing');
      } catch (error) {
        if (controller.signal.aborted) return;
        const spoken = speakWithBrowser(sentence, () => setStatus('idle'));
        setStatus(spoken ? 'playing' : 'idle');
        if (!spoken) throw error;
      }
    },
    [getAudio, getAudioUrl, stop]
  );

  return { status, speak, stop, prefetch };
}

function speakWithBrowser(sentence, onDone) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  const utterance = new SpeechSynthesisUtterance(sentence);
  utterance.lang = 'de-DE';
  utterance.rate = 0.85;
  utterance.onend = onDone;
  utterance.onerror = onDone;
  window.speechSynthesis.speak(utterance);
  return true;
}
