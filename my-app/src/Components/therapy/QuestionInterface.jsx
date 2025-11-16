import React, { useState } from 'react';
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Slider } from "../../Components/ui/slider";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, MoveVertical } from "lucide-react";
import AnatomyViewer from './AnatomyViewer';

// Icons
import MultiplicationIcon from "../../assets/icons/Multiplication.png";
import SubtractionIcon from "../../assets/icons/Subtraction.png";
import AdditionIcon from "../../assets/icons/Addition.png";
import ExclamationIcon from "../../assets/icons/Exclamation.png";
import QuestionIcon from "../../assets/icons/Question.png";

/**
 * Directions config (same as ControlsPanel)
 */
const directions = [
  { label: "oben", icon: ArrowUp, value: "oben", pos: "col-start-2 row-start-1" },
  { label: "unten", icon: ArrowDown, value: "unten", pos: "col-start-2 row-start-2" },
  { label: "links", icon: ArrowLeft, value: "links", pos: "col-start-1 row-start-1" },
  { label: "rechts", icon: ArrowRight, value: "rechts", pos: "col-start-3 row-start-1" },
  { label: "vor", icon: MoveVertical, value: "vor", pos: "col-start-1 row-start-2" },
  { label: "zurück", icon: MoveVertical, value: "zurück", pos: "col-start-3 row-start-2" }
];

export default function QuestionInterface({ onWordSelect }) {
  const [currentView, setCurrentView] = useState('front');
  const [sliderValue, setSliderValue] = useState(0);

  return (
    <div className="grid grid-cols-10 gap-4">

      {/* LEFT: Body Viewer */}
      <div className="col-span-3">
        <AnatomyViewer 
          currentView={currentView}
          onViewChange={setCurrentView}
          onBodyPartClick={onWordSelect}
        />
      </div>

      {/* MIDDLE: Questions */}
      <div className="col-span-4">
        <Card className="bg-white border-2 border-gray-300 text-gray-500 p-6 space-y-15">

          {/* Question */}
          <Card 
            className="bg-green-700 hover:bg-green-800 p-4 cursor-pointer transition-colors text-white font-bold"
            onClick={() => onWordSelect('Wie hast du dich seit der letzten Therapie gefühlt?')}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">Wie hast du dich seit der letzten Therapie gefühlt?</span>
              <span className="text-2xl">😊 😢</span>
            </div>
          </Card>

          {/* Response buttons */}
          <div className="flex gap-3">
            <Button onClick={() => onWordSelect('Schmerz')} className="h-16 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold">Schmerz ⚡</Button>
            <Button onClick={() => onWordSelect('Übungen')} className="h-16 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold">Übungen 🏋</Button>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => onWordSelect('stumpf')} className="h-16 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold">stumpf 🧷</Button>
            <Button onClick={() => onWordSelect('spitz')} className="h-16 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold">spitz 📌</Button>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => onWordSelect('wo')} className="h-16 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold">wo? 📍</Button>
            <Button onClick={() => onWordSelect('wie oft?')} className="h-16 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold">wie oft? 🔂</Button>
            <Button onClick={() => onWordSelect('wie lange?')} className="h-16 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold">wie lange? ⌛️</Button>
            <Button onClick={() => onWordSelect('wann?')} className="h-16 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold">wann? 🕐</Button>
          </div>

          <Card 
            className="bg-green-700 p-4 cursor-pointer hover:bg-green-800 transition-colors text-white font-bold"
            onClick={() => onWordSelect('Möchtest du noch etwas fragen?')}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">Möchtest du noch etwas fragen?</span>
              <span className="text-2xl">❓</span>
            </div>
          </Card>
        </Card>
      </div>

      {/* RIGHT: Controls */}
      <div className="col-span-3">
        <Card className="bg-white border-2 border-gray-300 p-6 space-y-6">

          {/* Slider (MATCHES ControlsPanel) */}
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-100 rounded-lg p-4 relative">
              <div className="absolute top-2 left-4 right-4 flex justify-between px-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <div key={num} className="flex flex-col items-center">
                    <div className="w-px h-2 bg-gray-400"></div>
                    <span className="text-xs text-gray-600 mt-1">{num}</span>
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

          {/* +/- × buttons */}
          <div className="flex justify-center gap-3">
            <Button onClick={() => onWordSelect('+')} className="h-16 w-16 rounded-full bg-white border-4 border-gray-800 hover:bg-gray-100 flex items-center justify-center" variant="outline"><img src={AdditionIcon} alt="+" className="w-10 h-6" /></Button>
            <Button onClick={() => onWordSelect('-')} className="h-16 w-16 rounded-full bg-white border-4 border-gray-800 hover:bg-gray-100 flex items-center justify-center" variant="outline"><img src={SubtractionIcon} alt="-" className="w-10 h-10" /></Button>
            <Button onClick={() => onWordSelect('×')} className="h-16 w-16 rounded-full bg-white border-4 border-gray-800 hover:bg-gray-100 flex items-center justify-center" variant="outline"><img src={MultiplicationIcon} alt="×" className="w-6 h-6" /></Button>
          </div>

          {/* ? & ! buttons */}
          <div className="flex gap-3 pt-2">
            <Button onClick={() => onWordSelect('?')} className="flex-1 h-20 bg-blue-300 hover:bg-blue-400 text-white font-bold flex items-center justify-center" title="Fragezeichen hinzufügen"><img src={QuestionIcon} alt="?" className="w-12 h-12" /></Button>
            <Button onClick={() => onWordSelect('!')} className="flex-1 h-20 bg-blue-300 hover:bg-blue-400 text-white font-bold flex items-center justify-center" title="Ausrufezeichen hinzufügen"><img src={ExclamationIcon} alt="!" className="w-12 h-12" /></Button>
          </div>

          {/* Directions (MATCHES ControlsPanel) */}
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
                    title={dir.label}
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
