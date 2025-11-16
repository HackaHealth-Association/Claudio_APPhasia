import React from 'react';
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import bodyBack from '../../body_back.png'
import bodyLeft from '../../body_left.png'
import bodyRight from '../../body_right.png'
import bodyFront from '../../body_front.png'


/**
 * AnatomyViewer Component
 * 
 * PURPOSE: Displays the human body anatomy from different views (front, back, left, right)
 * 
 * FEATURES:
 * - Shows anatomical body images based on selected view
 * - Provides navigation arrows to switch between 4 views
 * - Allows clicking on specific body parts to select them
 * - Highlights selected body parts
 * 
 * TODO: 
 * - Replace placeholder images with actual uploaded body images
 * - Implement clickable image maps for precise body part selection
 * - Add hover effects for body parts
 */
export default function AnatomyViewer({ currentView, onViewChange, onBodyPartClick }) {
  /**
   * PROPS:
   * - currentView: string - Current body view ('front', 'back', 'left', 'right')
   * - onViewChange: function - Callback when view changes
   * - onBodyPartClick: function - Callback when a body part is clicked
   */


const bodyPartsLeftCoords = [
  { name: 'Kopf', x: 421, y: 230 },
  { name: 'Nacken', x: 455, y: 320 },
  { name: 'Schulter', x: 450, y: 390 },
  { name: 'Oberarm', x: 350, y: 415 },
  { name: 'Unterarm', x: 188, y: 415 },
  { name: 'Hand', x: 55, y: 415 },
  { name: 'Handgelenk', x: 95, y: 415 },
  { name: 'Ellbogen', x: 270, y: 415 },
  { name: 'Rippen', x: 420, y: 540 },
  { name: 'Gesäss', x: 460, y: 755 },
  { name: 'äusserer Oberschenkel', x: 430, y: 915 },
  { name: 'innerer Oberschenkel', x: 250, y: 780 },
  { name: 'Unterschenkel innen', x: 190, y: 915 },
  { name: 'Unterschenkel aussen', x: 460, y: 1225 },
  { name: 'Knie innen', x: 115, y: 810 },
  { name: 'Knie aussen', x: 425, y: 1100 },
  { name: 'Fuss innen', x: 240, y: 1115 },
  { name: 'Fuss aussen', x: 400, y: 1455 },
  { name: 'Fussgelenk innen', x: 240, y: 1065 },
  { name: 'Fussgelenk aussen', x: 455, y: 1435 },
];

const bodyPartsRightCoords = [
  { name: 'Kopf', x: 234, y: 230 },
  { name: 'Nacken', x: 225, y: 320 },
  { name: 'Schulter', x: 180, y: 390 },
  { name: 'Oberarm', x: 310, y: 415 },
  { name: 'Unterarm', x: 490, y: 415 },
  { name: 'Hand', x: 615, y: 415 },
  { name: 'Handgelenk', x: 570, y: 405 },
  { name: 'Ellbogen', x: 425, y: 415 },
  { name: 'Rippen', x: 215, y: 540 },
  { name: 'Gesäss', x: 205, y: 755 },
  { name: 'äusserer Oberschenkel', x: 230, y: 915 },
  { name: 'innerer Oberschenkel', x: 420, y: 780 },
  { name: 'Unterschenkel innen', x: 485, y: 915 },
  { name: 'Unterschenkel aussen', x: 205, y: 1225 },
  { name: 'Knie innen', x: 565, y: 810 },
  { name: 'Knie aussen', x: 240, y: 1100 },
  { name: 'Fuss innen', x: 420, y: 1115 },
  { name: 'Fuss aussen', x: 280, y: 1455 },
  { name: 'Fussgelenk innen', x: 425, y: 1065 },
  { name: 'Fussgelenk aussen', x: 215, y: 1435 },
];

const bodyPartsFrontCoords = [
  { name: 'Kopf', x: 325, y: 150 },
  { name: 'Hals', x: 325, y: 270 },
  { name: 'Schulter links', x: 470, y: 330 },
  { name: 'Schulter rechts', x: 175, y: 330 },
  { name: 'Oberarm links', x: 490, y: 455 },
  { name: 'Oberarm rechts', x: 165, y: 455 },
  { name: 'Unterarm links', x: 555, y: 600 },
  { name: 'Unterarm rechts', x: 110, y: 600 },
  { name: 'Hand links', x: 590, y: 730 },
  { name: 'Hand rechts', x: 85, y: 730 },
  { name: 'Finger links', x: 590, y: 800 },
  { name: 'Finger rechts', x: 85, y: 800 },
  { name: 'Handgelenk links', x: 590, y: 700 },
  { name: 'Handgelenk rechts', x: 85, y: 700 },
  { name: 'Ellbogen links', x: 535, y: 545 },
  { name: 'Ellbogen rechts', x: 115, y: 545 },
  { name: 'Brust', x: 330, y: 375 },
  { name: 'Bauch', x: 330, y: 590 },
  { name: 'Oberschenkel links', x: 430, y: 825 },
  { name: 'Oberschenkel rechts', x: 235, y: 825 },
  { name: 'Hüfte links', x: 385, y: 700 },
  { name: 'Hüfte rechts', x: 270, y: 700 },
  { name: 'Unterschenkel links', x: 470, y: 1100 },
  { name: 'Unterschenkel rechts', x: 200, y: 1100 },
  { name: 'Knie links', x: 450, y: 1000 },
  { name: 'Knie rechts', x: 215, y: 1000 },
  { name: 'Fuss links', x: 485, y: 1300 },
  { name: 'Fuss rechts', x: 185, y: 1300 },
  { name: 'Fussgelenk links', x: 485, y: 1255 },
  { name: 'Fussgelenk rechts', x: 185, y: 1255 },
];

// BACK view
const bodyPartsBackCoords = [
  { name: 'Kopf', x: 325, y: 150 },
  { name: 'Nacken', x: 325, y: 270 },
  { name: 'Schulter rechts', x: 470, y: 330 },
  { name: 'Schulter links', x: 175, y: 330 },
  { name: 'Oberarm rechts', x: 490, y: 455 },
  { name: 'Oberarm links', x: 165, y: 455 },
  { name: 'Unterarm rechts', x: 555, y: 600 },
  { name: 'Unterarm links', x: 110, y: 600 },
  { name: 'Hand rechts', x: 590, y: 730 },
  { name: 'Hand links', x: 85, y: 730 },
  { name: 'Finger rechts', x: 590, y: 800 },
  { name: 'Finger links', x: 85, y: 800 },
  { name: 'Handgelenk rechts', x: 590, y: 700 },
  { name: 'Handgelenk links', x: 85, y: 700 },
  { name: 'Ellbogen rechts', x: 535, y: 545 },
  { name: 'Ellbogen links', x: 115, y: 545 },
  { name: 'Oberer Rücken', x: 335, y: 335 },
  { name: 'Mittlerer Rücken', x: 335, y: 490 },
  { name: 'Unterer Rücken', x: 335, y: 595 },
  { name: 'Gesäss', x: 335, y: 700 },
  { name: 'Oberschenkel rechts', x: 430, y: 825 },
  { name: 'Oberschenkel links', x: 235, y: 825 },
  { name: 'Unterschenkel rechts', x: 470, y: 1100 },
  { name: 'Unterschenkel links', x: 200, y: 1100 },
  { name: 'Knie rechts', x: 450, y: 1000 },
  { name: 'Knie links', x: 215, y: 1000 },
  { name: 'Fuss rechts', x: 485, y: 1300 },
  { name: 'Fuss links', x: 185, y: 1300 },
  { name: 'Fussgelenk rechts', x: 485, y: 1255 },
  { name: 'Fussgelenk links', x: 185, y: 1255 },
];


const IMAGE_WIDTH = 672;
const IMAGE_HEIGHT = 1536;

const handleBodyClick = (event, view) => {
  // Get click position relative to the image
  const rect = event.target.getBoundingClientRect();
  const clickX = ((event.clientX - rect.left) / rect.width) * IMAGE_WIDTH;
  const clickY = ((event.clientY - rect.top) / rect.height) * IMAGE_HEIGHT;

  // Select body part coordinates based on current view
  let bodyParts;
  switch (view) {
    case 'left':
      bodyParts = bodyPartsLeftCoords;
      break;
    case 'right':
      bodyParts = bodyPartsRightCoords;
      break;
    case 'front':
      bodyParts = bodyPartsFrontCoords;
      break;
    case 'back':
      bodyParts = bodyPartsBackCoords;
      break;
    default:
      return;
  }

  // Find the closest body part to the click
  let closest = null;
  let minDist = Infinity;
  bodyParts.forEach(part => {
    const dx = part.x - clickX;
    const dy = part.y - clickY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDist) {
      minDist = dist;
      closest = part;
    }
  });

  // Trigger callback
  if (closest) onBodyPartClick(closest.name);
};



  return (
    <Card className="bg-white border-2 border-gray-300 flex flex-col h-full">
      {/* MAIN IMAGE DISPLAY AREA */}
      <div className="flex-1 flex items-center justify-center p-1">
        {/* 
          ============================================================
          IMAGE PLACEHOLDER SECTION
          ============================================================
          TODO: Replace this entire section with actual uploaded images
          Images should be named and uploaded as:
          - body_front.png (Vorderansicht)
          - body_back.png (Rückansicht)
          - body_left.png (Linke Seitenansicht)
          - body_right.png (Rechte Seitenansicht)
          
          IMPLEMENTATION GUIDE:
          1. Upload images to the project
          2. Replace the placeholder div with:
             <img src="/path/to/body_front.png" alt="Front view" />
          3. Add image map (<map> and <area> tags) for clickable regions
          4. Each <area> should call onBodyPartClick with the body part name
        */}
        <div className="relative w-full max-w-sm">

          {/* FRONT VIEW - Vorderansicht */}
          {currentView === 'front' && (
            <div className="relative rounded-3xl p-2 min-h-[500px] flex items-center justify-center">
              <div className="text-center relative">
                <img
                  src={bodyFront}
                  alt="Front view"
                  className="w-full h-auto max-h-[700px] object-contain cursor-pointer"
                  onClick={(e) => handleBodyClick(e, 'front')}
                />
                <p className="mt-4 text-sm text-gray-500">Vorderseite</p>
              </div>
            </div>
          )}

          {/* BACK VIEW - Rückansicht */}
          {currentView === 'back' && (
            <div className="relative rounded-3xl p-2 min-h-[500px] flex items-center justify-center">
              <div className="text-center relative">
                <img
                  src={bodyBack}
                  alt="Back view"
                  className="w-full h-auto max-h-[700px] object-contain cursor-pointer"
                  onClick={(e) => handleBodyClick(e, 'back')}
                />
                <p className="mt-4 text-sm text-gray-500">Hinterseite</p>
              </div>
            </div>
          )}

          {/* LEFT SIDE VIEW - Linke Seitenansicht */}
          {/* LEFT SIDE VIEW */}
          {currentView === 'left' && (
            <div className="relative rounded-3xl p-2 min-h-[500px] flex items-center justify-center">
              <div className="text-center relative">
                <img
                  src={bodyLeft}
                  alt="Left view"
                  className="w-full h-auto max-h-[700px] object-contain cursor-pointer"
                  onClick={(e) => handleBodyClick(e, 'left')}
                />
                <p className="mt-4 text-sm text-gray-500">Linke Seite</p>
              </div>
            </div>
          )}


          {/* RIGHT SIDE VIEW */}
          {currentView === 'right' && (
            <div className="relative rounded-3xl p-2 min-h-[500px] flex items-center justify-center">
              <div className="text-center relative">
                <img
                  src={bodyRight}
                  alt="Right view"
                  className="w-full h-auto max-h-[700px] object-contain cursor-pointer"
                  onClick={(e) => handleBodyClick(e, 'right')}
                />
                <p className="mt-4 text-sm text-gray-500">Rechte Seite</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 
        ============================================================
        VIEW NAVIGATION ARROWS
        ============================================================
        Four arrow buttons to switch between different body views:
        - Up Arrow = Front view (Vorderansicht)
        - Down Arrow = Back view (Rückansicht)
        - Left Arrow = Left side view (Linke Seite)
        - Right Arrow = Right side view (Rechte Seite)
      */}
      <div className="p-1 border-t bg-gray-50">
        <div className="flex items-center justify-center gap-1">
          {/* Front view button */}
          <Button
            onClick={() => onViewChange('front')}
            variant={currentView === 'front' ? 'default' : 'outline'}
            size="icon"
            className="h-12 w-12"
            title="Vorderansicht"
          >
            <ArrowUp className="w-6 h-6" />
          </Button>

          {/* Back view button */}
          <Button
            onClick={() => onViewChange('back')}
            variant={currentView === 'back' ? 'default' : 'outline'}
            size="icon"
            className="h-12 w-12"
            title="Rückansicht"
          >
            <ArrowDown className="w-6 h-6" />
          </Button>

          {/* Left side view button */}
          <Button
            onClick={() => onViewChange('left')}
            variant={currentView === 'left' ? 'default' : 'outline'}
            size="icon"
            className="h-12 w-12"
            title="Linke Seite"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>

          {/* Right side view button */}
          <Button
            onClick={() => onViewChange('right')}
            variant={currentView === 'right' ? 'default' : 'outline'}
            size="icon"
            className="h-12 w-12"
            title="Rechte Seite"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </Card>
  );
}