import React from 'react';
import { Card } from "../../Components/ui/card";
import { Button } from "../../Components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

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
            <div className="relative rounded-3xl p-1 min-h-[500px] flex items-center justify-center">
              <div className="text-center relative">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69179e7e6d13ab86f0992908/51c26b6e5_bodyfront.jpg" 
                  alt="Front view" 
                  className="w-full h-auto max-h-[700px] object-contain"
                />
                <div className="absolute inset-0">
                  
                  {/* FRONT VIEW CLICKABLE AREAS */}
                  {
                  <button onClick={() => onBodyPartClick('Kopf')} className="absolute top-[5%] left-1/2 -translate-x-1/2 w-20 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Kopf"></button>
                  }
{/*                   
                  <button onClick={() => onBodyPartClick('Hüfte')} className="absolute top-[48%] left-1/2 -translate-x-1/2 w-20 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Hüfte"></button>
                  <button onClick={() => onBodyPartClick('Knie')} className="absolute top-[68%] left-[45%] w-12 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Knie"></button>
                  <button onClick={() => onBodyPartClick('Knie')} className="absolute top-[68%] left-[55%] w-12 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Knie"></button>
                  <button onClick={() => onBodyPartClick('Fuß')} className="absolute bottom-[2%] left-[42%] w-12 h-8 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Fuß"></button>
                  <button onClick={() => onBodyPartClick('Fuß')} className="absolute bottom-[2%] left-[56%] w-12 h-8 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Fuß"></button>
                  <button onClick={() => onBodyPartClick('Schulter')} className="absolute top-[20%] left-[30%] w-16 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Schulter"></button>
                  <button onClick={() => onBodyPartClick('Schulter')} className="absolute top-[20%] right-[30%] w-16 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Schulter"></button>
                  <button onClick={() => onBodyPartClick('Unterschenkel')} className="absolute top-[78%] left-[44%] w-10 h-16 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Unterschenkel"></button>
                  <button onClick={() => onBodyPartClick('Unterschenkel')} className="absolute top-[78%] right-[44%] w-10 h-16 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Unterschenkel"></button>
                  <button onClick={() => onBodyPartClick('Oberschenkel')} className="absolute top-[55%] left-[43%] w-12 h-14 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Oberschenkel"></button>
                  <button onClick={() => onBodyPartClick('Oberschenkel')} className="absolute top-[55%] right-[43%] w-12 h-14 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Oberschenkel"></button>
                  <button onClick={() => onBodyPartClick('Unterarm')} className="absolute top-[42%] left-[20%] w-10 h-16 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Unterarm"></button>
                  <button onClick={() => onBodyPartClick('Unterarm')} className="absolute top-[42%] right-[20%] w-10 h-16 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Unterarm"></button>
                  <button onClick={() => onBodyPartClick('Oberarm')} className="absolute top-[28%] left-[22%] w-10 h-14 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Oberarm"></button>
                  <button onClick={() => onBodyPartClick('Oberarm')} className="absolute top-[28%] right-[22%] w-10 h-14 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Oberarm"></button>
                  <button onClick={() => onBodyPartClick('Ellbogen')} className="absolute top-[40%] left-[19%] w-10 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Ellbogen"></button>
                  <button onClick={() => onBodyPartClick('Ellbogen')} className="absolute top-[40%] right-[19%] w-10 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Ellbogen"></button>
                  <button onClick={() => onBodyPartClick('Hand')} className="absolute top-[58%] left-[16%] w-10 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Hand"></button>
                  <button onClick={() => onBodyPartClick('Hand')} className="absolute top-[58%] right-[16%] w-10 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Hand"></button> */}
                </div>
                <p className="mt-4 text-sm text-gray-500">Vorderansicht</p>
              </div>
            </div>
          )}
          
          {/* BACK VIEW - Rückansicht */}
          {currentView === 'back' && (
            <div className="relative rounded-3xl p-2 min-h-[500px] flex items-center justify-center">
              <div className="text-center relative">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69179e7e6d13ab86f0992908/c0017501a_bodyback.jpg" 
                  alt="Back view" 
                  className="w-full h-auto max-h-[700px] object-contain"
                />
                <div className="absolute inset-0">
                  {/* BACK VIEW CLICKABLE AREAS */}${

                  }
                  {/* <button onClick={() => onBodyPartClick('Hüfte')} className="absolute top-[48%] left-1/2 -translate-x-1/2 w-20 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Hüfte"></button>
                  <button onClick={() => onBodyPartClick('Gesäß')} className="absolute top-[52%] left-1/2 -translate-x-1/2 w-24 h-14 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Gesäß"></button>
                  <button onClick={() => onBodyPartClick('Wirbelsäule')} className="absolute top-[25%] left-1/2 -translate-x-1/2 w-8 h-32 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Wirbelsäule"></button>
                  <button onClick={() => onBodyPartClick('Knie')} className="absolute top-[68%] left-[45%] w-12 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Knie"></button>
                  <button onClick={() => onBodyPartClick('Knie')} className="absolute top-[68%] right-[45%] w-12 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Knie"></button>
                  <button onClick={() => onBodyPartClick('Fuß')} className="absolute bottom-[2%] left-[42%] w-12 h-8 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Fuß"></button>
                  <button onClick={() => onBodyPartClick('Fuß')} className="absolute bottom-[2%] right-[42%] w-12 h-8 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Fuß"></button>
                  <button onClick={() => onBodyPartClick('Nacken')} className="absolute top-[12%] left-1/2 -translate-x-1/2 w-12 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Nacken"></button>
                  <button onClick={() => onBodyPartClick('Schulter')} className="absolute top-[18%] left-[28%] w-16 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Schulter"></button>
                  <button onClick={() => onBodyPartClick('Schulter')} className="absolute top-[18%] right-[28%] w-16 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Schulter"></button>
                  <button onClick={() => onBodyPartClick('Unterschenkel')} className="absolute top-[78%] left-[44%] w-10 h-16 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Unterschenkel"></button>
                  <button onClick={() => onBodyPartClick('Unterschenkel')} className="absolute top-[78%] right-[44%] w-10 h-16 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Unterschenkel"></button>
                  <button onClick={() => onBodyPartClick('Oberschenkel')} className="absolute top-[58%] left-[43%] w-12 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Oberschenkel"></button>
                  <button onClick={() => onBodyPartClick('Oberschenkel')} className="absolute top-[58%] right-[43%] w-12 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Oberschenkel"></button>
                  <button onClick={() => onBodyPartClick('Unterarm')} className="absolute top-[42%] left-[18%] w-10 h-16 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Unterarm"></button>
                  <button onClick={() => onBodyPartClick('Unterarm')} className="absolute top-[42%] right-[18%] w-10 h-16 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Unterarm"></button>
                  <button onClick={() => onBodyPartClick('Oberarm')} className="absolute top-[26%] left-[20%] w-10 h-16 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Oberarm"></button>
                  <button onClick={() => onBodyPartClick('Oberarm')} className="absolute top-[26%] right-[20%] w-10 h-16 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Oberarm"></button>
                  <button onClick={() => onBodyPartClick('Ellbogen')} className="absolute top-[40%] left-[17%] w-10 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Ellbogen"></button>
                  <button onClick={() => onBodyPartClick('Ellbogen')} className="absolute top-[40%] right-[17%] w-10 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Ellbogen"></button> */}
                </div>
                <p className="mt-4 text-sm text-gray-500">Rückansicht</p>
              </div>
            </div>
          )}
          
          {/* LEFT SIDE VIEW - Linke Seitenansicht */}
          {currentView === 'left' && (
            <div className="relative rounded-3xl p-2 min-h-[500px] flex items-center justify-center">
              <div className="text-center relative">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69179e7e6d13ab86f0992908/8ca293ddf_bodyleft.jpg" 
                  alt="Left view" 
                  className="w-full h-auto max-h-[700px] object-contain"
                />
                <div className="absolute inset-0">
                  {/* SIDE VIEW CLICKABLE AREAS */}
                  <button onClick={() => onBodyPartClick('Hüfte')} className="absolute top-[48%] left-1/2 -translate-x-1/2 w-16 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Hüfte"></button>
                  <button onClick={() => onBodyPartClick('Knie')} className="absolute top-[68%] left-1/2 -translate-x-1/2 w-14 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Knie"></button>
                  <button onClick={() => onBodyPartClick('Fuß')} className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-14 h-8 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Fuß"></button>
                  <button onClick={() => onBodyPartClick('Nacken')} className="absolute top-[12%] left-1/2 -translate-x-1/2 w-12 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Nacken"></button>
                  <button onClick={() => onBodyPartClick('Schulter')} className="absolute top-[18%] left-1/2 -translate-x-1/2 w-16 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Schulter"></button>
                  <button onClick={() => onBodyPartClick('Unterschenkel')} className="absolute top-[78%] left-1/2 -translate-x-1/2 w-12 h-16 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Unterschenkel"></button>
                  <button onClick={() => onBodyPartClick('Oberschenkel')} className="absolute top-[58%] left-1/2 -translate-x-1/2 w-14 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Oberschenkel"></button>
                  <button onClick={() => onBodyPartClick('Unterarm')} className="absolute top-[42%] left-1/2 -translate-x-1/2 w-12 h-14 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Unterarm"></button>
                  <button onClick={() => onBodyPartClick('Oberarm')} className="absolute top-[26%] left-1/2 -translate-x-1/2 w-12 h-14 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Oberarm"></button>
                  <button onClick={() => onBodyPartClick('Ellbogen')} className="absolute top-[39%] left-1/2 -translate-x-1/2 w-12 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Ellbogen"></button>
                </div>
                <p className="mt-4 text-sm text-gray-500">Linke Seite</p>
              </div>
            </div>
          )}
          
          {/* RIGHT SIDE VIEW - Rechte Seitenansicht */}
          {currentView === 'right' && (
            <div className="relative rounded-3xl p-2 min-h-[500px] flex items-center justify-center">
              <div className="text-center relative">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69179e7e6d13ab86f0992908/ce37f565e_bodyright.jpg" 
                  alt="Right view" 
                  className="w-full h-auto max-h-[700px] object-contain"
                />
                <div className="absolute inset-0">
                  {/* SIDE VIEW CLICKABLE AREAS */}
                  <button onClick={() => onBodyPartClick('Hüfte')} className="absolute top-[48%] left-1/2 -translate-x-1/2 w-16 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Hüfte"></button>
                  <button onClick={() => onBodyPartClick('Knie')} className="absolute top-[68%] left-1/2 -translate-x-1/2 w-14 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Knie"></button>
                  <button onClick={() => onBodyPartClick('Fuß')} className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-14 h-8 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Fuß"></button>
                  <button onClick={() => onBodyPartClick('Nacken')} className="absolute top-[12%] left-1/2 -translate-x-1/2 w-12 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Nacken"></button>
                  <button onClick={() => onBodyPartClick('Schulter')} className="absolute top-[18%] left-1/2 -translate-x-1/2 w-16 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Schulter"></button>
                  <button onClick={() => onBodyPartClick('Unterschenkel')} className="absolute top-[78%] left-1/2 -translate-x-1/2 w-12 h-16 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Unterschenkel"></button>
                  <button onClick={() => onBodyPartClick('Oberschenkel')} className="absolute top-[58%] left-1/2 -translate-x-1/2 w-14 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Oberschenkel"></button>
                  <button onClick={() => onBodyPartClick('Unterarm')} className="absolute top-[42%] left-1/2 -translate-x-1/2 w-12 h-14 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Unterarm"></button>
                  <button onClick={() => onBodyPartClick('Oberarm')} className="absolute top-[26%] left-1/2 -translate-x-1/2 w-12 h-14 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Oberarm"></button>
                  <button onClick={() => onBodyPartClick('Ellbogen')} className="absolute top-[39%] left-1/2 -translate-x-1/2 w-12 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50" title="Ellbogen"></button>
                </div>
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