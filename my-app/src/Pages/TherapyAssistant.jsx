import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs";
import AnatomyViewer from '../Components/therapy/AnatomyViewer';
import ActionButtons from '../Components/therapy/ActionButtons';
import ControlsPanel from '../Components/therapy/ControlsPanel';
import TextDisplay from '../Components/therapy/TextDisplay';
import QuestionInterface from '../Components/therapy/QuestionInterface';
import { toast } from "sonner"

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


// --- NEW: Add this component to TherapyAssistant.jsx ---
// Put it *outside* (above) the `export default function TherapyAssistant()`

// Helper function to convert a file to a Base64 string
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// The new "Add Word" form component
const AddWordForm = ({ onSubmit }) => {
  const [word, setWord] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word || !file) {
      toast.error("Bitte ein Wort und ein Bild angeben.");
      return;
    }

    try {
      // Convert image to Base64
      const imageBase64 = await fileToBase64(file);
      // Call the function passed from the parent (handleAddCustomWord)
      onSubmit(word, imageBase64);

      // Reset the form
      setWord("");
      setFile(null);
      e.target.reset(); // Clear the file input
    } catch (error) {
      console.error("Error converting file:", error);
      toast.error("Fehler beim Verarbeiten des Bildes.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-gray-50 border rounded-lg flex flex-col sm:flex-row gap-3 items-center"
    >
      <h3 className="text-lg font-semibold">Neues Wort hinzufügen:</h3>
      <input
        type="text"
        placeholder="Wort (z.B. 'Durst')"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        className="p-2 border rounded-md"
        required
      />
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        onChange={(e) => setFile(e.target.files[0])}
        className="p-1 border rounded-md"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Hinzufügen
      </button>
    </form>
  );
};


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

  const [audioPlayer] = useState(() => new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [customWords, setCustomWords] = useState([]);
  /**
   * ============================================================
   * HELPER FUNCTION: ADD WORD TO PHRASE
   * ============================================================
   * Central function that adds any word to the phrase builder
   * Used by all child components to build the phrase
   */

  useEffect(() => {
  const savedWords = localStorage.getItem('customWords');
  if (savedWords) {
    // If we found words, parse the JSON string and set our state
    setCustomWords(JSON.parse(savedWords));
  }
  // The empty array [] means this effect runs only once on page load
}, []);

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

var envBackendURL = '';

if (process.env.NODE_ENV === 'production') {
    envBackendURL = 'https://claudio-apphasia-1.onrender.com';
} else {
    envBackendURL = 'http://127.0.0.1:5000';
}

  const handleSpeak = async () => {
    console.log("➡️ handleSpeak() triggered");
    console.log("Selected words:", selectedWords);

    if (!audioPlayer.paused) {
      console.log("🛑 Audio is playing — stopping it now");
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      setIsPlaying(false);
      toast.info("Wiedergabe gestoppt");
      return;
    }

    // 1. Check if there are any words to send
    if (selectedWords.length === 0) {
      console.log("❌ No words selected → aborting");
      toast.error("Keine Wörter ausgewählt");
      return;
    }

    console.log("✅ Words selected, continuing...");

    try {
      console.log("📡 Sending POST request to backend...");
      console.log("POST body:", JSON.stringify({ keywords: selectedWords }));

      const response = await fetch(`${envBackendURL}/api/generate-sentence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywords: selectedWords })
      });

      console.log("📬 Response received:", response);
      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("📦 Parsed JSON:", data);

      if (!response.ok) {
        console.log("❌ Backend returned an error:", data.error);
        throw new Error(data.error || "Unbekannter Fehler");
      }

      // 4. Success! We got a response
      const sentence = data.sentence;
      const audioUrl = data.audio_url;

      console.log("✅ Sentence received:", sentence);
      console.log("🔊 Audio URL received:", audioUrl);

      toast.success(`Spreche: "${sentence}"`);

      // 5. Play the audio
      console.log("🎵 Preparing audio playback...");
      // const audioPlayer = new Audio();

      const fullAudioUrl = `${envBackendURL}/${audioUrl}?t=${new Date().getTime()}`;
      console.log("🎵 Full audio URL:", fullAudioUrl);

      audioPlayer.src = fullAudioUrl;
      // add new
      audioPlayer.onended = () => console.log("✅ Audio playback ended");
      audioPlayer.onended = () => setIsPlaying(false);
      audioPlayer.onerror  = () => setIsPlaying(false);
      audioPlayer.onpause  = () => setIsPlaying(false);



      console.log("▶️ Attempting to play audio...");
      await audioPlayer.play();
      console.log("🎉 Audio playback started successfully!");
      setIsPlaying(true);

    } catch (error) {
      console.error("💥 Fehler beim Generieren des Satzes:", error);
      toast.error(error.message || "Fehler beim Generieren des Satzes");
    }
  };


  const updateCustomWords = (newWordsList) => {
    setCustomWords(newWordsList);
    localStorage.setItem('customWords', JSON.stringify(newWordsList));
  };

  // --- NEW: Function to add a new word ---
  // We'll call this from our "Add Word" form
  const handleAddCustomWord = (word, imageBase64) => {
    // Check for duplicates
    if (customWords.some(item => item.word === word)) {
      toast.error("Dieses Wort existiert bereits");
      return;
    }

    const newWord = { word: word, image: imageBase64 };
    const updatedWords = [...customWords, newWord];
    updateCustomWords(updatedWords);
    toast.success(`"${word}" hinzugefügt`);
  };

  // --- NEW: Function to delete a word ---
  const handleDeleteCustomWord = (wordToDelete) => {
    const updatedWords = customWords.filter(item => item.word !== wordToDelete);
    updateCustomWords(updatedWords);
    toast.info(`"${wordToDelete}" gelöscht`);
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
          isPlaying={isPlaying}      // ← 追加
          onStop={() => { 
          audioPlayer.pause();
          audioPlayer.currentTime = 0;
          setIsPlaying(false);
          toast.info("Wiedergabe gestoppt");
          }}      
        />

        {/* TAB NAVIGATION */}
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4"> {/* <-- CHANGED to grid-cols-3 */}
          <TabsTrigger value="questions">Fragen</TabsTrigger>
          <TabsTrigger value="advanced">Erweitert</TabsTrigger>
          <TabsTrigger value="custom">Zusätzliche Wörter</TabsTrigger> {/* <-- NEW TAB */}
        </TabsList>

          {/* TAB 1: Question Interface */}
          <TabsContent value="questions">
            <QuestionInterface onWordSelect={addWord} 
                  slider1Value={slider1Value}
                  onSlider1Change={handleSlider1Change}
                  onSlider1Commit={handleSlider1Commit}
                  onSignClick={handleSignClick}
                  onDirectionClick={handleDirectionClick} />
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
              <div className="col-span-3">
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
              <div className="col-span-5">
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


          {/* --- NEW: TAB 3: Custom Words Interface --- */}
          <TabsContent value="custom">
            {/* We use a separate component for the "Add Word" form logic */}
            <AddWordForm onSubmit={handleAddCustomWord} />

            <div className="border-t my-4" />

            {/* Display the grid of custom words */}
            <div
              className="grid gap-4"
              // This CSS makes a responsive grid
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}
            >
              {customWords.length === 0 && (
                <p className="text-muted-foreground">Noch keine Wörter hinzugefügt.</p>
              )}

              {customWords.map((item) => (
                <div
                  key={item.word}
                  className="relative group"
                >
                  {/* The Clickable Word/Image Button */}
                  <button
                    onClick={() => addWord(item.word)} // <-- FEATURE 4: Re-uses your existing addWord function
                    className="w-full p-2 bg-white rounded-lg shadow border hover:shadow-md transition-all flex flex-col items-center gap-2"
                  >
                    <img
                      src={item.image} // <-- This will be the Base64 string
                      alt={item.word}
                      className="w-20 h-20 object-contain"
                    />
                    <span className="font-medium text-center">{item.word}</span>
                  </button>

                  {/* The Delete Button (Feature 3) */}
                  <button
                    onClick={() => handleDeleteCustomWord(item.word)}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center
                               opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Wort löschen"
                  >
                    X
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