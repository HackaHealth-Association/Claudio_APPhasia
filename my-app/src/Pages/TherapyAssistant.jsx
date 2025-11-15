import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import AnatomyViewer from '../components/therapy/AnatomyViewer';
import BodyPartMuscles from '../components/therapy/BodyPartMuscles';
import ActionButtons from '../components/therapy/ActionButtons';
import ControlsPanel from '../components/therapy/ControlsPanel';
import TextDisplay from '../components/therapy/TextDisplay';
import QuestionInterface from '../components/therapy/QuestionInterface';

/**
 * ============================================================
 * TherapyAssistant - MAIN PAGE COMPONENT
 * ============================================================
 * 
 * PURPOSE: Speech assistance tool for physiotherapist with aphasia
 * 
 * MAIN FEATURES:
 * 1. Visual body anatomy with clickable parts
 * 2. Dynamic muscle selection based on body part
 * 3. Action verbs for therapy instructions
 * 4. Numerical inputs (sliders) and directional arrows
 * 5. Text-to-speech for phrase pronunciation
 * 
 * APPLICATION WORKFLOW:
 * 1. User clicks body part → selects anatomical region
 * 2. Muscle list updates automatically (DEPENDENCY)
 * 3. User clicks muscle → adds to phrase
 * 4. User selects action (e.g., "beugen") → adds to phrase
 * 5. User adds numbers/directions → adds to phrase
 * 6. Complete phrase is spoken automatically
 * 
 * EXAMPLE USAGE:
 * Click: "Knie" → "beugen" → "5" → "oben"
 * Result: "Knie beugen 5 oben" (Bend knee 5 times upward)
 * System speaks: [German speech synthesis reads the phrase]
 */

