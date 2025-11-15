import React from 'react';
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Slider } from "../../Components/ui/slider";
import { 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
  MoveVertical, MoveHorizontal,
  Plus, Minus, HelpCircle, AlertCircle
} from "lucide-react";

const verbs = [
  { word: "beugen", color: "bg-blue-500 hover:bg-blue-600" },
  { word: "strecken", color: "bg-green-500 hover:bg-green-600" },
  { word: "drehen", color: "bg-purple-500 hover:bg-purple-600" },
  { word: "schmerzen", color: "bg-red-500 hover:bg-red-600" },
  { word: "relax", color: "bg-teal-500 hover:bg-teal-600" },
  { word: "zuschauen", color: "bg-orange-500 hover:bg-orange-600" },
  { word: "wiederholen", color: "bg-indigo-500 hover:bg-indigo-600" }
];

const directions = [
  { label: "oben", icon: ArrowUp, value: "oben" },
  { label: "unten", icon: ArrowDown, value: "unten" },
  { label: "links", icon: ArrowLeft, value: "links" },
  { label: "rechts", icon: ArrowRight, value: "rechts" },
  { label: "vor", icon: MoveVertical, value: "vor" },
  { label: "zurück", icon: MoveHorizontal, value: "zurück" }
];

export default function ControlPanel({ 
  selectedVerb, 
  onVerbClick, 
  onSpecialClick,
  onNumberChange,
  number1,
  number2,
  onSignClick,
  onDirectionClick,
  selectedDirections
}) {
  return (
    <Card className="h-full flex flex-col bg-white shadow-lg border-2 border-green-200">
      <div className="p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
        <h2 className="text-xl font-bold text-gray-800">Steuerung</h2>
        <p className="text-sm text-gray-600">Wählen Sie Verben, Zahlen und Richtungen</p>
      </div>
      
      <div className="flex-1 p-6 overflow-auto space-y-6">
        {/* Verbs */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Verben</h3>
          <div className="grid grid-cols-2 gap-2">
            {verbs.map((verb) => (
              <Button
                key={verb.word}
                onClick={() => onVerbClick(verb.word)}
                className={`h-14 text-base font-semibold text-white transition-all ${
                  selectedVerb === verb.word 
                    ? `${verb.color} ring-4 ring-offset-2 ring-opacity-50 scale-105` 
                    : `${verb.color} opacity-90`
                }`}
              >
                {verb.word}
              </Button>
            ))}
          </div>
        </div>

        {/* Special Buttons */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Spezial</h3>
          <div className="flex gap-3">
            <Button
              onClick={() => onSpecialClick('question')}
              className="flex-1 h-16 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full"
              size="lg"
            >
              <HelpCircle className="w-8 h-8" />
            </Button>
            <Button
              onClick={() => onSpecialClick('exclamation')}
              className="flex-1 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full"
              size="lg"
            >
              <AlertCircle className="w-8 h-8" />
            </Button>
          </div>
        </div>

        {/* Number Sliders */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Zahlen</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-600">Zahl 1:</label>
                <span className="text-2xl font-bold text-blue-600">{number1}</span>
              </div>
              <Slider
                value={[number1]}
                onValueChange={(value) => onNumberChange(1, value[0])}
                min={0}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-600">Zahl 2:</label>
                <span className="text-2xl font-bold text-green-600">{number2}</span>
              </div>
              <Slider
                value={[number2]}
                onValueChange={(value) => onNumberChange(2, value[0])}
                min={0}
                max={9}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Plus/Minus */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Operatoren</h3>
          <div className="flex gap-3">
          <Button
              onClick={() => onSignClick('plus')}
              className="flex-1 h-14 bg-green-600 hover:bg-red-700 text-white text-2xl font-bold"
            >
              <Plus className="w-6 h-6 mr-2" />
              Plus
            </Button>
            
            <Button
              onClick={() => onSignClick('minus')}
              className="flex-1 h-14 bg-red-600 hover:bg-green-700 text-white text-2xl font-bold"
            >
              <Minus className="w-6 h-6 mr-2" />
              Minus
            </Button>
          </div>
        </div>

        {/* Directions */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Richtungen</h3>
          <div className="grid grid-cols-3 gap-2">
            {directions.map((dir) => {
              const Icon = dir.icon;
              const isSelected = selectedDirections.includes(dir.value);
              return (
                <Button
                  key={dir.value}
                  onClick={() => onDirectionClick(dir.value)}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-14 ${
                    isSelected 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white ring-2 ring-indigo-400' 
                      : 'border-2 border-gray-300 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{dir.label}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}