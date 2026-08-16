import { useState } from "react";
import { toast } from "sonner";

/** Adds a word (and optionally a picture) to the therapist's own vocabulary. */
export default function AddWordForm({ onSubmit }) {
  const [word, setWord] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Kein Bild ausgewählt");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setWord("");
    setFile(null);
    setFileName("Kein Bild ausgewählt");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!word.trim()) {
      toast.error("Bitte ein Wort angeben.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit(word, file);
      reset();
      event.target.reset();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
      <h3 className="text-lg font-semibold">Neues Wort:</h3>

      <input
        type="text"
        placeholder="Wort (z.B. 'tschutte')"
        value={word}
        onChange={(event) => setWord(event.target.value)}
        className="p-2 border rounded-md"
        aria-label="Neues Wort"
        required
      />

      <label className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer text-sm">
        Bild auswählen (optional)
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp, image/svg+xml"
          className="hidden"
          onChange={(event) => {
            const selected = event.target.files[0] ?? null;
            setFile(selected);
            setFileName(selected ? selected.name : "Kein Bild ausgewählt");
          }}
        />
      </label>

      <span className="text-gray-500 text-sm max-w-[150px] truncate" title={fileName}>
        {fileName}
      </span>

      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Wird gespeichert …" : "Hinzufügen"}
      </button>
    </form>
  );
}
