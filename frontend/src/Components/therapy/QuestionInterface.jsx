import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import AnatomyViewer from "./AnatomyViewer";
import ControlsPanel from "./ControlsPanel";
import ThreePanelLayout from "../layout/ThreePanelLayout";
import { PHRASE_BUTTONS, RESPONSE_BUTTONS } from "../../data/vocabulary";

/** The "Fragen" tab: whole questions plus symptom and topic words. */
export default function QuestionInterface({
  onSelect,
  onBodyPartSelect,
  sliderValue,
  onSliderChange,
  onSliderCommit,
}) {
  const [currentView, setCurrentView] = useState("front");
  const [selected, setSelected] = useState(null);

  const choose = (entry) => {
    setSelected(entry.id ?? entry.value);
    onSelect(entry);
  };

  return (
    <ThreePanelLayout
      left={
        <AnatomyViewer
          currentView={currentView}
          onViewChange={setCurrentView}
          onBodyPartClick={onBodyPartSelect}
        />
      }
      middle={
        <Card className="bg-white border-2 border-gray-300 p-6 space-y-6 shadow-none">
          <div className="grid grid-cols-2 gap-4">
            {PHRASE_BUTTONS.map((entry) => (
              <Card
                key={entry.id}
                onClick={() => choose(entry)}
                title={entry.value}
                className={`bg-gray-400 p-4 cursor-pointer hover:bg-gray-500 transition-colors
                  text-black font-bold flex flex-col items-center shadow-none border-none
                  ${selected === entry.id ? "ring-4 ring-offset-2 ring-opacity-50" : ""}`}
              >
                <img src={entry.icon} alt="" aria-hidden="true" className="w-20 h-20 mb-2" />
                <span className="text-lg text-center">{entry.label}</span>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {RESPONSE_BUTTONS.map((entry) => (
              <Button
                key={entry.value}
                onClick={() => choose(entry)}
                className={`h-35 flex flex-col items-center justify-center text-lg font-semibold
                  transition-all shadow-none border-none ${entry.color}
                  ${selected === entry.value ? "ring-4 ring-offset-2 ring-opacity-50" : ""}`}
              >
                <img src={entry.icon} alt="" aria-hidden="true" className="w-16 h-16 mb-2" />
                {entry.value}
              </Button>
            ))}
          </div>
        </Card>
      }
      right={
        <ControlsPanel
          sliderValue={sliderValue}
          onSliderChange={onSliderChange}
          onSliderCommit={onSliderCommit}
          onSelect={onSelect}
        />
      }
    />
  );
}
