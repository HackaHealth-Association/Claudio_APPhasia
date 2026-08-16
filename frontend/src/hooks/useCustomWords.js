import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { downscaleImage } from '../lib/image';

const STORAGE_KEY = 'customWords';

/** Words the therapist added themselves, kept in this browser. */
export function useCustomWords() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setWords(sanitize(JSON.parse(saved)));
    } catch {
      toast.error('Gespeicherte Wörter konnten nicht gelesen werden.');
    }
  }, []);

  const persist = useCallback((next) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setWords(next);
      return true;
    } catch {
      // Almost always the ~5 MB quota. Say so, and do not pretend it saved.
      toast.error('Der Speicher ist voll. Bitte ein paar Wörter löschen oder exportieren.');
      return false;
    }
  }, []);

  const add = useCallback(
    async (word, file) => {
      const name = word.trim();
      if (!name) return;
      if (words.some((item) => item.word === name)) {
        toast.error('Dieses Wort existiert bereits.');
        return;
      }

      let image = null;
      if (file) {
        try {
          image = await downscaleImage(file);
        } catch (error) {
          toast.error(error.message);
          return;
        }
      }

      if (persist([...words, { word: name, image }])) {
        toast.success(`"${name}" hinzugefügt.`);
      }
    },
    [words, persist]
  );

  const remove = useCallback(
    (word) => {
      const removed = words.find((item) => item.word === word);
      if (!removed) return;
      if (persist(words.filter((item) => item.word !== word))) {
        toast(`"${word}" gelöscht.`, {
          action: {
            label: 'Rückgängig',
            onClick: () => persist([...words]),
          },
        });
      }
    },
    [words, persist]
  );

  const exportWords = useCallback(() => {
    if (!words.length) {
      toast.error('Keine Wörter zum Exportieren vorhanden.');
      return;
    }
    const blob = new Blob([JSON.stringify(words, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'claudio_words.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Wörter exportiert.');
  }, [words]);

  const importWords = useCallback(
    (file) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (!Array.isArray(parsed)) throw new Error('Die Datei enthält keine Wortliste.');
          const imported = sanitize(parsed);
          if (!imported.length) throw new Error('Die Datei enthält keine gültigen Wörter.');
          if (persist(imported)) {
            toast.success(`${imported.length} Wörter importiert.`);
          }
        } catch (error) {
          toast.error(`Import fehlgeschlagen: ${error.message}`);
        }
      };
      reader.onerror = () => toast.error('Die Datei konnte nicht gelesen werden.');
      reader.readAsText(file);
    },
    [persist]
  );

  return { words, add, remove, exportWords, importWords };
}

/**
 * Accepts every list this app has ever exported. Images have always been
 * optional, so an entry without one is valid — the old importer rejected the
 * app's own export files over exactly that.
 */
function sanitize(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((item) => item && typeof item.word === 'string' && item.word.trim())
    .map((item) => ({
      word: item.word.trim(),
      image: typeof item.image === 'string' && item.image ? item.image : null,
    }));
}
