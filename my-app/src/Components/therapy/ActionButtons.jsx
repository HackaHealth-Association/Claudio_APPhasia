import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import SchmerzIcon from "../../assets/icons/Schmerz.png";
import ZuschauenIcon from "../../assets/icons/Zuschauen.png";
import BewegenIcon from "../../assets/icons/Bewegen.png";
import BeugenIcon from "../../assets/icons/Beugen.png";
import AnspannenIcon from "../../assets/icons/Anspannen.png";
import DrehenIcon from "../../assets/icons/Drehen.png";
import StreckenIcon from "../../assets/icons/Strecken.png";
import WiederholenIcon from "../../assets/icons/Wiederholen.png";

const actions = [
  { word: "Schmerz", color: "bg-red-500 hover:bg-red-600", icon: SchmerzIcon },
  { word: "zuschauen", color: "bg-yellow-400 hover:bg-yellow-500", icon: ZuschauenIcon },
  { word: "bewegen", color: "bg-pink-400 hover:bg-pink-500", icon: BewegenIcon },
  { word: "anspannen", color: "bg-orange-400 hover:bg-orange-500", icon: AnspannenIcon },
  { word: "beugen", color: "bg-purple-300 hover:bg-purple-400", icon: BeugenIcon },
  { word: "strecken", color: "bg-cyan-500 hover:bg-cyan-600", icon: StreckenIcon },
  { word: "drehen", color: "bg-blue-500 hover:bg-blue-600", icon: DrehenIcon },
  { word: "wiederholen", color: "bg-gray-400 hover:bg-gray-500", icon: WiederholenIcon },
];

export default function ActionButtons({ selectedAction, onActionClick }) {
  return (
    <Card className="bg-white border-2 border-gray-300 p-4 h-full flex flex-col">
      {/* 2-row / 4-column responsive grid */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {actions.map((action) => (
          <Button
            key={action.word}
            onClick={() => onActionClick(action.word)}
            className={`h-45 flex flex-col items-center justify-center text-lg font-semibold text-black transition-all ${
              selectedAction === action.word
                ? `${action.color} ring-4 ring-offset-2 ring-opacity-50`
                : action.color
            }`}
          >
            <img src={action.icon} alt={action.word} className="w-25 h-25 mb-1" />
            {action.word}
          </Button>
        ))}
      </div>
    </Card>
  );
}
