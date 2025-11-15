import React from 'react';
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Zap, Eye, ArrowUpDown, MoveVertical, MoveDown, RotateCcw, HelpCircle, AlertCircle } from "lucide-react";

/**
 * ActionButtons Component
 * 
 * PURPOSE: Provides action verbs and special symbols for building therapy phrases
 * 
 * FUNCTIONALITY:
 * - Displays 6 main action verbs (Schmerz, zuschauen, beugen, etc.)
 * - Provides 2 special symbol buttons (? and !)
 * - Each button adds its word/symbol to the phrase builder
 * - Visual feedback for selected actions
 * 
 * USE CASE EXAMPLES:
 * - Click "Schmerz" + "Knie" = "Schmerz Knie" (pain in knee)
 * - Click "beugen" + "Ellbogen" = "beugen Ellbogen" (bend elbow)
 * - Click "?" = adds question mark to phrase
 */

/**
 * ============================================================
 * ACTION VERBS CONFIGURATION
 * ============================================================
 * 
 * Each action object contains:
 * - word: The German verb/action word
 * - color: Tailwind CSS classes for button styling
 * - icon: Lucide icon component for visual representation
 */
const actions = [
  { 
    word: "Schmerz",           // Pain
    color: "bg-red-600 hover:bg-red-700", 
    icon: Zap 
  },
  { 
    word: "zuschauen",          // Watch/Observe
    color: "bg-green-700 hover:bg-green-800", 
    icon: Eye 
  },
  { 
    word: "beugen",             // Bend
    color: "bg-pink-400 hover:bg-pink-500", 
    icon: ArrowUpDown 
  },
  { 
    word: "Heben",              // Lift
    color: "bg-orange-400 hover:bg-orange-500", 
    icon: MoveVertical 
  },
  { 
    word: "senken",             // Lower
    color: "bg-cyan-500 hover:bg-cyan-600", 
    icon: MoveDown 
  },
  { 
    word: "Wiederholen",        // Repeat
    color: "bg-gray-600 hover:bg-gray-700", 
    icon: RotateCcw 
  }
];

export default function ActionButtons({ selectedAction, onActionClick, onSpecialClick }) {
  /**
   * PROPS:
   * - selectedAction: string - Currently selected action verb (for highlighting)
   * - onActionClick: function - Callback when an action button is clicked
   *                             Receives the action word as parameter
   * - onSpecialClick: function - Callback when special symbol (? or !) is clicked
   *                             Receives the symbol as parameter
   */

  return (
    <Card className="bg-white border-2 border-gray-300 h-full flex flex-col">
      {/* BUTTONS CONTAINER - Main action verbs and special symbols */}
      <div className="flex-1 p-4 space-y-3">
        
        {/* 
          ============================================================
          MAIN ACTION VERBS SECTION
          ============================================================
          Renders 6 action buttons dynamically from the actions array
        */}
        {actions.map((action) => {
          const Icon = action.icon; // Get the icon component
          
          return (
            <Button
              key={action.word}
              onClick={() => onActionClick(action.word)}
              className={`w-full h-16 text-lg font-semibold text-white transition-all ${
                // Add ring effect if this action is currently selected
                selectedAction === action.word
                  ? `${action.color} ring-4 ring-offset-2 ring-opacity-50`
                  : action.color
              }`}
            >
              {/* Icon on the left */}
              <Icon className="w-6 h-6 mr-2" />
              {/* Action word text */}
              {action.word}
            </Button>
          );
        })}
        
        {/* 
          ============================================================
          SPECIAL SYMBOLS SECTION
          ============================================================
          Two circular buttons for question mark (?) and exclamation mark (!)
          These are used to add punctuation to phrases
          
          EXAMPLES:
          - "Schmerz ?" = Pain? (asking about pain)
          - "Schmerz !" = Pain! (expressing pain urgency)
        */}
        <div className="flex gap-3 pt-2">
          {/* Question Mark Button */}
          <Button
            onClick={() => onSpecialClick('?')}
            className="flex-1 h-16 bg-blue-700 hover:bg-blue-800 text-white text-3xl font-bold"
            title="Fragezeichen hinzufügen"
          >
            <HelpCircle className="w-8 h-8" />
          </Button>
          
          {/* Exclamation Mark Button */}
          <Button
            onClick={() => onSpecialClick('!')}
            className="flex-1 h-16 bg-blue-700 hover:bg-blue-800 text-white text-3xl font-bold"
            title="Ausrufezeichen hinzufügen"
          >
            <AlertCircle className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </Card>
  );
}