import React, { useState } from 'react';
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Slider } from "../../Components/ui/slider";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, MoveVertical } from "lucide-react";
import AnatomyViewer from './AnatomyViewer';
import ControlsPanel from './ControlsPanel';


// Math icons
import MultiplicationIcon from "../../assets/icons/Multiplication.png";
import SubtractionIcon from "../../assets/icons/Subtraction.png";
import AdditionIcon from "../../assets/icons/Addition.png";

// Punctuation icons
import ExclamationIcon from "../../assets/icons/Exclamation.png";
import QuestionIcon from "../../assets/icons/Question.png";

// Response icons
import SchmerzIcon from "../../assets/icons/Schmerz.png";
import ÜbungenIcon from "../../assets/icons/Übungen.png";
import BeweglichkeitIcon from "../../assets/icons/Beweglichkeit.png";
import SpitzIcon from "../../assets/icons/Spitz.png";
import StumpfIcon from "../../assets/icons/Stumpf.png";
import WoIcon from "../../assets/icons/Wo.png";
import WannIcon from "../../assets/icons/Wann.png";
import Wie_langIcon from "../../assets/icons/Wie_lang.png";
import Wie_oftIcon from "../../assets/icons/Wie_oft.png";
import GefühlIcon from "../../assets/icons/Gefühl.png";
import TrainingIcon from "../../assets/icons/Training.png";

/**
 * Directions config
 */
const directions = [
  { label: "oben", icon: ArrowUp, value: "oben", pos: "col-start-2 row-start-1" },
  { label: "unten", icon: ArrowDown, value: "unten", pos: "col-start-2 row-start-2" },
  { label: "links", icon: ArrowLeft, value: "links", pos: "col-start-1 row-start-1" },
  { label: "rechts", icon: ArrowRight, value: "rechts", pos: "col-start-3 row-start-1" },
  { label: "vor", icon: MoveVertical, value: "vor", pos: "col-start-1 row-start-2" },
  { label: "zurück", icon: MoveVertical, value: "zurück", pos: "col-start-3 row-start-2" }
];

/**
 * Response button config – now visually like ActionButtons
 */
const responses = [
  { word: "Schmerz", icon: SchmerzIcon, color: "bg-red-500 hover:bg-red-600 text-black" },
  { word: "stumpf", icon: StumpfIcon, color: "bg-red-400 hover:bg-red-600 text-black" },
  { word: "spitz", icon: SpitzIcon, color: "bg-red-300 hover:bg-red-600 text-black" },
  { word: "Übungen", icon: ÜbungenIcon, color: "bg-blue-500 hover:bg-blue-600 text-black" },
  { word: "Beweglichkeit", icon: BeweglichkeitIcon, color: "bg-blue-400 hover:bg-blue-600 text-black" },
  { word: "Training", icon: TrainingIcon, color: "bg-blue-300 hover:bg-blue-600 text-black" },
  { word: "wo?", icon: WoIcon, color: "bg-yellow-400 hover:bg-yellow-500 text-black" },
  { word: "wann?", icon: WannIcon, color: "bg-yellow-300 hover:bg-yellow-500 text-black" },
  { word: "wie oft?", icon: Wie_oftIcon, color: "bg-yellow-200 hover:bg-yellow-500 text-black" },
  { word: "wie lange?", icon: Wie_langIcon, color: "bg-yellow-100 hover:bg-yellow-500 text-black" },
];

export default function QuestionInterface({ onWordSelect,
  slider1Value,
  onSlider1Change,
  onSlider1Commit,
  onSignClick,
  onDirectionClick }) {
  const [currentView, setCurrentView] = useState('front');
  const [sliderValue, setSliderValue] = useState(0);

  return (
    <div className="grid grid-cols-10 gap-4">

      {/* LEFT: Anatomy Viewer */}
      <div className="col-span-3">
        <AnatomyViewer 
          currentView={currentView}
          onViewChange={setCurrentView}
          onBodyPartClick={onWordSelect}
        />
      </div>

  {/* MIDDLE: Questions + Responses */}
  <div className="col-span-4">
    <Card className="bg-white border-2 border-gray-300 p-6 space-y-6 shadow-none">

      {/* Question Card (with icon) */}
      <Card 
        className="bg-gray-400 p-4 cursor-pointer hover:bg-gray-500 transition-colors text-black font-bold flex flex-col items-center shadow-none border-none"
        onClick={() => onWordSelect('Erzählen Sie mir Tag für Tag, wie sich deine Beschwerden seit der letzten Physiotherapie verändert haben.')}
      >
        <img src={GefühlIcon} alt="Gefühl" className="w-20 h-20 mb-2" />
        <span className="text-lg text-center">Wie geht's?</span>
      </Card>

      {/* === Response buttons (ActionButtons style) === */}
      <div className="grid grid-cols-3 gap-4">
        {responses.map((item) => (
          <Button
            key={item.word}
            onClick={() => onWordSelect(item.word)}
            className={`h-35 flex flex-col items-center justify-center text-lg font-semibold transition-all shadow-none border-none ${item.color}`}
          >
            {item.icon ? (
              <img src={item.icon} alt={item.word} className="w-17 h-17 mb-2" />
            ) : (
              <span className="text-4xl mb-2">{item.emoji}</span>
            )}
            {item.word}
          </Button>
        ))}
      </div>

      {/* Follow-up question */}
      <Card 
        className="bg-gray-400 p-4 cursor-pointer hover:bg-gray-500 transition-colors text-black font-bold flex flex-col items-center shadow-none border-none"
        onClick={() => onWordSelect('Möchten Sie noch etwas fragen?')}
      >
        <img src={QuestionIcon} alt="QuestionIcon" className="w-20 h-20 mb-2" />
        <span className="text-lg text-center">Noch Fragen?</span>
      </Card>

    </Card>
  </div>



      {/* RIGHT: Controls */}
      <div className="col-span-3">
                      <ControlsPanel
                        slider1Value={slider1Value}
                        onSlider1Change={onSlider1Change}
                        onSlider1Commit={onSlider1Commit}
                        onSignClick={onSignClick}
                        onDirectionClick={onDirectionClick}
                      />
        </div>
    </div>
  );
}
