import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs";
import AnatomyViewer from '../Components/therapy/AnatomyViewer';
import ActionButtons from '../Components/therapy/ActionButtons';
import ControlsPanel from '../Components/therapy/ControlsPanel';
import TextDisplay from '../Components/therapy/TextDisplay';
import QuestionInterface from '../Components/therapy/QuestionInterface';
import ThreePanelLayout from "../Components/layout/ThreePanelLayout";
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
  const [fileName, setFileName] = useState("Kein Bild ausgewählt");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName("Kein Bild ausgewählt");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 1. Image is now optional, only the word is required
    if (!word) {
      toast.error("Bitte ein Wort angeben.");
      return;
    }

    let imageBase64 = null; // Default to null

    // 2. Only convert the file if one was selected
    if (file) {
      try {
        imageBase64 = await fileToBase64(file);
      } catch (error) {
        console.error("Error converting file:", error);
        toast.error("Fehler beim Verarbeiten des Bildes.");
        return; // Stop if image processing fails
      }
    }

    // Call the parent function with the word and the (optional) image
    onSubmit(word, imageBase64);

    // Reset the form
    setWord("");
    setFile(null);
    setFileName("Kein Bild ausgewählt");
    e.target.reset(); // Clear the file input
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-3"
    >
      <h3 className="text-lg font-semibold">Neues Wort:</h3>
      <input
        type="text"
        placeholder="Wort (z.B. 'tschutte')"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        className="p-2 border rounded-md"
        required // The word is still required
      />

      {/* 3. New German "fake" file button */}
      <label className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer text-sm">
        Bild auswählen (Optional)
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp, image/svg+xml"
          className="hidden" // The real input is hidden
          onChange={handleFileChange}
        />
      </label>

      {/* Show the selected file name */}
      <span className="text-gray-500 text-sm max-w-[150px] truncate" title={fileName}>
        {fileName}
      </span>

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

  // // Previous version
  // const addWord = (word) => {
  //   setSelectedWords(prev => [...prev, word]);  // Append word to end of array
  // };

  // Add double digits: "1" + "8" = "18"
  const addWord = (word) => {
    setSelectedWords(prev => {
      // If incoming word is a single digit AND previous word is a number → merge
      if (/^\d$/.test(word) && prev.length > 0 && /^\d+$/.test(prev[prev.length - 1])) {
        const updated = [...prev];
        updated[updated.length - 1] = updated[updated.length - 1] + word;
        return updated;
      }

      // Otherwise add normally
      return [...prev, word];
    });
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

  const handleSpeedClick = (speed) => {
    addWord(speed);
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

  const handleRemoveWord = (indexToRemove) => {
    setSelectedWords(prevWords => 
      prevWords.filter((_, index) => index !== indexToRemove)
    );
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
    envBackendURL = 'https://127.0.0.1:5000';
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
      audioPlayer.onended = () => {
        console.log("✅ Audio playback ended");
        setIsPlaying(false);
      };
      audioPlayer.onended = () => setIsPlaying(false);
      audioPlayer.onerror = () => setIsPlaying(false);
      audioPlayer.onpause = () => setIsPlaying(false);

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



  const handleExportWords = () => {
    // Check if there are any words to export
    if (customWords.length === 0) {
      toast.error("Keine Wörter zum Exportieren vorhanden.");
      return;
    }

    // Convert the current word list state to a JSON string
    const jsonString = JSON.stringify(customWords, null, 2); // null, 2 formats it nicely

    // Create a "Blob" (a file in memory)
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'claudio_words.json'; // This will be the name of the downloaded file

    // Programmatically click the link to start the download
    document.body.appendChild(a);
    a.click();

    // Clean up by removing the temporary link and URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Wörter exportiert!");
  };

  const handleImportWords = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return; // User cancelled
    }

    // Check if it's a JSON file
    if (file.type !== 'application/json') {
      toast.error("Ungültiger Dateityp. Bitte eine .json-Datei auswählen.");
      return;
    }

    const reader = new FileReader();

    // This function runs when the file is finished reading
    reader.onload = (e) => {
      try {
        const fileContent = e.target.result;
        const importedWords = JSON.parse(fileContent);

        // --- Data Validation (Very Important!) ---
        // Check if it's an array
        if (!Array.isArray(importedWords)) {
          throw new Error("Datei hat nicht das richtige Format (kein Array).");
        }

        // Check if the objects inside are correct
        if (importedWords.length > 0) {
          const firstWord = importedWords[0];
          if (typeof firstWord.word !== 'string' || typeof firstWord.image !== 'string') {
            throw new Error("Objekte in der Datei haben nicht die Felder 'word' und 'image'.");
          }
        }
        // --- End Validation ---

        // Overwrite the current set with the imported words
        // This helper function already updates state AND localStorage
        updateCustomWords(importedWords);

        toast.success(`${importedWords.length} Wörter erfolgreich importiert!`);

      } catch (error) {
        console.error("Error parsing imported file:", error);
        toast.error(`Import fehlgeschlagen: ${error.message}`);
      }
    };

    // Read the file as text
    reader.readAsText(file);
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

    /* LEVEL 1: MAIN CONTAINER - Fixed to screen height (h-screen), Page scroll disabled (overflow-hidden) */
    <div className="h-screen w-screen bg-gray-100 p-2 overflow-hidden flex flex-col">
      
      {/* LEVEL 2: INNER WRAPPER - Fills height (h-full), Flex column to stack children */}
      <div className="w-full max-w-full mx-auto h-full flex flex-col space-y-4">

        {/* TOP ROW: TEXT DISPLAY - Wrapped in flex-none so it never shrinks */}
        <div className="flex-none">
          <TextDisplay
            selectedWords={selectedWords}
            onBack={handleBack}
            onSpeak={handleSpeak}
            onClearAll={handleClearAll}
            isPlaying={isPlaying}      // ← 追加
            onRemoveWord={handleRemoveWord}
            onStop={() => {
              audioPlayer.pause();
              audioPlayer.currentTime = 0;
              setIsPlaying(false);
              toast.info("Wiedergabe gestoppt");
            }}
          />
        </div>

        {/* TAB NAVIGATION - flex-1 and min-h-0 allow this to fill remaining space */}
        <Tabs defaultValue="questions" className="w-full flex-1 flex flex-col min-h-0">
          
          {/* TabsList - flex-none to keep fixed height */}
          <TabsList className="grid w-full grid-cols-3 mb-4 flex-none"> {/* <-- CHANGED to grid-cols-3 */}
            <TabsTrigger value="questions">Fragen</TabsTrigger>
            <TabsTrigger value="advanced">Erweitert</TabsTrigger>
            <TabsTrigger value="custom">Zusätzliche Wörter</TabsTrigger> {/* <-- NEW TAB */}
          </TabsList>

          {/* TAB 1: Question Interface - Added overflow-y-auto so this specific tab scrolls */}
          <TabsContent value="questions" className="flex-1 overflow-y-auto min-h-0">
            <QuestionInterface onWordSelect={addWord}
              slider1Value={slider1Value}
              onSlider1Change={handleSlider1Change}
              onSlider1Commit={handleSlider1Commit}
              onSignClick={handleSignClick}
              onDirectionClick={handleDirectionClick} />
          </TabsContent>

          {/* TABs: Therapy Assistant (second page) Interface */}
          <TabsContent value="advanced" className="flex-1 min-h-0 mt-0 flex flex-col">
          <div className="flex-1 min-h-0">
            <ThreePanelLayout
              left={

                <AnatomyViewer
                  currentView={currentView}
                  onViewChange={setCurrentView}
                  onBodyPartClick={handleBodyPartClick}
                />
              }
              middle={

                <ActionButtons
                  selectedAction={selectedAction}
                  onActionClick={handleActionClick}
                  onSpecialClick={handleSpecialClick}
                />
              }
              right={

                <ControlsPanel
                  slider1Value={slider1Value}
                  onSlider1Change={handleSlider1Change}
                  onSlider1Commit={handleSlider1Commit}
                  onSignClick={handleSignClick}
                  onDirectionClick={handleDirectionClick}
                  onSpeedClick={handleSpeedClick}
                />
              }
            />
          </div>

          </TabsContent>

          {/* TAB 3: Custom Words Interface --- */}
          {/* Added overflow-y-auto so this specific tab scrolls normally */}
          <TabsContent value="custom" className="flex-1 min-h-0 mt-0 flex flex-col">

            {/* --- NEW: Single Row Layout --- */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 border rounded-lg">

              {/* Part 1: Add Word Form */}
              <AddWordForm onSubmit={handleAddCustomWord} />

              {/* Part 2: Import/Export Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleExportWords}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Wörter exportieren
                </button>
                <label className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer">
                  Wörter importieren
                  <input
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={handleImportWords}
                  />
                </label>
              </div>
            </div>

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
                    onClick={() => addWord(item.word)}
                    className="w-full p-2 bg-white rounded-lg shadow border hover:shadow-md transition-all flex flex-col items-center gap-2"
                  >

                    {/* --- NEW: Conditionally render image --- */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.word}
                        className="w-28 h-28 object-contain" // <-- CHANGED
                      />
                    ) : (
                      // Placeholder if no image was provided
                      <div className="w-28 h-28 flex items-center justify-center bg-gray-100 rounded-md"> {/* <-- CHANGED */}
                        <span className="text-gray-400 text-sm">(Kein Bild)</span>
                      </div>
                    )}

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
