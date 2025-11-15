import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Hand, StopCircle, Circle, Flame } from "lucide-react";

const actions = [
  { word: "pain", icon: Flame, color: "bg-red-500 hover:bg-red-600" },
  { word: "move", icon: ArrowRight, color: "bg-blue-500 hover:bg-blue-600" },
  { word: "stop", icon: StopCircle, color: "bg-orange-500 hover:bg-orange-600" },
  { word: "bend", icon: Circle, color: "bg-green-500 hover:bg-green-600" },
  { word: "lift", icon: Hand, color: "bg-purple-500 hover:bg-purple-600" },
  { word: "stretch", icon: ArrowRight, color: "bg-teal-500 hover:bg-teal-600" },
  { word: "relax", icon: Hand, color: "bg-indigo-500 hover:bg-indigo-600" },
  { word: "press", icon: Hand, color: "bg-pink-500 hover:bg-pink-600" }
];

export default function ActionWords({ onActionClick, selectedAction }) {
  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-emerald-100">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-emerald-600" />
        <h2 className="text-xl font-bold text-gray-800">Therapy Actions</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">Select an action word to combine with a body part</p>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const isSelected = selectedAction === action.word;
          
          return (
            <Button
              key={action.word}
              onClick={() => onActionClick(action.word)}
              className={`h-20 text-lg font-bold text-white transition-all ${
                isSelected 
                  ? `${action.color} ring-4 ring-offset-2 ring-opacity-50 scale-105` 
                  : `${action.color} opacity-90`
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon className="w-6 h-6" />
                <span className="capitalize">{action.word}</span>
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}