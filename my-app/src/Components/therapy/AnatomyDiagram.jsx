import React from 'react';
import { Card } from "../../Components/ui/card";
import { Volume2 } from "lucide-react";

const bodyParts = [
  { name: "head", label: "Head", x: 50, y: 8, width: 15 },
  { name: "neck", label: "Neck", x: 50, y: 16, width: 10 },
  { name: "shoulder", label: "Shoulder", x: 50, y: 24, width: 25 },
  { name: "chest", label: "Chest", x: 50, y: 32, width: 20 },
  { name: "upper_arm", label: "Upper Arm", x: 30, y: 32, width: 12 },
  { name: "elbow", label: "Elbow", x: 30, y: 42, width: 10 },
  { name: "forearm", label: "Forearm", x: 30, y: 48, width: 12 },
  { name: "wrist", label: "Wrist", x: 30, y: 56, width: 10 },
  { name: "hand", label: "Hand", x: 30, y: 62, width: 12 },
  { name: "back", label: "Back", x: 50, y: 38, width: 20 },
  { name: "abdomen", label: "Abdomen", x: 50, y: 44, width: 18 },
  { name: "hip", label: "Hip", x: 50, y: 52, width: 20 },
  { name: "thigh", label: "Thigh", x: 45, y: 62, width: 14 },
  { name: "knee", label: "Knee", x: 45, y: 72, width: 12 },
  { name: "calf", label: "Calf", x: 45, y: 80, width: 12 },
  { name: "ankle", label: "Ankle", x: 45, y: 88, width: 10 },
  { name: "foot", label: "Foot", x: 45, y: 94, width: 12 }
];

export default function AnatomyDiagram({ onBodyPartClick, selectedPart }) {
  return (
    <Card className="p-1 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-100">
      <div className="flex items-center gap-2 mb-4">
        <Volume2 className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">Body Anatomy</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">Click on any body part to hear its pronunciation</p>
      
      <div className="relative bg-white rounded-xl p-4 shadow-inner" style={{ minHeight: '600px' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Simple body outline */}
          <ellipse cx="50" cy="10" rx="7" ry="9" fill="#E0E7FF" stroke="#6366F1" strokeWidth="0.5" />
          <line x1="50" y1="19" x2="50" y2="28" stroke="#6366F1" strokeWidth="1.5" />
          <ellipse cx="50" cy="35" rx="10" ry="12" fill="#E0E7FF" stroke="#6366F1" strokeWidth="0.5" />
          <line x1="40" y1="28" x2="25" y2="40" stroke="#6366F1" strokeWidth="1.5" />
          <line x1="25" y1="40" x2="22" y2="55" stroke="#6366F1" strokeWidth="1.5" />
          <line x1="22" y1="55" x2="20" y2="65" stroke="#6366F1" strokeWidth="1.5" />
          <line x1="60" y1="28" x2="75" y2="40" stroke="#6366F1" strokeWidth="1.5" />
          <line x1="75" y1="40" x2="78" y2="55" stroke="#6366F1" strokeWidth="1.5" />
          <line x1="78" y1="55" x2="80" y2="65" stroke="#6366F1" strokeWidth="1.5" />
          <line x1="50" y1="47" x2="50" y2="58" stroke="#6366F1" strokeWidth="1.5" />
          <line x1="45" y1="58" x2="42" y2="75" stroke="#6366F1" strokeWidth="1.8" />
          <line x1="42" y1="75" x2="40" y2="90" stroke="#6366F1" strokeWidth="1.8" />
          <line x1="55" y1="58" x2="58" y2="75" stroke="#6366F1" strokeWidth="1.8" />
          <line x1="58" y1="75" x2="60" y2="90" stroke="#6366F1" strokeWidth="1.8" />
          
          {/* Clickable body parts as circles */}
          {bodyParts.map((part, index) => (
            <g key={part.name}>
              <circle
                cx={part.x}
                cy={part.y}
                r={part.width / 2}
                fill={selectedPart === part.label ? "#4F46E5" : "#818CF8"}
                opacity={selectedPart === part.label ? "0.9" : "0.6"}
                className="cursor-pointer hover:opacity-100 transition-all"
                onClick={() => onBodyPartClick(part.label)}
                style={{ filter: selectedPart === part.label ? 'drop-shadow(0 0 8px rgba(79, 70, 229, 0.6))' : 'none' }}
              />
              <text
                x={part.x}
                y={part.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[3px] font-semibold fill-white pointer-events-none select-none"
                style={{ fontSize: '3px' }}
              >
                {part.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Card>
  );
}

/* */