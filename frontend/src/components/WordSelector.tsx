import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MoveUp,
  MoveDown,
  Plus,
  Minus,
  HelpCircle,
  AlertCircle,
} from "lucide-react";

interface WordSelectorProps {
  onVerbSelect: (verb: string) => void;
  onNumberSelect: (number: string) => void;
  onModifierSelect: (modifier: string) => void;
}

const verbs = [
  "beugen",
  "strecken",
  "drehen",
  "schmerzen",
  "relax",
  "zuschauen",
  "wiederholen",
];

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const directions = [
  { icon: ArrowUp, label: "oben", value: "nach oben" },
  { icon: ArrowDown, label: "unten", value: "nach unten" },
  { icon: ArrowLeft, label: "links", value: "nach links" },
  { icon: ArrowRight, label: "rechts", value: "nach rechts" },
  { icon: MoveUp, label: "vor", value: "nach vorne" },
  { icon: MoveDown, label: "zurück", value: "nach hinten" },
];

export const WordSelector = ({
  onVerbSelect,
  onNumberSelect,
  onModifierSelect,
}: WordSelectorProps) => {
  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card">
        <h3 className="text-lg font-semibold mb-3 text-foreground">Verben</h3>
        <div className="grid grid-cols-2 gap-2">
          {verbs.map((verb) => (
            <Button
              key={verb}
              onClick={() => onVerbSelect(verb)}
              variant="outline"
              className="text-base py-6 bg-card hover:bg-verb hover:text-white transition-colors"
            >
              {verb}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-card">
        <h3 className="text-lg font-semibold mb-3 text-foreground">
          Frage / Aussage
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onModifierSelect("?")}
            variant="outline"
            className="text-2xl py-6 bg-card hover:bg-accent hover:text-white transition-colors"
          >
            <HelpCircle className="mr-2 h-6 w-6" />?
          </Button>
          <Button
            onClick={() => onModifierSelect("!")}
            variant="outline"
            className="text-2xl py-6 bg-card hover:bg-accent hover:text-white transition-colors"
          >
            <AlertCircle className="mr-2 h-6 w-6" />!
          </Button>
        </div>
      </Card>

      <Card className="p-4 bg-card">
        <h3 className="text-lg font-semibold mb-3 text-foreground">Zahlen</h3>
        <div className="grid grid-cols-5 gap-2">
          {numbers.map((num) => (
            <Button
              key={num}
              onClick={() => onNumberSelect(num)}
              variant="outline"
              className="text-xl py-6 bg-card hover:bg-number hover:text-white transition-colors"
            >
              {num}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-card">
        <h3 className="text-lg font-semibold mb-3 text-foreground">
          Plus / Minus
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onModifierSelect("+")}
            variant="outline"
            className="text-2xl py-6 bg-card hover:bg-accent hover:text-white transition-colors"
          >
            <Plus className="mr-2 h-6 w-6" />
            Plus
          </Button>
          <Button
            onClick={() => onModifierSelect("-")}
            variant="outline"
            className="text-2xl py-6 bg-card hover:bg-accent hover:text-white transition-colors"
          >
            <Minus className="mr-2 h-6 w-6" />
            Minus
          </Button>
        </div>
      </Card>

      <Card className="p-4 bg-card">
        <h3 className="text-lg font-semibold mb-3 text-foreground">
          Richtungen
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {directions.map((dir) => {
            const Icon = dir.icon;
            return (
              <Button
                key={dir.value}
                onClick={() => onModifierSelect(dir.value)}
                variant="outline"
                className="text-base py-6 bg-card hover:bg-direction hover:text-white transition-colors flex flex-col gap-1"
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs">{dir.label}</span>
              </Button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
