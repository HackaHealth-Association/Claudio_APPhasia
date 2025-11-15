import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, RotateCcw, Loader2 } from "lucide-react";

export default function PhraseBuilder({ selectedWords, onClear }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.75;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = 'de-DE';
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Auto-speak when phrase changes
  useEffect(() => {
    if (selectedWords.length > 0) {
      const phrase = selectedWords.join(' ');
      speak(phrase);
    }
  }, [selectedWords.join(' ')]);

  const phrase = selectedWords.join(' ') || 'Keine Auswahl';
  const hasWords = selectedWords.length > 0;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Ausgewählte Wörter</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-sm px-3 py-1">
              {selectedWords.length} {selectedWords.length === 1 ? 'Wort' : 'Wörter'}
            </Badge>
          </div>
        </div>

        {/* Words Display */}
        <div className={`min-h-24 p-6 rounded-xl transition-all ${
          hasWords 
            ? 'bg-white shadow-lg border-2 border-purple-400' 
            : 'bg-white/50 border-2 border-dashed border-purple-200'
        }`}>
          {hasWords ? (
            <div className="flex flex-wrap gap-2">
              {selectedWords.map((word, index) => (
                <Badge 
                  key={index}
                  className="text-lg px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  {word}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-2xl text-gray-400 text-center">
              Wählen Sie Wörter aus den Steuerungen
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => speak(phrase)}
            disabled={!hasWords || isSpeaking}
            size="lg"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-lg h-14"
          >
            {isSpeaking ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Sprechen...
              </>
            ) : (
              <>
                <Volume2 className="w-6 h-6 mr-2" />
                Sprechen
              </>
            )}
          </Button>
          
          {hasWords && (
            <Button
              onClick={onClear}
              size="lg"
              variant="outline"
              className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 text-lg h-14"
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              Löschen
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Anleitung:</span> Klicken Sie auf Körperteile, Verben, 
            Zahlen oder Richtungen. Die Wörter werden automatisch gesprochen.
          </p>
        </div>
      </div>
    </Card>
  );
}