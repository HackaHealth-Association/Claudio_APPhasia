import React, { useState } from 'react';
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Slider } from "../../Components/ui/slider";
import { HelpCircle, AlertCircle, X, Plus, Minus } from "lucide-react";
import AnatomyViewer from './AnatomyViewer';

/**
 * QuestionInterface Component
 * 
 * PURPOSE: Simple question-based interface for quick communication
 * Presents pre-defined questions and response options as clickable boxes
 */
export default function QuestionInterface({ onWordSelect }) {
  const [currentView, setCurrentView] = useState('front');

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Left side - Body anatomy with navigation */}
      <div className="col-span-2">
        <AnatomyViewer 
          currentView={currentView}
          onViewChange={setCurrentView}
          onBodyPartClick={onWordSelect}
        />
      </div>

      {/* Middle - Questions and options */}
      <div className="col-span-7">
        <Card className="bg-white border-2 text-gray-500 p-6 space-y-4">
          {/* Main question - clickable */}
          <Card 
            className="bg-green-700 hover:bg-green-800 p-4 cursor-pointer transition-colors text-white font-bold"
            onClick={() => onWordSelect('Wie hast du dich seit der letzten Therapie gefühlt?')}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">Wie hast du dich seit der letzten Therapie gefühlt?</span>
              <span className="text-2xl">😊 😢</span>
            </div>
          </Card>

          {/* Response options row 1 */}
          <div className="flex gap-3">
            <Button 
              onClick={() => onWordSelect('Schmerz')}
              className="h-16 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold"
            >
              Schmerz ⚡
            </Button>
            <Button 
              onClick={() => onWordSelect('Übungen')}
              className="h-16 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold"
            >
              Übungen 🏋
            </Button>
          </div>

          {/* Response options row 2 */}
          <div className="flex gap-3">
            <Button 
              onClick={() => onWordSelect('stumpf')}
              className="h-16 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold"
            >
              stumpf 🧷
            </Button>
            <Button 
              onClick={() => onWordSelect('spitz')}
              className="h-16 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold"
            >
              spitz 📌
            </Button>
          </div>

          {/* Response options row 3 */}
          <div className="flex gap-3">
            <Button 
              onClick={() => onWordSelect('wo')}
              className="h-16 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold"
            >
              wo? 📍
            </Button>
            <Button 
              onClick={() => onWordSelect('wie oft?')}
              className="h-16 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold"
            >
              wie oft? 🔂
            </Button>
            <Button 
              onClick={() => onWordSelect('wie lange?')}
              className="h-16 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold"
            >
              wie lange? ⌛️
            </Button>
            <Button 
              onClick={() => onWordSelect('wann?')}
              className="h-16 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold"
            >
              wann? 🕐 
            </Button>
          </div>

          {/* Second question - clickable */}
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

      {/* Right side - Controls */}
      <div className="col-span-3">
        <Card className="bg-white border-2 border-gray-300 p-6 space-y-6">
          {/* Slider */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">0</span>
            <div className="flex-1">
              <Slider defaultValue={[0]} min={0} max={10} step={1} />
            </div>
            <span className="text-xl font-bold">10</span>
          </div>

          {/* Plus/Minus/X buttons */}
          <div className="flex justify-center gap-3">
            <Button 
              onClick={() => onWordSelect('+')}
              className="h-16 w-16 rounded-full border-4 border-gray-800 text-3xl"
              variant="outline"
            >
              <Plus className="w-8 h-8" />
            </Button>
            <Button 
              onClick={() => onWordSelect('-')}
              className="h-16 w-16 rounded-full border-4 border-gray-800 text-3xl"
              variant="outline"
            >
              <Minus className="w-8 h-8" />
            </Button>
            <Button 
              onClick={() => onWordSelect('×')}
              className="h-16 w-16 rounded-full border-4 border-gray-800 text-3xl"
              variant="outline"
            >
              <X className="w-8 h-8" />
            </Button>
          </div>

          {/* Question and exclamation */}
          <div className="flex gap-3">
            <Button 
              onClick={() => onWordSelect('?')}
              className="flex-1 h-20 bg-blue-700 hover:bg-blue-800 text-white"
            >
              <HelpCircle className="w-12 h-12" />
            </Button>
            <Button 
              onClick={() => onWordSelect('!')}
              className="flex-1 h-20 bg-blue-700 hover:bg-blue-800 text-white"
            >
              <AlertCircle className="w-12 h-12" />
            </Button>
          </div>

          {/* Directions */}
          <div>
            <h3 className="text-sm font-semibold mb-2 text-center">Richtungen</h3>
            <div className="grid grid-cols-3 grid-rows-3 gap-1">
              <div></div>
              <Button onClick={() => onWordSelect('oben')} variant="outline" className="h-12 text-xs">oben</Button>
              <div></div>
              <Button onClick={() => onWordSelect('links')} variant="outline" className="h-12 text-xs">links</Button>
              <div></div>
              <Button onClick={() => onWordSelect('rechts')} variant="outline" className="h-12 text-xs">rechts</Button>
              <Button onClick={() => onWordSelect('unten')} variant="outline" className="h-12 text-xs">unten</Button>
              <div></div>
              <Button onClick={() => onWordSelect('zurück')} variant="outline" className="h-12 text-xs">zurück</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}