import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs";
import ThreePanelLayout from "../Components/layout/ThreePanelLayout";
import AnatomyViewer from "../Components/therapy/AnatomyViewer";
import ActionButtons from "../Components/therapy/ActionButtons";
import ControlsPanel from "../Components/therapy/ControlsPanel";
import CustomWordsPanel from "../Components/therapy/CustomWordsPanel";
import QuestionInterface from "../Components/therapy/QuestionInterface";
import TextDisplay from "../Components/therapy/TextDisplay";

import { warmUp } from "../api/client";
import { useCustomWords } from "../hooks/useCustomWords";
import { useSentence } from "../hooks/useSentence";
import { useSpeech } from "../hooks/useSpeech";
import { appendToken, createToken } from "../lib/tokens";

/**
 * TherapyAssistant — the whole app.
 *
 * Flow: every tap appends a typed token (body part / action / direction / …).
 * A sentence is generated in the background as the tokens change and shown in
 * the phrase bar, so the therapist reads it before the patient hears it. The
 * speaker button then only has to play audio that is usually already fetched.
 */
export default function TherapyAssistant() {
  const [tokens, setTokens] = useState([]);
  const [currentView, setCurrentView] = useState("front");
  const [selectedAction, setSelectedAction] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);

  const customWords = useCustomWords();
  const { sentence, alternatives, status: sentenceStatus, error: sentenceError, useAlternative } =
    useSentence(tokens);
  const { status: speechStatus, speak, stop, prefetch } = useSpeech();

  // Wake the backend on load so the first spoken sentence never pays for it.
  useEffect(() => {
    warmUp();
  }, []);

  // Fetch the audio as soon as the sentence settles — by the time the speaker
  // button is tapped, playback is instant.
  useEffect(() => {
    if (sentenceStatus === "ready" && sentence) prefetch(sentence);
  }, [sentence, sentenceStatus, prefetch]);

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

  const undoLast = useCallback(() => setTokens((current) => current.slice(0, -1)), []);

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
    try {
      await speak(sentence);
    } catch (error) {
      toast.error(error.message || "Der Satz konnte nicht vorgelesen werden.");
    }
  }, [tokens.length, sentence, speak]);

  return (
    <div className="h-screen w-screen bg-gray-100 p-2 overflow-hidden flex flex-col">
      <div className="w-full max-w-full mx-auto h-full flex flex-col space-y-4">
        <div className="flex-none">
          <TextDisplay
            tokens={tokens}
            onRemoveToken={removeToken}
            onBack={undoLast}
            onClearAll={clearAll}
            sentence={sentence}
            sentenceStatus={sentenceStatus}
            sentenceError={sentenceError}
            hasAlternatives={alternatives.length > 0}
            onUseAlternative={useAlternative}
            speechStatus={speechStatus}
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
                middle={
                  <ActionButtons selectedAction={selectedAction} onSelect={handleSelect} />
                }
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
