import React, { useState } from 'react';
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Slider } from "../../Components/ui/slider";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, MoveVertical } from "lucide-react";
import AnatomyViewer from './AnatomyViewer';

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
import SpitzIcon from "../../assets/icons/Spitz.png";
import StumpfIcon from "../../assets/icons/Stumpf.png";
import WoIcon from "../../assets/icons/Wo.png";
import WannIcon from "../../assets/icons/Wann.png";
import Wie_langIcon from "../../assets/icons/Wie_lang.png";
import Wie_oftIcon from "../../assets/icons/Wie_oft.png";
import GefühlIcon from "../../assets/icons/Gefühl.png";

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
  { word: "Übungen", icon: ÜbungenIcon, color: "bg-blue-500 hover:bg-blue-600 text-black" },
  { word: "stumpf", icon: StumpfIcon, color: "bg-yellow-500 hover:bg-yellow-600 text-black" },
  { word: "spitz", icon: SpitzIcon, color: "bg-orange-500 hover:bg-orange-600 text-black" },
  { word: "wo?", icon: WoIcon, color: "bg-green-400 hover:bg-green-500 text-black" },
  { word: "wann?", icon: WannIcon, color: "bg-pink-400 hover:bg-pink-500 text-black" },
  { word: "wie oft?", icon: Wie_oftIcon, color: "bg-purple-400 hover:bg-purple-500 text-black" },
  { word: "wie lange?", icon: Wie_langIcon, color: "bg-cyan-400 hover:bg-cyan-500 text-black" },
];

export default function QuestionInterface({ onWordSelect }) {
  const [currentView, setCurrentView] = useState('front');
  const [sliderValue, setSliderValue] = useState(0);

  return (
    <div className="grid grid-cols-10 gap-4">

      {/* LEFT: Anatomy Viewer */}
      <div className="col-span-4">
        <AnatomyViewer 
          currentView={currentView}
          onViewChange={setCurrentView}
          onBodyPartClick={onWordSelect}
        />
      </div>

  {/* MIDDLE: Questions + Responses */}
  <div className="col-span-3">
    <Card className="bg-white p-6 space-y-6 shadow-none">

      {/* Question Card (with icon) */}
      <Card 
        className="bg-gray-400 p-4 cursor-pointer hover:bg-gray-500 transition-colors text-black font-bold flex flex-col items-center shadow-none border-none"
        onClick={() => onWordSelect('Wie fühlst du dich seit der letzten Therapie?')}
      >
        <img src={GefühlIcon} alt="Gefühl" className="w-20 h-20 mb-2" />
        <span className="text-lg text-center">Wie fühlst du dich seit der letzten Therapie?</span>
      </Card>

      {/* === Response buttons (ActionButtons style) === */}
      <div className="grid grid-cols-2 gap-4">
        {responses.map((item) => (
          <Button
            key={item.word}
            onClick={() => onWordSelect(item.word)}
            className={`h-35 flex flex-col items-center justify-center text-lg font-semibold transition-all shadow-none border-none ${item.color}`}
          >
            {item.icon ? (
              <img src={item.icon} alt={item.word} className="w-20 h-20 mb-2" />
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
        onClick={() => onWordSelect('Möchtest du noch etwas fragen?')}
      >
        <img src={QuestionIcon} alt="QuestionIcon" className="w-20 h-20 mb-2" />
        <span className="text-lg text-center">Möchtest du noch etwas fragen?</span>
      </Card>

    </Card>
  </div>



      {/* RIGHT: Controls */}
      <div className="col-span-3">
        <Card className="bg-white border-2 border-gray-300 p-6 space-y-6">

          {/* Slider (same as ControlsPanel) */}
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-100 rounded-lg p-4 relative">
              <div className="absolute top-2 left-4 right-4 flex justify-between px-2">
                {[0,1,2,3,4,5,6,7,8,9,10].map((n) => (
                  <div key={n} className="flex flex-col items-center">
                    <div className="w-px h-2 bg-gray-400"></div>
                    <span className="text-xs text-gray-600 mt-1">{n}</span>
                  </div>
                ))}
              </div>

              <Slider
                value={[sliderValue]}
                onValueChange={(v) => setSliderValue(v[0])}
                min={0}
                max={10}
                step={1}
                className="w-full mt-8"
              />
            </div>
          </div>

          {/* Math buttons */}
          <div className="flex justify-center gap-3">
            <Button className="h-16 w-16 rounded-full bg-white border-4 border-gray-800 hover:bg-gray-100">
              <img src={AdditionIcon} alt="+" className="w-10 h-6" />
            </Button>
            <Button className="h-16 w-16 rounded-full bg-white border-4 border-gray-800 hover:bg-gray-100">
              <img src={SubtractionIcon} alt="-" className="w-10 h-10" />
            </Button>
            <Button className="h-16 w-16 rounded-full bg-white border-4 border-gray-800 hover:bg-gray-100">
              <img src={MultiplicationIcon} alt="×" className="w-8 h-6" />
            </Button>
          </div>

          {/* ? & ! */}
          <div className="flex gap-3 pt-2">
            <Button className="flex-1 h-20 bg-blue-200 hover:bg-blue-300 text-black font-bold flex flex-col items-center justify-center rounded-lg">
              <img src={QuestionIcon} alt="?" className="w-12 h-12" />
            </Button>
            <Button className="flex-1 h-20 bg-blue-200 hover:bg-blue-300 text-black font-bold flex flex-col items-center justify-center rounded-lg">
              <img src={ExclamationIcon} alt="!" className="w-12 h-12" />
            </Button>
          </div>

          {/* Directions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1 text-center">Richtungen</h3>
            <div className="grid grid-cols-3 grid-rows-2 gap-2 max-w-lg mx-auto p-4">
              {directions.map((dir) => {
                const Icon = dir.icon;
                return (
                  <Button
                    key={dir.value}
                    onClick={() => onWordSelect(dir.value)}
                    className={`h-25 w-20 ${dir.pos} bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-700`}
                    variant="outline"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Icon size={50} strokeWidth={4} />
                      <span className="text-sm">{dir.label}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

        </Card>
      </div>
    </div>
  );
}
