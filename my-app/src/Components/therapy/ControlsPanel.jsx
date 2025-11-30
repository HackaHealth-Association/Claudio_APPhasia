import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { Slider } from "../../Components/ui/slider";

import MultiplicationIcon from "../../assets/icons/Multiplication.png";
import SubtractionIcon from "../../assets/icons/Subtraction.png";
import AdditionIcon from "../../assets/icons/Addition.png";
import ExclamationIcon from "../../assets/icons/Exclamation.png";
import QuestionIcon from "../../assets/icons/Question.png";
import LangsamIcon from "../../assets/icons/Langsam.png";
import SchnellIcon from "../../assets/icons/Schnell.png";

import UpArrow from "../../assets/icons/up_arrow.png";
import DownArrow from "../../assets/icons/down_arrow.png";
import LeftArrow from "../../assets/icons/left_arrow.png";
import RightArrow from "../../assets/icons/right_arrow.png";
import TwoSideArrow from "../../assets/icons/two_side_arrow.png";

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
  onDirectionClick,
  onSpeedClick}) {
  return (
    <Card className="bg-white border-2 border-gray-300 h-full flex flex-col">
      <div className="flex-1 p-4 space-y-6 overflow-auto">

        {/* === SLIDER === */}
        <div>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-100 border border-black rounded-lg p-4 relative">
              <div className="absolute top-2 left-4 right-4 flex justify-between px-0.5">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <div key={num} className="flex flex-col items-center w-0 flex-grow text-center">
                    <div className="w-px h-2 bg-gray-400"></div>
                    <span className="text-sm font-bold text-gray-800 mt-1">{num}</span>
                  </div>
                ))}
              </div>

              <Slider
                value={[slider1Value]}
                onValueChange={(value) => onSlider1Change(value[0])}
                onValueCommit={(value) => onSlider1Commit(value[0])}
                min={0}
                max={10}
                step={1}
                className="w-full mt-10
                  [&_[role='slider']]:h-8
                  [&_[role='slider']]:w-8
                  [&_[role='slider']]:bg-white
                  [&_[role='slider']]:border-2
                  [&_[role='slider']]:border-black
                "
              />
            </div>
          </div>
        </div>

        {/* === MATH BUTTONS === */}
        <div className="flex justify-center gap-4">
          <MathButton icon={SubtractionIcon} label="minus" value="-" onClick={onSignClick} />
          <MathButton icon={AdditionIcon} label="plus" value="+" onClick={onSignClick} />
          <MathButton icon={MultiplicationIcon} label="mal" value="*" onClick={onSignClick} />
        </div>

        {/* === ? and ! === */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={() => onSignClick('?')}
            className="flex-1 h-24 bg-emerald-300 border border-black hover:bg-emerald-400 text-black font-bold flex flex-col items-center justify-center"
          >
            <img src={QuestionIcon} alt="?" className="w-10 h-12" />
            <span className="text-sm mt-1">Frage</span>
          </Button>

          <Button
            onClick={() => onSignClick('!')}
            className="flex-1 h-24 bg-emerald-300 border border-black hover:bg-emerald-400 text-black font-bold flex flex-col items-center justify-center"
          >
            <img src={ExclamationIcon} alt="!" className="w-10 h-12" />
            <span className="text-sm mt-1">Aussage</span>
          </Button>
        </div>

        {/* === DIRECTIONS === */}
        <div className="grid grid-cols-3 grid-rows-2 gap-6 mx-auto place-items-center">
          {directions.map((dir) => (
            <Button
              key={dir.value}
              onClick={() => onDirectionClick(dir.value)}
              className="p-0 flex items-center justify-center h-[100px] w-[100px] bg-green-100 border border-black hover:bg-green-300 text-gray-700"
            >
              <div className="flex flex-col items-center gap-1">
                <img src={dir.icon} alt={dir.label} className="w-14 h-14 object-contain" />
                <span className="text-sm">{dir.label}</span>
              </div>
            </Button>
          ))}
        </div>

        {/* === SPEED BUTTONS === */}
        <div className="flex gap-3 pt-3">
          <Button
            onClick={() => onSpeedClick("langsam")}
            className="flex-1 h-24 bg-emerald-300 border border-black hover:bg-emerald-400 text-black font-bold flex flex-col items-center justify-center"
          >
            <img src={LangsamIcon} alt="langsam" className="w-10 h-12" />
            <span className="text-lg">langsam</span>
          </Button>

          <Button
            onClick={() => onSpeedClick("schnell")}
            className="flex-1 h-24 bg-emerald-300 border border-black hover:bg-emerald-400 text-black font-bold flex flex-col items-center justify-center"
          >
            <img src={SchnellIcon} alt="schnell" className="w-10 h-12" />
            <span className="text-lg">schnell</span>
          </Button>
        </div>

      </div>
    </Card>
  );
}

function MathButton({ icon, label, value, onClick }) {
  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={() => onClick(value)}
        className="h-20 w-20 rounded-full bg-white border-4 border-gray-800 hover:bg-gray-100 flex items-center justify-center"
      >
        <img src={icon} alt={label} className="w-8 h-8" />
      </Button>
      <span className="text-sm font-semibold mt-1 text-gray-700">{label}</span>
    </div>
  );
}
