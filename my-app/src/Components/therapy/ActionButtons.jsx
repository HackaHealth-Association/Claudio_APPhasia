import React from 'react';
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Zap, Eye, ArrowUpDown, MoveVertical, MoveDown, Repeat2, HelpCircle, AlertCircle, Move, Hand, RotateCw } from "lucide-react";
import SchmerzIcon from "../../assets/icons/Schmerz.png";
import ZuschauenIcon from "../../assets/icons/Zuschauen.png";
import BewegenIcon from "../../assets/icons/Bewegen.png";
import BeugenIcon from "../../assets/icons/Beugen.png";
import AnspannenIcon from "../../assets/icons/Anspannen.png";
import DrehenIcon from "../../assets/icons/Drehen.png";
import StreckenIcon from "../../assets/icons/Strecken.png";
import WiederholenIcon from "../../assets/icons/Wiederholen.png";
import ExclamationIcon from "../../assets/icons/Exclamation.png";
import QuestionIcon from "../../assets/icons/Question.png";

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
  { word: "Schmerz", color: "bg-red-600 hover:bg-red-700", icon: SchmerzIcon },
  { word: "zuschauen", color: "bg-green-700 hover:bg-green-800", icon: ZuschauenIcon },
  { word: "bewegen", color: "bg-pink-400 hover:bg-pink-500", icon: BewegenIcon },
  { word: "beugen", color: "bg-purple-400 hover:bg-purple-500", icon: BeugenIcon },
  { word: "strecken", color: "bg-cyan-500 hover:bg-cyan-600", icon: StreckenIcon },
  { word: "anspannen", color: "bg-orange-400 hover:bg-orange-500", icon: AnspannenIcon },
  { word: "drehen", color: "bg-blue-500 hover:bg-blue-600", icon: DrehenIcon },
  { word: "wiederholen", color: "bg-gray-400 hover:bg-gray-500", icon: WiederholenIcon } // until you have a PNG
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
              className={`w-full h-16 text-lg font-semibold text-white transition-all justify-start pl-17 ${
                // Add ring effect if this action is currently selected
                selectedAction === action.word
                  ? `${action.color} ring-4 ring-offset-2 ring-opacity-50`
                  : action.color
              }`}
            >
              {/* Icon on the left */}
              <img src={action.icon} alt={action.word} className="w-10 h-10 mr-2" />
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
            className="flex-1 h-16 bg-blue-300 hover:bg-blue-400 text-white font-bold"
            title="Fragezeichen hinzufügen"
          >
            <img src={QuestionIcon} alt="?" className="w-10 h-10" />
          </Button>

          {/* Exclamation Mark Button */}
          <Button
            onClick={() => onSpecialClick('!')}
            className="flex-1 h-16 bg-blue-300 hover:bg-blue-400 text-white font-bold"
            title="Ausrufezeichen hinzufügen"
          >
            <img src={ExclamationIcon} alt="!" className="w-10 h-10" />
          </Button>
        </div>
      </div>
    </Card>
  );
}