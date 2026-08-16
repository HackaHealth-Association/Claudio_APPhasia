import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import {
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
  VIEWS,
  findBodyPart,
} from "../../data/bodyParts";

import bodyFront from "../../assets/body/front.jpg";
import bodyBack from "../../assets/body/back.jpg";
import bodyLeft from "../../assets/body/left.jpg";
import bodyRight from "../../assets/body/right.jpg";

const IMAGES = { front: bodyFront, back: bodyBack, left: bodyLeft, right: bodyRight };
const VIEW_ICONS = { front: ArrowUp, back: ArrowDown, left: ArrowLeft, right: ArrowRight };

/**
 * The body picture. Tapping it selects the nearest body part — but only within
 * a sensible radius, and the marker shows which one *before* it is added, so a
 * mistap is visible rather than silently ending up in the sentence.
 */
export default function AnatomyViewer({ currentView, onViewChange, onBodyPartClick }) {
  const [marker, setMarker] = useState(null);

  const locate = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * IMAGE_WIDTH;
    const y = ((event.clientY - rect.top) / rect.height) * IMAGE_HEIGHT;
    return findBodyPart(currentView, x, y);
  };

  const handleClick = (event) => {
    const part = locate(event);
    if (!part) {
      setMarker(null);
      return;
    }
    setMarker(part);
    onBodyPartClick(part.name);
  };

  const viewLabel = VIEWS.find((view) => view.id === currentView)?.label ?? "";

  return (
    <Card className="bg-white border-2 border-gray-300 flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center p-1 min-h-0">
        <div className="relative text-center">
          <div className="relative inline-block">
            <img
              src={IMAGES[currentView]}
              alt={viewLabel}
              className="w-full h-auto max-h-[500px] object-contain cursor-pointer mx-auto select-none"
              draggable={false}
              onClick={handleClick}
              onPointerMove={(event) => {
                if (event.pointerType === "touch") return;
                setMarker(locate(event));
              }}
              onPointerLeave={() => setMarker(null)}
            />

            {marker && (
              <div
                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{
                  left: `${(marker.x / IMAGE_WIDTH) * 100}%`,
                  top: `${(marker.y / IMAGE_HEIGHT) * 100}%`,
                }}
              >
                <span className="block w-5 h-5 rounded-full bg-blue-600/70 ring-2 ring-white" />
                <span className="mt-1 whitespace-nowrap rounded bg-blue-600 px-1.5 py-0.5 text-xs font-semibold text-white shadow">
                  {marker.name}
                </span>
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">{viewLabel}</p>
        </div>
      </div>

      <div className="p-1 border-t bg-gray-50">
        <div className="flex items-center justify-center gap-1">
          {VIEWS.map((view) => {
            const Icon = VIEW_ICONS[view.id];
            return (
              <Button
                key={view.id}
                onClick={() => {
                  setMarker(null);
                  onViewChange(view.id);
                }}
                variant={currentView === view.id ? "default" : "outline"}
                size="icon"
                className="h-12 w-12"
                title={view.title}
                aria-label={view.title}
              >
                <Icon className="w-6 h-6" />
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
