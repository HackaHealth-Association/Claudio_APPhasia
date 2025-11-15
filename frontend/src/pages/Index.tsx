import { useState } from "react";
import { AnatomyViewer } from "@/components/AnatomyViewer";
import { WordSelector } from "@/components/WordSelector";
import { SentenceBuilder } from "@/components/SentenceBuilder";
import { toast } from "sonner";

const Index = () => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const handleBodyPartSelect = (part: string) => {
    setSelectedWords((prev) => [...prev, part]);
    toast.success(`${part} ausgewählt`);
  };

  const handleVerbSelect = (verb: string) => {
    setSelectedWords((prev) => [...prev, verb]);
    toast.success(`${verb} ausgewählt`);
  };

  const handleNumberSelect = (number: string) => {
    setSelectedWords((prev) => [...prev, number]);
    toast.success(`${number} ausgewählt`);
  };

  const handleModifierSelect = (modifier: string) => {
    setSelectedWords((prev) => [...prev, modifier]);
    toast.success(`${modifier} ausgewählt`);
  };

  const handleClear = () => {
    setSelectedWords([]);
    toast.info("Satz gelöscht");
  };

  // const handleSpeak = () => {
  //   // Speech synthesis is handled in SentenceBuilder component
  // };

  const handleSpeak = async () => {
    // 1. Check if there are any words to send
    if (selectedWords.length === 0) {
      toast.error("Keine Wörter ausgewählt");
      return;
    }

    // 2. Show a loading message
    toast.info("Generiere Satz...");

    try {
      // 3. Call your backend API (using the full URL)
      const response = await fetch('https://claudio-apphasia-1.onrender.com/api/generate-sentence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywords: selectedWords }) // Send the words from state
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle any errors from the backend
        throw new Error(data.error || "Unbekannter Fehler");
      }

      // 4. Success! We got a response
      const sentence = data.sentence;
      const audioUrl = data.audio_url;

      // 5. Show the generated sentence and play the audio
      toast.success(`Spreche: "${sentence}"`);

      const audioPlayer = new Audio();
      // 6. Use the full backend URL + a timestamp to prevent caching
      audioPlayer.src = `https://claudio-apphasia-1.onrender.com/${audioUrl}?t=${new Date().getTime()}`;
      audioPlayer.play();

    } catch (error: any) {
      // 7. Handle any network or fetch errors
      console.error("Fehler beim Generieren des Satzes:", error);
      toast.error(error.message || "Senden fehlgeschlagen");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-[1800px] mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-foreground text-center">
            Therapie Kommunikations-Hilfe
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Wählen Sie Körperteile, Verben und weitere Wörter aus, um Sätze zu bilden
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Side - Anatomy Viewer */}
          <div className="h-[calc(100vh-180px)]">
            <AnatomyViewer onBodyPartSelect={handleBodyPartSelect} />
          </div>

          {/* Right Side - Word Selectors */}
          <div className="space-y-4 overflow-y-auto h-[calc(100vh-180px)]">
            <SentenceBuilder
              words={selectedWords}
              onClear={handleClear}
              onSpeak={handleSpeak}
            />
            <WordSelector
              onVerbSelect={handleVerbSelect}
              onNumberSelect={handleNumberSelect}
              onModifierSelect={handleModifierSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
