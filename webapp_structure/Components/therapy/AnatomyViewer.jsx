import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <div className="flex-1 flex items-center justify-center p-8">
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
            <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-3xl p-8 min-h-[500px] flex items-center justify-center">
              {/* TODO: Replace with actual front view image */}
              {/* <img src="/path/to/body_front.png" alt="Front view" className="w-full h-auto" /> */}
              
              {/* TEMPORARY PLACEHOLDER - will be replaced with clickable image map */}
              <div className="text-center">
                <div className="w-48 h-96 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full mx-auto relative shadow-lg">
                  
                  {/* Head placeholder */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-20 bg-orange-300 rounded-full"></div>
                  
                  {/* 
                    ============================================================
                    CLICKABLE BODY PARTS - FRONT VIEW
                    ============================================================
                    These are the required body parts that must be clickable:
                    - Nacken (neck)
                    - Schulter (shoulder)
                    - Oberarm (upper arm)
                    - Ellbogen (elbow)
                    - Unterarm (forearm)
                    - Hüfte (hip)
                    - Wirbelsäule (spine)
                    - Oberschenkel (thigh)
                    - Knie (knee)
                    - Unterschenkel (lower leg)
                    - Fuß (foot)
                  */}
                  
                  {/* Nacken - Neck area */}
                  <button 
                    onClick={() => onBodyPartClick('Nacken')}
                    className="absolute top-20 left-1/2 -translate-x-1/2 w-12 h-8 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50"
                    title="Nacken"
                  ></button>
                  
                  {/* Schulter - Shoulder area */}
                  <button 
                    onClick={() => onBodyPartClick('Schulter')}
                    className="absolute top-24 left-8 w-16 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50"
                    title="Schulter"
                  ></button>
                  
                  {/* Wirbelsäule - Spine area (center of torso) */}
                  <button 
                    onClick={() => onBodyPartClick('Wirbelsäule')}
                    className="absolute top-32 left-1/2 -translate-x-1/2 w-8 h-24 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50"
                    title="Wirbelsäule"
                  ></button>
                  
                  {/* Oberarm - Upper arm */}
                  <button 
                    onClick={() => onBodyPartClick('Oberarm')}
                    className="absolute top-28 left-4 w-10 h-16 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50"
                    title="Oberarm"
                  ></button>
                  
                  {/* Ellbogen - Elbow */}
                  <button 
                    onClick={() => onBodyPartClick('Ellbogen')}
                    className="absolute top-44 left-2 w-10 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50"
                    title="Ellbogen"
                  ></button>
                  
                  {/* Unterarm - Forearm */}
                  <button 
                    onClick={() => onBodyPartClick('Unterarm')}
                    className="absolute top-54 left-1 w-10 h-16 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50"
                    title="Unterarm"
                  ></button>
                  
                  {/* Hüfte - Hip area */}
                  <button 
                    onClick={() => onBodyPartClick('Hüfte')}
                    className="absolute top-52 left-1/2 -translate-x-1/2 w-20 h-12 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50"
                    title="Hüfte"
                  ></button>
                  
                  {/* Oberschenkel - Thigh */}
                  <button 
                    onClick={() => onBodyPartClick('Oberschenkel')}
                    className="absolute top-64 left-12 w-12 h-16 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50"
                    title="Oberschenkel"
                  ></button>
                  
                  {/* Knie - Knee */}
                  <button 
                    onClick={() => onBodyPartClick('Knie')}
                    className="absolute top-80 left-12 w-12 h-10 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50"
                    title="Knie"
                  ></button>
                  
                  {/* Unterschenkel - Lower leg */}
                  <button 
                    onClick={() => onBodyPartClick('Unterschenkel')}
                    className="absolute top-90 left-12 w-12 h-16 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50"
                    title="Unterschenkel"
                  ></button>
                  
                  {/* Fuß - Foot */}
                  <button 
                    onClick={() => onBodyPartClick('Fuß')}
                    className="absolute bottom-2 left-12 w-12 h-8 hover:bg-blue-400 rounded transition-colors opacity-0 hover:opacity-50"
                    title="Fuß"
                  ></button>
                </div>
                <p className="mt-4 text-sm text-gray-500">Vorderansicht</p>
              </div>
            </div>
          )}
          
          {/* BACK VIEW - Rückansicht */}
          {currentView === 'back' && (
            <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-3xl p-8 min-h-[500px] flex items-center justify-center">
              {/* TODO: Replace with actual back view image */}
              {/* <img src="/path/to/body_back.png" alt="Back view" className="w-full h-auto" /> */}
              
              {/* Placeholder for back view */}
              <div className="text-center">
                <div className="w-48 h-96 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full mx-auto relative shadow-lg">
                  {/* TODO: Add clickable areas for back view body parts */}
                  {/* Same body parts as front, but from back perspective */}
                </div>
                <p className="mt-4 text-sm text-gray-500">Rückansicht</p>
              </div>
            </div>
          )}
          
          {/* LEFT SIDE VIEW - Linke Seitenansicht */}
          {currentView === 'left' && (
            <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-3xl p-8 min-h-[500px] flex items-center justify-center">
              {/* TODO: Replace with actual left side view image */}
              {/* <img src="/path/to/body_left.png" alt="Left view" className="w-full h-auto" /> */}
              
              {/* Placeholder for left side view */}
              <div className="text-center">
                <div className="w-32 h-96 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full mx-auto relative shadow-lg">
                  {/* TODO: Add clickable areas for left side view body parts */}
                </div>
                <p className="mt-4 text-sm text-gray-500">Linke Seite</p>
              </div>
            </div>
          )}
          
          {/* RIGHT SIDE VIEW - Rechte Seitenansicht */}
          {currentView === 'right' && (
            <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-3xl p-8 min-h-[500px] flex items-center justify-center">
              {/* TODO: Replace with actual right side view image */}
              {/* <img src="/path/to/body_right.png" alt="Right view" className="w-full h-auto" /> */}
              
              {/* Placeholder for right side view */}
              <div className="text-center">
                <div className="w-32 h-96 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full mx-auto relative shadow-lg">
                  {/* TODO: Add clickable areas for right side view body parts */}
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
      <div className="p-6 border-t bg-gray-50">
        <div className="flex items-center justify-center gap-2">
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