import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import bodyFront from "@/assets/body-front.png";
import bodyBack from "@/assets/body-back.png";

interface AnatomyViewerProps {
  onBodyPartSelect: (part: string) => void;
}

const bodyParts = {
  front: [
    { name: "Kopf", label: "Kopf" },
    { name: "Hals", label: "Hals" },
    { name: "Schulter links", label: "Schulter L" },
    { name: "Schulter rechts", label: "Schulter R" },
    { name: "Arm links", label: "Arm L" },
    { name: "Arm rechts", label: "Arm R" },
    { name: "Brust", label: "Brust" },
    { name: "Bauch", label: "Bauch" },
    { name: "Hüfte", label: "Hüfte" },
    { name: "Bein links", label: "Bein L" },
    { name: "Bein rechts", label: "Bein R" },
    { name: "Fuß links", label: "Fuß L" },
    { name: "Fuß rechts", label: "Fuß R" },
  ],
  back: [
    { name: "Hinterkopf", label: "Hinterkopf" },
    { name: "Nacken", label: "Nacken" },
    { name: "Schulter links", label: "Schulter L" },
    { name: "Schulter rechts", label: "Schulter R" },
    { name: "Arm links", label: "Arm L" },
    { name: "Arm rechts", label: "Arm R" },
    { name: "Oberer Rücken", label: "Oberer Rücken" },
    { name: "Unterer Rücken", label: "Unterer Rücken" },
    { name: "Hüfte", label: "Hüfte" },
    { name: "Bein links", label: "Bein L" },
    { name: "Bein rechts", label: "Bein R" },
    { name: "Fuß links", label: "Fuß L" },
    { name: "Fuß rechts", label: "Fuß R" },
  ],
};

export const AnatomyViewer = ({ onBodyPartSelect }: AnatomyViewerProps) => {
  const [view, setView] = useState<"front" | "back">("front");

  const currentParts = bodyParts[view];

  return (
    <Card className="h-full p-6 flex flex-col bg-card">
      <div className="flex justify-center mb-4 gap-2">
        <Button
          variant={view === "front" ? "default" : "outline"}
          onClick={() => setView("front")}
          className="text-lg px-8 py-6"
        >
          Vorderseite
        </Button>
        <Button
          variant={view === "back" ? "default" : "outline"}
          onClick={() => setView("back")}
          className="text-lg px-8 py-6"
        >
          Rückseite
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center mb-4">
        <div className="relative max-w-md w-full">
          <img
            src={view === "front" ? bodyFront : bodyBack}
            alt={view === "front" ? "Körper Vorderseite" : "Körper Rückseite"}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {currentParts.map((part) => (
          <Button
            key={part.name}
            onClick={() => onBodyPartSelect(part.name)}
            variant="outline"
            className="text-base py-6 bg-card hover:bg-body-part hover:text-white transition-colors"
          >
            {part.label}
          </Button>
        ))}
      </div>
    </Card>
  );
};
