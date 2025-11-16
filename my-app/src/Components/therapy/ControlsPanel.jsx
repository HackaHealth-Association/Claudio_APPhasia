import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Slider } from "../../Components/ui/slider";

import MultiplicationIcon from "../../assets/icons/Multiplication.png";
import SubtractionIcon from "../../assets/icons/Subtraction.png";
import AdditionIcon from "../../assets/icons/Addition.png";
import ExclamationIcon from "../../assets/icons/Exclamation.png";
import QuestionIcon from "../../assets/icons/Question.png";

import UpArrow from "../../assets/icons/up_arrow.png";
import DownArrow from "../../assets/icons/down_arrow.png";
import LeftArrow from "../../assets/icons/left_arrow.png";
import RightArrow from "../../assets/icons/right_arrow.png";
import TwoSideArrow from "../../assets/icons/two_side_arrow.png";


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
  { label: "links",  icon: LeftArrow,  value: "links"  },
  { label: "oben",   icon: UpArrow,    value: "oben"   },
  { label: "rechts", icon: RightArrow, value: "rechts" },
  { label: "vor",    icon: TwoSideArrow, value: "vor" },
  { label: "unten",  icon: DownArrow, value: "unten" },
  { label: "zurück", icon: TwoSideArrow, value: "zurück" }
];

export default function ControlsPanel({
  slider1Value,
  onSlider1Change,
  onSlider1Commit,
  onSignClick,
  onDirectionClick
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
            {/* <span className="text-2xl font-bold text-gray-700 min-w-[40px]">0</span> */}
            
            {/* Slider container with tick marks */}
            <div className="flex-1 bg-gray-100 border border-black rounded-lg p-4 relative">
              {/* Tick marks for numbers 1-9 */}
              <div className="absolute top-2 left-4 right-4 flex justify-between px-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <div key={num} className="flex flex-col items-center">
                    <div className="w-px h-2 bg-gray-400"></div>
                    <span className="text-lg font-bold text-gray-800 mt-1">{num}</span>
                  </div>
                ))}
              </div>

             <Slider
                value={[slider1Value]}
                onValueChange={(value) => onSlider1Change(value[0])}
                onValueCommit={(value) => {
                  onSlider1Commit(value[0]);   // send final value to parent
                  setTimeout(() => onSlider1Change(0), 500); // reset slider after a short delay
                }}
                min={0}
                max={10}
                step={1}
                className="w-full mt-10"
              />
            </div>
            {/* Maximum value label */}
            {/* <span className="text-2xl font-bold text-gray-700 min-w-[40px]">10</span> */}
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
          
          {/* MINUS BUTTON */}
          <div className="flex flex-col items-center">
          <Button
            onClick={() => onSignClick('-')}
            className="h-20 w-20 rounded-full bg-white border-4 border-gray-800 hover:bg-gray-100 flex items-center justify-center"
            variant="outline"
            title="Minus hinzufügen"
          >
            <img src={SubtractionIcon} alt="-" className="w-10 h-10" />
          </Button>
          {/* Label under the circle */}
          <span className="text-sm font-semibold mt-1 text-gray-700">minus</span>
        </div>

          {/* PLUS BUTTON */}
          <div className="flex flex-col items-center">
          <Button
            onClick={() => onSignClick('+')}
            className="h-20 w-20 rounded-full bg-white border-4 border-gray-800 hover:bg-gray-100 flex items-center justify-center"
            variant="outline"
            title="Plus hinzufügen"
          >
            <img src={AdditionIcon} alt="+" className="w-8 h-8" />
          </Button>

          {/* Label under the circle */}
          <span className="text-sm font-semibold mt-1 text-gray-700">plus</span>
        </div>

          <div className="flex flex-col items-center">
          <Button
            onClick={() => onSignClick('*')}
            className="h-20 w-20 rounded-full bg-white border-4 border-gray-800 hover:bg-gray-100 flex items-center justify-center"
            variant="outline"
            title="Multiplikation hinzufügen"
          >
            <img src={MultiplicationIcon} alt="×" className="w-6 h-6" />
          </Button>

          {/* Label under the circle */}
          <span className="text-sm font-semibold mt-1 text-gray-700">mal</span>
        </div>

        </div>

        {/* ? & ! buttons */}
        <div className="flex gap-3 pt-2">
          <Button onClick={() => onSignClick('?')} className="flex-1 h-20 bg-blue-200 border-1 border-black hover:bg-blue-300 border-black text-white font-bold flex items-center justify-center" title="Fragezeichen hinzufügen"><img src={QuestionIcon} alt="?" className="w-10 h-12" /></Button>
          <Button onClick={() => onSignClick('!')} className="flex-1 h-20 bg-blue-200 border-1 border-black hover:bg-blue-300 text-white font-bold flex items-center justify-center" title="Ausrufezeichen hinzufügen"><img src={ExclamationIcon} alt="!" className="w-10 h-12" /></Button>
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
          {/* <h3 className="text-sm font-semibold text-gray-600 mb-1 text-center">Richtungen</h3> */}
          
          {/* 3x3 Grid container */}
          <div className="grid grid-cols-3 grid-rows-2 gap-6 p-0 mx-auto place-items-center">
            {directions.map((dir) => (
              <Button
                key={dir.value}
                onClick={() => onDirectionClick(dir.value)}
                className="p-0 flex items-center justify-center h-[100px] w-[100px] 
                          bg-green-100 border-black hover:bg-green-200 text-gray-700"
                variant="outline"
                title={`Richtung: ${dir.label}`}
              >
                <div className="flex flex-col items-center gap-1">
                  <img
                    src={dir.icon}
                    alt={dir.label}
                    className="w-14 h-14 object-contain"
                  />
                  <span className="text-sm">{dir.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}