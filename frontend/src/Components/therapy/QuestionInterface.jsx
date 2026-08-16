import React, { useState } from 'react';
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import AnatomyViewer from './AnatomyViewer';
import ControlsPanel from './ControlsPanel';
import ThreePanelLayout from "../../Components/layout/ThreePanelLayout";

// Icons
import GefühlIcon from "../../assets/icons/Gefühl.png";
import FrageIcon from "../../assets/icons/Question.png";

import SchmerzIcon from "../../assets/icons/Schmerz.png";
import ÜbungenIcon from "../../assets/icons/Übungen.png";
import BeweglichkeitIcon from "../../assets/icons/Beweglichkeit.png";
import SpitzIcon from "../../assets/icons/Spitz.png";
import StumpfIcon from "../../assets/icons/Stumpf.png";
import WoIcon from "../../assets/icons/Wo.png";
import WannIcon from "../../assets/icons/Wann.png";
import Wie_langIcon from "../../assets/icons/Wie_lang.png";
import Wie_oftIcon from "../../assets/icons/Wie_oft.png";
import TrainingIcon from "../../assets/icons/Training.png";
import AkutIcon from "../../assets/icons/Akut.png";
import ChronischIcon from "../../assets/icons/Chronisch.png";

const responses = [
  { word: "Schmerz", icon: SchmerzIcon, color: "bg-red-500 hover:bg-red-600 text-black" },
  { word: "stumpf", icon: StumpfIcon, color: "bg-red-400 hover:bg-red-600 text-black" },
  { word: "spitz", icon: SpitzIcon, color: "bg-red-300 hover:bg-red-600 text-black" },
  { word: "Übungen", icon: ÜbungenIcon, color: "bg-blue-500 hover:bg-blue-600 text-black" },
  { word: "Beweglichkeit", icon: BeweglichkeitIcon, color: "bg-blue-400 hover:bg-blue-600 text-black" },
  { word: "Training", icon: TrainingIcon, color: "bg-blue-300 hover:bg-blue-600 text-black" },
  { word: "wo", icon: WoIcon, color: "bg-yellow-400 hover:bg-yellow-500 text-black" },
  { word: "wann", icon: WannIcon, color: "bg-yellow-300 hover:bg-yellow-500 text-black" },
  { word: "wie oft", icon: Wie_oftIcon, color: "bg-yellow-200 hover:bg-yellow-500 text-black" },
  { word: "wie lange",  icon: Wie_langIcon,  color: "bg-green-300 hover:bg-green-500 text-black" },
  { word: "akut",       icon: AkutIcon,      color: "bg-green-200 hover:bg-green-500 text-black" },
  { word: "chronisch",  icon: ChronischIcon, color: "bg-green-100 hover:bg-green-500 text-black" },
  
];

export default function QuestionInterface({
  onWordSelect,
  slider1Value,
  onSlider1Change,
  onSlider1Commit,
  onSignClick,
  onDirectionClick
}) {
  const [currentView, setCurrentView] = useState('front');
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  return (
    <ThreePanelLayout
      left={
        <AnatomyViewer
          currentView={currentView}
          onViewChange={setCurrentView}
          onBodyPartClick={onWordSelect}
        />
      }

      middle={
        <Card className="bg-white border-2 border-gray-300 p-6 space-y-6 shadow-none">

          {/* Question buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Card
              className={`bg-gray-400 p-4 cursor-pointer hover:bg-gray-500 transition-colors 
              text-black font-bold flex flex-col items-center shadow-none border-none
              ${selectedQuestion === "q1" ? "ring-4 ring-offset-2 ring-opacity-50" : ""}`}
              onClick={() => {
                setSelectedQuestion("q1");
                onWordSelect("Erzählen Sie mir Tag für Tag, wie sich deine Beschwerden seit der letzten Physiotherapie verändert haben.");
              }}
            >
              <img src={GefühlIcon} alt="Gefühl" className="w-20 h-20 mb-2" />
              <span className="text-lg text-center">Wie geht's?</span>
            </Card>

            <Card
              className={`bg-gray-400 p-4 cursor-pointer hover:bg-gray-500 transition-colors 
              text-black font-bold flex flex-col items-center shadow-none border-none
              ${selectedQuestion === "q2" ? "ring-4 ring-offset-2 ring-opacity-50" : ""}`}
              onClick={() => {
                setSelectedQuestion("q2");
                onWordSelect("Möchten Sie noch etwas fragen?");
              }}
            >
              <img src={FrageIcon} alt="Frage" className="w-20 h-20 mb-2" />
              <span className="text-lg text-center">Noch Fragen?</span>
            </Card>
          </div>

          {/* Response Buttons */}
          <div className="grid grid-cols-3 gap-4">
            {responses.map((item) => (
              <Button
                key={item.word}
                onClick={() => {
                  setSelectedResponse(item.word);
                  onWordSelect(item.word);
                }}
                className={`h-35 flex flex-col items-center justify-center text-lg font-semibold 
                transition-all shadow-none border-none ${item.color}
                ${selectedResponse === item.word ? "ring-4 ring-offset-2 ring-opacity-50" : ""}`}
              >
                <img src={item.icon} alt={item.word} className="w-16 h-16 mb-2" />
                {item.word}
              </Button>
            ))}
          </div>

        </Card>
      }

      right={
        <ControlsPanel
          slider1Value={slider1Value}
          onSlider1Change={onSlider1Change}
          onSlider1Commit={onSlider1Commit}
          onSignClick={onSignClick}
          onDirectionClick={onDirectionClick}
          onSpeedClick={onWordSelect}
        />
      }
    />
  );
}
