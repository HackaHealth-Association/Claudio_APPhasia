import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ACTION_BUTTONS } from "../../data/vocabulary";

/** Movement verbs and pain, on the "Erweitert" tab. */
export default function ActionButtons({ selectedAction, onSelect }) {
  return (
    <Card className="bg-white border-2 border-gray-300 p-4 h-full flex flex-col">
      <div className="grid grid-cols-3 gap-4 w-full">
        {ACTION_BUTTONS.map((entry) => (
          <Button
            key={entry.value}
            onClick={() => onSelect(entry)}
            className={`h-45 flex flex-col items-center justify-center text-lg font-semibold text-black transition-all ${
              selectedAction === entry.value
                ? `${entry.color} ring-4 ring-offset-2 ring-opacity-50`
                : entry.color
            }`}
          >
            <img src={entry.icon} alt="" aria-hidden="true" className="w-25 h-25 mb-1" />
            {entry.value}
          </Button>
        ))}
      </div>
    </Card>
  );
}
