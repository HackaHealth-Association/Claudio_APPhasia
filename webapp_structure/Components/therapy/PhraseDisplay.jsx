import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, RotateCcw } from "lucide-react";

export default function PhraseDisplay({ action, bodyPart, onClear }) {
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slower for better clarity
      utterance.pitch = 1;
      utterance.volume = 1;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Auto-speak when phrase is complete
  useEffect(() => {
    if (action && bodyPart) {
      const phrase = `${action} in the ${bodyPart.toLowerCase()}`;
      speak(phrase);
    } else if (bodyPart) {
      speak(bodyPart);
    }
  }, [action, bodyPart]);

  const getPhrase = () => {
    if (action && bodyPart) {
      return `${action} in the ${bodyPart.toLowerCase()}`;
    } else if (bodyPart) {
      return bodyPart;
    } else if (action) {
      return `${action} (select a body part)`;
    }
    return "Select an action and body part";
  };

  const phrase = getPhrase();
  const isComplete = action && bodyPart;

  return (
    <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Volume2 className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Current Phrase</h2>
        </div>
        
        <div className={`min-h-32 flex items-center justify-center px-6 py-8 rounded-2xl transition-all ${
          isComplete 
            ? 'bg-white shadow-xl border-4 border-purple-500' 
            : 'bg-white/50 border-2 border-dashed border-purple-200'
        }`}>
          <p className={`text-3xl md:text-4xl font-bold transition-all ${
            isComplete ? 'text-purple-700' : 'text-gray-400'
          }`}>
            {phrase}
          </p>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          {(action || bodyPart) && (
            <>
              <Button
                onClick={() => speak(phrase)}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 h-14"
              >
                <Volume2 className="w-6 h-6 mr-2" />
                Speak Again
              </Button>
              
              <Button
                onClick={onClear}
                size="lg"
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 text-lg px-8 h-14"
              >
                <RotateCcw className="w-6 h-6 mr-2" />
                Clear
              </Button>
            </>
          )}
        </div>

        <div className="mt-4 p-4 bg-white/70 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">How to use:</span> Click an action word, then click a body part to create and hear a phrase
          </p>
        </div>
      </div>
    </Card>
  );
}