export default function TherapyAssistant() {
  /**
   * ============================================================
   * STATE MANAGEMENT
   * ============================================================
   * All state variables that track user selections and inputs
   */
  
  // BODY VIEW STATE - Which angle of body is shown (front/back/left/right)
  const [currentView, setCurrentView] = useState('front');
  
  // SELECTED BODY PART STATE - Currently clicked anatomical region
  // This is the KEY STATE that determines which muscles are shown
  // DEPENDENCY: BodyPartMuscles component depends on this value
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  
  // SELECTED MUSCLE STATE - Currently clicked muscle from BodyPartMuscles
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  
  // SELECTED ACTION STATE - Currently clicked action verb
  const [selectedAction, setSelectedAction] = useState(null);
  
  // PHRASE BUILDING STATE - Array of all selected words in order
  // Example: ["Schmerz", "Knie", "7", "!"]
  const [selectedWords, setSelectedWords] = useState([]);
  
  // SLIDER VALUE STATE - Current value of the slider (0-10)
  const [slider1Value, setSlider1Value] = useState(0);

  /**
   * ============================================================
   * HELPER FUNCTION: ADD WORD TO PHRASE
   * ============================================================
   * Central function that adds any word to the phrase builder
   * Used by all child components to build the phrase
   */
  const addWord = (word) => {
    setSelectedWords(prev => [...prev, word]);  // Append word to end of array
  };

  /**
   * ============================================================
   * EVENT HANDLERS - ANATOMY VIEWER
   * ============================================================
   */
  
  /**
   * Handles body part click from AnatomyViewer
   * IMPORTANT: This triggers the DEPENDENCY update for BodyPartMuscles
   * 
   * @param {string} bodyPart - Name of clicked body part
   */
  const handleBodyPartClick = (bodyPart) => {
    setSelectedBodyPart(bodyPart);  // Update selected body part
                                     // This causes BodyPartMuscles to re-render with new muscles
    addWord(bodyPart);               // Add body part name to phrase
  };

  /**
   * ============================================================
   * EVENT HANDLERS - BODY PART MUSCLES
   * ============================================================
   */
  
  /**
   * Handles muscle click from BodyPartMuscles component
   * 
   * @param {string} muscle - Name of clicked muscle
   */
  const handleMuscleClick = (muscle) => {
    setSelectedMuscle(muscle);  // Update selected muscle for highlighting
    addWord(muscle);            // Add muscle name to phrase
  };

  /**
   * ============================================================
   * EVENT HANDLERS - ACTION BUTTONS
   * ============================================================
   */
  
  /**
   * Handles action verb click
   * 
   * @param {string} action - The action word (e.g., "beugen", "Schmerz")
   */
  const handleActionClick = (action) => {
    setSelectedAction(action);  // Update selected action for highlighting
    addWord(action);            // Add action to phrase
  };

  /**
   * Handles special symbol click (? or !)
   * 
   * @param {string} symbol - The symbol character
   */
  const handleSpecialClick = (symbol) => {
    addWord(symbol);  // Add symbol directly to phrase
  };

  /**
   * ============================================================
   * EVENT HANDLERS - CONTROLS PANEL
   * ============================================================
   */
  
  /**
   * Handles slider 1 value change
   * Adds the new number value to the phrase
   * 
   * @param {number} value - New slider value (0-10)
   */
  const handleSlider1Change = (value) => {
    setSlider1Value(value);      // Update slider state
  };

  const handleSlider1Commit = (value) => {
    addWord(value.toString());   // Add number to phrase as string
  };


  /**
   * Handles plus/minus button click
   * 
   * @param {string} sign - Either '+' or '-'
   */
  const handleSignClick = (sign) => {
    addWord(sign);  // Add mathematical operator to phrase
  };

  /**
   * Handles direction arrow click
   * 
   * @param {string} direction - Direction name (oben, unten, links, rechts, vor, zurück)
   */
  const handleDirectionClick = (direction) => {
    addWord(direction);  // Add direction to phrase
  };

  /**
   * ============================================================
   * EVENT HANDLERS - TEXT DISPLAY
   * ============================================================
   */
  
  /**
   * Handles back button click - removes last word from phrase
   */
  const handleBack = () => {
    if (selectedWords.length > 0) {
      setSelectedWords(prev => prev.slice(0, -1));
    }
  };

  /**
   * Handles clear all button click - removes all words from phrase
   */
  const handleClearAll = () => {
    setSelectedWords([]);
  };

  /**
   * Handles speak button click - uses Text-to-Speech API
   * 
   * TEXT-TO-SPEECH IMPLEMENTATION:
   * Uses Web Speech API (built into modern browsers)
   * Configured for German language with slower rate for clarity
   * 
   * IMPORTANT FOR APHASIA USERS:
   * - Slower speech rate (0.75) for better comprehension
   * - Clear pronunciation
   * - Maximum volume
   * 
   * TODO ENHANCEMENTS:
   * - Add configurable speech rate
   * - Add volume control
   * - Add option to repeat last phrase
   * - Save frequently used phrases
   */
  const handleSpeak = () => {
    // Join all words into a single string
    const text = selectedWords.join(' ');
    
    // Check if browser supports speech synthesis and text exists
    if ('speechSynthesis' in window && text) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure speech settings for German
      utterance.lang = 'de-DE';    // German language
      utterance.rate = 0.75;       // Slower speed for clarity (default is 1)
      utterance.pitch = 1;         // Normal pitch
      utterance.volume = 1;        // Maximum volume
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
    }
  };

  /**
   * ============================================================
   * RENDER - LAYOUT STRUCTURE
   * ============================================================
   * 
   * LAYOUT GRID (12 columns):
   * 
   * [  TextDisplay spanning full width (12 cols)  ]
   * 
   * [ AnatomyViewer ] [ BodyPartMuscles ] [ ActionButtons ] [ ControlsPanel ]
   *    (3 cols)            (2 cols)           (3 cols)          (4 cols)
   * 
   * RESPONSIVE BEHAVIOR:
   * - Large screens: All in one row
   * - Smaller screens: Components stack vertically
   */
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-[1600px] mx-auto space-y-4">
        
        {/* TOP ROW: TEXT DISPLAY */}
        <TextDisplay 
          selectedWords={selectedWords}
          onBack={handleBack}
          onSpeak={handleSpeak}
          onClearAll={handleClearAll}
        />

        {/* TAB NAVIGATION */}
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="questions">Fragen</TabsTrigger>
            <TabsTrigger value="advanced">Erweitert</TabsTrigger>
          </TabsList>
          
          {/* TAB 1: Question Interface */}
          <TabsContent value="questions">
            <QuestionInterface onWordSelect={addWord} />
          </TabsContent>
          
          {/* TAB 2: Advanced Interface */}
          <TabsContent value="advanced">

        {/* 
          ============================================================
          MAIN GRID: 4 COLUMNS OF CONTROLS
          ============================================================
          Uses CSS Grid with 12 columns for flexible layout
        */}
        <div className="grid grid-cols-12 gap-3">
          
          {/* 
            COLUMN 1: ANATOMY VIEWER (3 columns wide)
            - Shows body from 4 views
            - Clickable body parts
            - View navigation arrows
          */}
          <div className="col-span-5">
            <AnatomyViewer 
              currentView={currentView}
              onViewChange={setCurrentView}
              onBodyPartClick={handleBodyPartClick}
            />
          </div>

          {/* 
            COLUMN 2: BODY PART MUSCLES (2 columns wide)
            - DEPENDENT on selectedBodyPart
            - Shows muscles for selected body area
            - Updates automatically when body part changes
            
            KEY DEPENDENCY:
            When user clicks "Knie" in AnatomyViewer:
            1. handleBodyPartClick('Knie') is called
            2. setSelectedBodyPart('Knie') updates state
            3. BodyPartMuscles receives new selectedBodyPart prop
            4. Component looks up knee muscles
            5. Displays knee-specific muscle buttons
          */}
          {/* <div className="col-span-2">
            <BodyPartMuscles 
              selectedBodyPart={selectedBodyPart}   // DEPENDENCY: This drives which muscles are shown
              selectedMuscle={selectedMuscle}
              onMuscleClick={handleMuscleClick}
            />
          </div> */}

          {/* 
            COLUMN 3: ACTION BUTTONS (3 columns wide)
            - Action verbs for therapy
            - Special symbols (? and !)
          */}
          <div className="col-span-3">
            <ActionButtons 
              selectedAction={selectedAction}
              onActionClick={handleActionClick}
              onSpecialClick={handleSpecialClick}
            />
          </div>

          {/* 
            COLUMN 4: CONTROLS PANEL (4 columns wide)
            - Number slider (0-10)
            - Plus/minus buttons
            - 6 directional arrows
          */}
          <div className="col-span-4">
            <ControlsPanel 
              slider1Value={slider1Value}
              onSlider1Change={handleSlider1Change}
              onSlider1Commit={handleSlider1Commit}
              onSignClick={handleSignClick}
              onDirectionClick={handleDirectionClick}
            />
          </div>
        </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}