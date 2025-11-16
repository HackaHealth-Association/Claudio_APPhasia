import React from 'react';
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { ArrowLeft, Volume2 } from "lucide-react";

/**
 * TextDisplay Component
 * 
 * PURPOSE: Shows the accumulated phrase at the top of the screen
 * 
 * FUNCTIONALITY:
 * - Displays all selected words in order
 * - Shows "Show selected text here" when no words selected
 * - Back arrow button to remove last word
 * - Speaker button to speak the phrase out loud
 * 
 * WORKFLOW:
 * 1. User clicks buttons throughout the interface
 * 2. Each click adds a word to selectedWords array
 * 3. This component joins all words with spaces
 * 4. Displays the complete phrase
 * 5. User can speak or remove words
 * 
 * EXAMPLE PROGRESSION:
 * "Schmerz" → "Schmerz Knie" → "Schmerz Knie 7" → "Schmerz Knie 7 !"
 */

export default function TextDisplay({ selectedWords, onBack, onSpeak, onClearAll, isPlaying, onStop }) {
  /**
   * PROPS:
   * - selectedWords: array of strings - All words selected by user in order
   * - onBack: function - Called when back arrow clicked (removes last word)
   * - onSpeak: function - Called when speaker icon clicked (speaks the phrase)
   */

  /**
   * BUILD THE DISPLAY TEXT
   * - If words exist: join them with spaces ("Schmerz Knie 7")
   * - If no words: show placeholder text
   */
  const displayText = selectedWords.length > 0 
    ? selectedWords.join(' ')              // Join array: ["Schmerz", "Knie"] → "Schmerz Knie"
    : 'Show selected text here';           // Default placeholder
    
  return (
    <Card className="bg-white border-2 border-gray-300">
      <div className="p-4 flex items-center gap-4">
        
        {/* 
          ============================================================
          LEFT SIDE BUTTONS
          ============================================================
        */}
        <div className="flex gap-2">
          {/* Back arrow - removes last word */}
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            disabled={selectedWords.length === 0}
            title="Letztes Wort entfernen"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          {/* Clear all button */}
          <Button
            onClick={onClearAll}
            variant="ghost"
            size="sm"
            className="h-10"
            disabled={selectedWords.length === 0}
            title="Alles löschen"
          >
            Alles löschen
          </Button>
        </div>
        
        {/* 
          ============================================================
          TEXT DISPLAY AREA (Center)
          ============================================================
          Shows the complete phrase built from all selected words
          Takes up most of the horizontal space (flex-1)
        */}
        <div className="flex-1 text-center">
          <p className="text-2xl font-semibold text-gray-800">
            {displayText}
          </p>
        </div>
        
        {/* 
          ============================================================
          SPEAKER BUTTON (Right side)
          ============================================================
          Triggers text-to-speech to read the phrase aloud
          Disabled when no words are selected
          
          TODO: Speech synthesis happens in parent component (TherapyAssistant)
          This button just triggers the onSpeak callback
        */}

        {!isPlaying ? (
            <Button
              onClick={onSpeak}
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              disabled={selectedWords.length === 0}  // Can't speak if nothing to say
              title="Text vorlesen"
              aria-label ='Speak'
            >
              <Volume2 className="w-6 h-6" />
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
            {/* draw stopbutton */}
           <span className="block w-6 h-6 rounded-full bg-red-600 animate-pulse ring-2 ring-red-300" />
         </Button>
       )}


      </div>
      
      {/* 
        ============================================================
        TODO: SPEECH SYNTHESIS NOTES
        ============================================================
        
        The actual speech functionality is implemented in the parent component
        using the Web Speech API:
        
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
        
        Key settings for German speech:
        - utterance.lang = 'de-DE'  (German language)
        - utterance.rate = 0.75     (Slower for clarity - important for aphasia)
        - utterance.pitch = 1       (Normal pitch)
        - utterance.volume = 1      (Maximum volume)
        
        TODO ENHANCEMENTS:
        - Add volume control slider
        - Add speech rate control
        - Add option to repeat automatically
        - Save commonly used phrases
      */}
    </Card>
  );
}