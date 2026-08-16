import React from 'react';
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { ArrowLeft, Volume2, X } from "lucide-react";

/**
 * TextDisplay Component
 *
 * PURPOSE: Shows the accumulated phrase at the top of the screen.
 *
 * FUNCTIONALITY:
 * - Displays all selected words as individual, clickable elements.
 * - **NEW**: Clicking an individual word removes it from the phrase (can be adapted to long-press).
 * - Back arrow button to remove last word
 * - Speaker button to speak the phrase out loud
 */

export default function TextDisplay({ 
  selectedWords, 
  onBack, 
  onSpeak, 
  onClearAll, 
  isPlaying, 
  onStop, 
  onRemoveWord
}) {
  
  /**
   * onWordClick Handler
   * Simulates the removal action. The parent component will implement
   * the logic to determine if this is a "long press" or not.
   * For simplicity here, we use a regular click.
   */
  const handleWordClick = (index) => {
    // Only call the removal function if it exists and there are words
    if (onRemoveWord && selectedWords.length > 0) {
        onRemoveWord(index);
    }
  };


  // --- Helper for placeholder display ---
  const hasWords = selectedWords.length > 0;
  
  return (
    <Card className="bg-white border-2 border-gray-300">
      <div className="p-4 flex items-center gap-4">

        {/* LEFT SIDE BUTTONS */}
        <div className="flex gap-2">
          {/* Back arrow - removes last word */}
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600
              ring-4 ring-emerald-300/60 hover:ring-emerald-400/70
              shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-200
              disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!hasWords}
            title="Letztes Wort entfernen"
          >
            <ArrowLeft className="w-8 h-8 text-white" strokeWidth={2.75} />
          </Button>

          {/* Clear all button */}
          <Button
            onClick={onClearAll}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700
                shadow-lg focus:outline-none focus:ring-4 focus:ring-red-200"
            disabled={!hasWords}
            title="Alles löschen"
            aria-label="Alles löschen"
          >
             <X className="w-8 h-8 text-white" strokeWidth={2.75} />
          </Button>
          <span className="text-red-700 font-semibold select-none"></span>
        </div>

        {/* ============================================================
          TEXT DISPLAY AREA (Center)
          ============================================================
          Renders each word individually.
        */}
        <div className="flex-1 text-center min-h-[48px] flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            {hasWords ? (
                selectedWords.map((word, index) => (
                    // Each word is now a clickable/interactive element
                    <span
                        key={`${word}-${index}`} // Key includes index for uniqueness even with repeated words
                        onClick={() => handleWordClick(index)} // Triggers removal (or could be long-press handler)
                        className="text-2xl font-semibold text-gray-800 cursor-pointer 
                            bg-yellow-100 hover:bg-yellow-200 p-1 rounded-md 
                            transition-colors duration-150 active:scale-[0.98]"
                        title={`Klicken, um "${word}" zu entfernen (oder lange drücken)`}
                    >
                        {word}
                    </span>
                ))
            ) : (
                 <p className="text-2xl font-semibold text-gray-400">
                     .........
                 </p>
            )}
        </div>
        
        {/* SPEAKER BUTTON (Right side) */}
        {!isPlaying ? (
            <Button
              onClick={onSpeak}
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700
                ring-4 ring-blue-300/60 hover:ring-blue-400/70
                shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200"
              disabled={!hasWords} 
              title="Text vorlesen"
              aria-label ='Speak'
            >
              <Volume2 className="w-8 h-8 text-white" strokeWidth={2.75} />
            </Button>
        ) : (
          <Button
            onClick={onStop}
            variant="ghost"
            size="icon"
            className="h-10 w-10 p-0"
            title="Stop"
            aria-label ='Stop audio'
          >
           <span className="block w-6 h-6 rounded-full bg-red-600 animate-pulse ring-2 ring-red-300" />
          </Button>
        )}

      </div>
    </Card>
  );
}

