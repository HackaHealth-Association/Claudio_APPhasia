import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs";
import ThreePanelLayout from "../Components/layout/ThreePanelLayout";
import AnatomyViewer from "../Components/therapy/AnatomyViewer";
import ActionButtons from "../Components/therapy/ActionButtons";
import ControlsPanel from "../Components/therapy/ControlsPanel";
import CustomWordsPanel from "../Components/therapy/CustomWordsPanel";
import QuestionInterface from "../Components/therapy/QuestionInterface";
import TextDisplay from "../Components/therapy/TextDisplay";

import { fetchSpeech, warmUp } from "../api/client";
import { useCustomWords } from "../hooks/useCustomWords";
import { useSentence } from "../hooks/useSentence";
import { appendToken, createToken } from "../lib/tokens";

/**
 * TherapyAssistant — the whole app.
 *
 * Every tap appends a typed token: the button knows whether it is a body
 * part, an action, a direction or a number, and that type travels to the
 * backend so it never has to guess.
 */

export default function TherapyAssistant() {
  const [tokens, setTokens] = useState([]);
  const [currentView, setCurrentView] = useState("front");
  const [selectedAction, setSelectedAction] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);

  const customWords = useCustomWords();
  const { sentence, alternatives, status: sentenceStatus, error: sentenceError, useAlternative } =
    useSentence(tokens);

  // Wake the backend on load so the first spoken sentence never pays for it.
  useEffect(() => {
    warmUp();
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
    if (!sentence) {
      toast.info("Der Satz wird noch vorbereitet …");
      return;
    }
    setIsLoading(true);
    try {
      const url = await fetchSpeech(sentence);
      if (!audioRef.current) audioRef.current = new Audio();
      const audio = audioRef.current;
      audio.onended = () => setIsSpeaking(false);
      audio.src = url;
      await audio.play();
      setIsSpeaking(true);
    } catch (error) {
      toast.error(error.message || "Der Satz konnte nicht vorgelesen werden.");
    } finally {
      setIsLoading(false);
    }
  }, [tokens.length, sentence]);

  return (
    <div className="h-screen w-screen bg-gray-100 p-2 overflow-hidden flex flex-col">
      <div className="w-full max-w-full mx-auto h-full flex flex-col space-y-4">
        <div className="flex-none">
          <TextDisplay
            tokens={tokens}
            onRemoveToken={removeToken}
            onBack={() => setTokens((current) => current.slice(0, -1))}
            onClearAll={clearAll}
            sentence={sentence}
            sentenceStatus={sentenceStatus}
            sentenceError={sentenceError}
            hasAlternatives={alternatives.length > 0}
            onUseAlternative={useAlternative}
            speechStatus={isLoading ? "loading" : isSpeaking ? "playing" : "idle"}
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
            <CustomWordsPanel
              words={customWords.words}
              onAdd={customWords.add}
              onRemove={customWords.remove}
              onExport={customWords.exportWords}
              onImport={customWords.importWords}
              onSelect={handleSelect}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
