import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { DIRECTIONS, MOODS, OPERATORS, ROTATIONS, SPEEDS } from "../../data/vocabulary";

/** Numbers, operators, directions, tempo — shared by both tabs. */
export default function ControlsPanel({ sliderValue, onSliderChange, onSliderCommit, onSelect }) {
  return (
    <Card className="bg-white border-2 border-gray-300 h-full flex flex-col">
      <div className="flex-1 p-4 space-y-6 overflow-auto">
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-100 border border-black rounded-lg p-4 relative">
            <div className="absolute top-2 left-4 right-4 flex justify-between px-0.5">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <div key={num} className="flex flex-col items-center w-0 flex-grow text-center">
                  <div className="w-px h-2 bg-gray-400" />
                  <span className="text-sm font-bold text-gray-800 mt-1">{num}</span>
                </div>
              ))}
            </div>

            <Slider
              value={[sliderValue]}
              onValueChange={(value) => onSliderChange(value[0])}
              onValueCommit={(value) => onSliderCommit(value[0])}
              min={0}
              max={10}
              step={1}
              aria-label="Zahl"
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

        <div className="flex justify-center gap-4">
          {OPERATORS.map((entry) => (
            <div key={entry.value} className="flex flex-col items-center">
              <Button
                onClick={() => onSelect(entry)}
                title={entry.caption}
                aria-label={entry.caption}
                className="h-20 w-20 rounded-full bg-white border-4 border-gray-800 hover:bg-gray-100 flex items-center justify-center"
              >
                <img src={entry.icon} alt="" aria-hidden="true" className="w-8 h-8" />
              </Button>
              <span className="text-sm font-semibold mt-1 text-gray-700">{entry.caption}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          {MOODS.map((entry) => (
            <Button
              key={entry.value}
              onClick={() => onSelect(entry)}
              className="flex-1 h-24 bg-emerald-300 border border-black hover:bg-emerald-400 text-black font-bold flex flex-col items-center justify-center"
            >
              <img src={entry.icon} alt="" aria-hidden="true" className="w-10 h-12" />
              <span className="text-sm mt-1">{entry.caption}</span>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-3 grid-rows-2 gap-6 mx-auto place-items-center">
          {DIRECTIONS.map((entry) => (
            <Button
              key={entry.value}
              onClick={() => onSelect(entry)}
              className="p-0 flex items-center justify-center h-[100px] w-[100px] bg-green-100 border border-black hover:bg-green-300 text-gray-700"
            >
              <div className="flex flex-col items-center gap-1">
                <img src={entry.icon} alt="" aria-hidden="true" className="w-14 h-14 object-contain" />
                <span className="text-sm">{entry.value}</span>
              </div>
            </Button>
          ))}
        </div>

        <div className="flex gap-3 pt-3">
          {SPEEDS.map((entry) => (
            <Button
              key={entry.value}
              onClick={() => onSelect(entry)}
              className="flex-1 h-24 bg-emerald-300 border border-black hover:bg-emerald-400 text-black font-bold flex flex-col items-center justify-center"
            >
              <img src={entry.icon} alt="" aria-hidden="true" className="w-10 h-12" />
              <span className="text-lg">{entry.value}</span>
            </Button>
          ))}
        </div>

        <div className="flex gap-3">
          {ROTATIONS.map((entry) => (
            <Button
              key={entry.value}
              onClick={() => onSelect(entry)}
              className="flex-1 h-24 bg-green-200 border border-black hover:bg-green-300 text-black font-bold flex items-center justify-center gap-2"
            >
              <img src={entry.icon} alt="" aria-hidden="true" className="w-10 h-12" />
              <span className="text-lg">{entry.value}</span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
