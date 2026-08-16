import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs";
import ThreePanelLayout from "../Components/layout/ThreePanelLayout";
import AnatomyViewer from "../Components/therapy/AnatomyViewer";
import ActionButtons from "../Components/therapy/ActionButtons";
import ControlsPanel from "../Components/therapy/ControlsPanel";
import QuestionInterface from "../Components/therapy/QuestionInterface";
import TextDisplay from "../Components/therapy/TextDisplay";

import { fetchSentence, fetchSpeech, warmUp } from "../api/client";
import { appendToken, createToken } from "../lib/tokens";

/**
 * TherapyAssistant — the whole app.
 *
 * Every tap appends a typed token: the button knows whether it is a body
 * part, an action, a direction or a number, and that type travels to the
 * backend so it never has to guess.
 */

// Turns a picked file into a data URL for storage alongside the word.
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AddWordForm = ({ onSubmit }) => {
  const [word, setWord] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Kein Bild ausgewählt");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!word) {
      toast.error("Bitte ein Wort angeben.");
      return;
    }
    let image = null;
    if (file) {
      try {
        image = await fileToBase64(file);
      } catch {
        toast.error("Fehler beim Verarbeiten des Bildes.");
        return;
      }
    }
    onSubmit(word, image);
    setWord("");
    setFile(null);
    setFileName("Kein Bild ausgewählt");
    event.target.reset();
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
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Hinzufügen
      </button>
    </form>
  );
};

