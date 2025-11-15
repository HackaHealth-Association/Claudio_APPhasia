import React from 'react';
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Slider } from "../../Components/ui/slider";
import { Plus, Minus, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, MoveUp, MoveDown } from "lucide-react";

/**
 * ControlsPanel Component
 * 
 * PURPOSE: Provides numerical inputs and directional controls for therapy instructions
 * 
 * SECTIONS:
 * 1. Two sliders (0-10) - for repetition counts, pain levels, angles, etc.
 * 2. Plus/Minus buttons - for mathematical operations or adding/subtracting
 * 3. 6 directional arrows - for movement directions (up, down, left, right, forward, back)
 * 
 * USE CASE EXAMPLES:
 * - Slider 1 at 5 + "Wiederholen" = "Repeat 5 times"
 * - "Heben" + "oben" = "Lift upward"
 * - "Schmerz" + Slider 1 at 7 = "Pain level 7"
 */

/**
 * ============================================================
 * DIRECTIONAL ARROWS CONFIGURATION
 * ============================================================
 * 
 * 6 directions for movement instructions:
 * - oben (up), unten (down)
 * - links (left), rechts (right)
 * - vor (forward), zurück (backward)
 * 
 * Each direction has:
 * - label: German word for the direction
 * - icon: Lucide icon component
 * - value: Value sent to parent component
 * - pos: Grid position for 3x3 layout
 */
const directions = [
  { label: "oben", icon: ArrowUp, value: "oben", pos: "col-start-2 row-start-1" },       // Top center
  { label: "unten", icon: ArrowDown, value: "unten", pos: "col-start-2 row-start-3" },   // Bottom center
  { label: "links", icon: ArrowLeft, value: "links", pos: "col-start-1 row-start-1" },   // Top left
  { label: "rechts", icon: ArrowRight, value: "rechts", pos: "col-start-3 row-start-1" }, // Top right
  { label: "vor", icon: MoveUp, value: "vor", pos: "col-start-1 row-start-3" },          // Bottom left
  { label: "zurück", icon: MoveDown, value: "zurück", pos: "col-start-3 row-start-3" }   // Bottom right
];

export default function ControlsPanel({ 
  slider1Value,      // Current value of slider (0-10)
  onSlider1Change,   // Callback when slider value changes
  onSignClick,       // Callback when +/- button is clicked
  onDirectionClick   // Callback when direction arrow is clicked
}) {
  /**
   * PROPS EXPLANATION:
   * - slider1Value/slider2Value: Numbers 0-10 representing current slider positions
   * - onSlider1Change/onSlider2Change: Called with new value when user moves slider
   * - onSignClick: Called with '+' or '-' when plus/minus buttons clicked
   * - onDirectionClick: Called with direction value when arrow button clicked
   */

  return (
    <Card className="bg-white border-2 border-gray-300 h-full flex flex-col">
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        
        {/* 
          ============================================================
          SECTION 1: NUMBER SLIDER (0-10)
          ============================================================
          Single horizontal slider for numerical input with visible tick marks
          
          COMMON USES:
          - Pain level (0 = no pain, 10 = extreme pain)
          - Repetition count (how many times to repeat)
        */}
        <div>
          {/* SLIDER - Number input with tick marks */}
          <div className="flex items-center gap-4">
            {/* Minimum value label */}
            <span className="text-2xl font-bold text-gray-700 min-w-[40px]">0</span>
            
            {/* Slider container with tick marks */}
            <div className="flex-1 bg-gray-100 rounded-lg p-4 relative">
              {/* Tick marks for numbers 1-9 */}
              <div className="absolute top-2 left-4 right-4 flex justify-between px-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <div key={num} className="flex flex-col items-center">
                    <div className="w-px h-2 bg-gray-400"></div>
                    <span className="text-xs text-gray-600 mt-1">{num}</span>
                  </div>
                ))}
              </div>
              
              <Slider
                value={[slider1Value]}
                onValueChange={(value) => onSlider1Change(value[0])}
                min={0}
                max={10}
                step={1}
                className="w-full mt-8"
              />
            </div>
            
            {/* Maximum value label */}
            <span className="text-2xl font-bold text-gray-700 min-w-[40px]">10</span>
          </div>
        </div>

        {/* 
          ============================================================
          SECTION 2: PLUS/MINUS BUTTONS
          ============================================================
          Two circular buttons for mathematical operations
          
          USES:
          - Adding sets: "3 + 2" (3 plus 2 more repetitions)
          - Subtracting: "10 - 5" (reduce by 5)
          - General mathematical expressions in therapy instructions
        */}
        <div className="flex justify-center gap-4">
          {/* PLUS BUTTON */}
          <Button
            onClick={() => onSignClick('+')}
            className="h-16 w-16 rounded-full bg-white border-4 border-gray-800 hover:bg-gray-100 text-gray-800 text-3xl font-bold"
            variant="outline"
            title="Plus hinzufügen"
          >
            <Plus className="w-8 h-8" />
          </Button>
          
          {/* MINUS BUTTON */}
          <Button
            onClick={() => onSignClick('-')}
            className="h-16 w-16 rounded-full bg-white border-4 border-gray-800 hover:bg-gray-100 text-gray-800 text-3xl font-bold"
            variant="outline"
            title="Minus hinzufügen"
          >
            <Minus className="w-8 h-8" />
          </Button>
        </div>

        {/* 
          ============================================================
          SECTION 3: DIRECTIONAL ARROWS (6 DIRECTIONS)
          ============================================================
          3x3 grid layout with 6 direction buttons
          
          GRID LAYOUT:
          [empty]  [oben]    [empty]
          [links]  [empty]   [rechts]
          [vor]    [unten]   [zurück]
          
          USES:
          - Movement instructions: "Heben oben" (lift upward)
          - Direction of pain: "Schmerz links" (pain on left side)
          - Exercise directions: "beugen rechts" (bend to right)
        */}
        <div>
          {/* Section title */}
          <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">Richtungen</h3>
          
          {/* 3x3 Grid container */}
          <div className="grid grid-cols-3 grid-rows-3 gap-2 max-w-xs mx-auto">
            {/* Render all 6 direction buttons */}
            {directions.map((dir) => {
              const Icon = dir.icon;  // Get icon component
              
              return (
                <Button
                  key={dir.value}
                  onClick={() => onDirectionClick(dir.value)}
                  className={`h-14 ${dir.pos} bg-white border-2 border-gray-300 hover:bg-gray-100 text-gray-700`}
                  variant="outline"
                  title={`Richtung: ${dir.label}`}
                >
                  {/* Icon and label stacked vertically */}
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