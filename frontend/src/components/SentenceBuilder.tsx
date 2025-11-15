import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SentenceBuilderProps {
  words: string[];
  onClear: () => void;
  onSpeak: () => void;
}

export const SentenceBuilder = ({
  words,
  onClear,
  onSpeak,
}: SentenceBuilderProps) => {
  // const handleSpeak = () => {
  //   if (words.length === 0) {
  //     toast.error("Bitte wählen Sie Wörter aus");
  //     return;
  //   }
  //
  //   const sentence = words.join(" ");
  //
  //   if ("speechSynthesis" in window) {
  //     const utterance = new SpeechSynthesisUtterance(sentence);
  //     utterance.lang = "de-DE";
  //     utterance.rate = 0.9;
  //     utterance.pitch = 1;
  //     speechSynthesis.speak(utterance);
  //     onSpeak();
  //     toast.success("Satz wird vorgelesen");
  //   } else {
  //     toast.error("Sprachausgabe nicht verfügbar");
  //   }
  // };

  const handleSpeak = () => {
    if (words.length === 0) {
      toast.error("Bitte wählen Sie Wörter aus");
      return;
    }

    // 1. Show the loading toast that was previously in Index.tsx
    // This gives immediate feedback while the network request starts.
    toast.info("Generiere Satz...");

    // 2. IMPORTANT: Call the 'onSpeak' prop
    // This prop is linked to your backend logic (the handleSpeak function in Index.tsx).
    onSpeak();
  };

  const handleRepeat = () => {
    handleSpeak();
  };

  return (
    <Card className="p-6 bg-card">
      <h2 className="text-xl font-bold mb-4 text-foreground">
        Aufgebauter Satz
      </h2>
      
      <div className="min-h-[120px] mb-4 p-4 bg-secondary rounded-lg border-2 border-border">
        {words.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {words.map((word, index) => (
              <span
                key={index}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-full text-lg font-medium"
              >
                {word}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center text-lg">
            Wählen Sie Wörter aus, um einen Satz zu bilden
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSpeak}
          disabled={words.length === 0}
          className="flex-1 text-lg py-6 bg-primary hover:bg-primary/90"
          size="lg"
        >
          <Volume2 className="mr-2 h-6 w-6" />
          Satz sprechen
        </Button>
        
        <Button
          onClick={handleRepeat}
          disabled={words.length === 0}
          variant="outline"
          className="text-lg py-6"
          size="lg"
        >
          <RotateCcw className="h-6 w-6" />
        </Button>

        <Button
          onClick={onClear}
          disabled={words.length === 0}
          variant="destructive"
          className="text-lg py-6"
          size="lg"
        >
          <Trash2 className="h-6 w-6" />
        </Button>
      </div>
    </Card>
  );
};