export default function TherapyAssistant() {
  const [tokens, setTokens] = useState([]);
  const [currentView, setCurrentView] = useState("front");
  const [selectedAction, setSelectedAction] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [customWords, setCustomWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    warmUp();
    const saved = localStorage.getItem("customWords");
    if (saved) {
      try {
        setCustomWords(JSON.parse(saved));
      } catch {
        toast.error("Gespeicherte Wörter konnten nicht gelesen werden.");
      }
    }
  }, []);

  const addToken = useCallback((entry) => {
    setTokens((current) => appendToken(current, createToken(entry)));
  }, []);

  const handleSelect = useCallback(
    (entry) => {
      if (entry.type === "action" || entry.type === "symptom") setSelectedAction(entry.value);
      addToken(entry);
    },
    [addToken]
  );

  const handleBodyPart = useCallback(
    (name) => addToken({ type: "bodypart", value: name }),
    [addToken]
  );

  // Committing the same value again is deliberate: it is how the same number
  // gets used more than once in a phrase.
  const handleSliderCommit = useCallback(
    (value) => {
      setSliderValue(value);
      addToken({ type: "number", value: String(value) });
    },
    [addToken]
  );

  const removeToken = useCallback((id) => {
    setTokens((current) => current.filter((token) => token.id !== id));
  }, []);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setIsSpeaking(false);
  }, []);

  const clearAll = useCallback(() => {
    setTokens([]);
    setSelectedAction(null);
    stop();
  }, [stop]);

  const handleSpeak = useCallback(async () => {
    if (!tokens.length) {
      toast.error("Keine Wörter ausgewählt.");
      return;
    }
    setIsLoading(true);
    try {
      const { sentence } = await fetchSentence(tokens.map(({ type, value }) => ({ type, value })));
      const url = await fetchSpeech(sentence);
      if (!audioRef.current) audioRef.current = new Audio();
      const audio = audioRef.current;
      audio.onended = () => setIsSpeaking(false);
      audio.src = url;
      await audio.play();
      setIsSpeaking(true);
      toast.success(`Spreche: "${sentence}"`);
    } catch (error) {
      toast.error(error.message || "Der Satz konnte nicht vorgelesen werden.");
    } finally {
      setIsLoading(false);
    }
  }, [tokens]);

  const updateCustomWords = (next) => {
    setCustomWords(next);
    localStorage.setItem("customWords", JSON.stringify(next));
  };

  const handleAddCustomWord = (word, image) => {
    if (customWords.some((item) => item.word === word)) {
      toast.error("Dieses Wort existiert bereits.");
      return;
    }
    updateCustomWords([...customWords, { word, image }]);
    toast.success(`"${word}" hinzugefügt.`);
  };

  const handleExportWords = () => {
    if (!customWords.length) {
      toast.error("Keine Wörter zum Exportieren vorhanden.");
      return;
    }
    const blob = new Blob([JSON.stringify(customWords, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "claudio_words.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Wörter exportiert.");
  };

  const handleImportWords = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loaded) => {
      try {
        const imported = JSON.parse(loaded.target.result);
        if (!Array.isArray(imported)) throw new Error("Die Datei enthält keine Wortliste.");
        if (imported.length && typeof imported[0].word !== "string") {
          throw new Error("Objekte in der Datei haben kein Feld 'word'.");
        }
        updateCustomWords(imported);
        toast.success(`${imported.length} Wörter importiert.`);
      } catch (error) {
        toast.error(`Import fehlgeschlagen: ${error.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-screen w-screen bg-gray-100 p-2 overflow-hidden flex flex-col">
      <div className="w-full max-w-full mx-auto h-full flex flex-col space-y-4">
        <div className="flex-none">
          <TextDisplay
            tokens={tokens}
            onRemoveToken={removeToken}
            onBack={() => setTokens((current) => current.slice(0, -1))}
            onClearAll={clearAll}
            isSpeaking={isSpeaking}
            isLoading={isLoading}
            onSpeak={handleSpeak}
            onStop={stop}
          />
        </div>

        <Tabs defaultValue="questions" className="w-full flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3 mb-4 flex-none">
            <TabsTrigger value="questions">Fragen</TabsTrigger>
            <TabsTrigger value="advanced">Erweitert</TabsTrigger>
            <TabsTrigger value="custom">Zusätzliche Wörter</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="flex-1 overflow-y-auto min-h-0">
            <QuestionInterface
              onSelect={handleSelect}
              onBodyPartSelect={handleBodyPart}
              sliderValue={sliderValue}
              onSliderChange={setSliderValue}
              onSliderCommit={handleSliderCommit}
            />
          </TabsContent>

          <TabsContent value="advanced" className="flex-1 min-h-0 mt-0 flex flex-col">
            <div className="flex-1 min-h-0">
              <ThreePanelLayout
                left={
                  <AnatomyViewer
                    currentView={currentView}
                    onViewChange={setCurrentView}
                    onBodyPartClick={handleBodyPart}
                  />
                }
                middle={<ActionButtons selectedAction={selectedAction} onSelect={handleSelect} />}
                right={
                  <ControlsPanel
                    sliderValue={sliderValue}
                    onSliderChange={setSliderValue}
                    onSliderCommit={handleSliderCommit}
                    onSelect={handleSelect}
                  />
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="custom" className="flex-1 min-h-0 mt-0 flex flex-col overflow-y-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 border rounded-lg">
              <AddWordForm onSubmit={handleAddCustomWord} />
              <div className="flex gap-2">
                <button
                  onClick={handleExportWords}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Wörter exportieren
                </button>
                <label className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer">
                  Wörter importieren
                  <input
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={handleImportWords}
                  />
                </label>
              </div>
            </div>

            <div className="border-t my-4" />

            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}
            >
              {customWords.length === 0 && (
                <p className="text-muted-foreground">Noch keine Wörter hinzugefügt.</p>
              )}
              {customWords.map((item) => (
                <div key={item.word} className="relative group">
                  <button
                    onClick={() => addToken({ type: "custom", value: item.word })}
                    className="w-full p-2 bg-white rounded-lg shadow border hover:shadow-md transition-all flex flex-col items-center gap-2"
                  >
                    {item.image ? (
                      <img src={item.image} alt="" aria-hidden="true" className="w-28 h-28 object-contain" />
                    ) : (
                      <div className="w-28 h-28 flex items-center justify-center bg-gray-100 rounded-md">
                        <span className="text-gray-400 text-sm">(Kein Bild)</span>
                      </div>
                    )}
                    <span className="font-medium text-center">{item.word}</span>
                  </button>
                  <button
                    onClick={() =>
                      updateCustomWords(customWords.filter((other) => other.word !== item.word))
                    }
                    title={`"${item.word}" löschen`}
                    aria-label={`"${item.word}" löschen`}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center
                      opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
