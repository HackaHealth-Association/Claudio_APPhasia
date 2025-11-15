import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * BodyPartMuscles Component
 * 
 * PURPOSE: Displays muscles that are DEPENDENT on the selected body part
 * 
 * KEY CONCEPT: This component demonstrates the DEPENDENCY relationship:
 * - When user clicks a body part (e.g., "Schulter") → Shows shoulder muscles
 * - When user clicks "Knie" → Shows knee muscles
 * - Each body part has its own specific list of muscles
 * 
 * WORKFLOW:
 * 1. User clicks body part in AnatomyViewer
 * 2. selectedBodyPart prop updates
 * 3. This component looks up muscles for that body part
 * 4. Displays the relevant muscles in blue buttons
 * 5. User can click a muscle to add it to the phrase
 * 
 * WHY THE NAME CHANGE:
 * - Old name: MuscleSelector (generic, doesn't show relationship)
 * - New name: BodyPartMuscles (clearly shows: muscles DEPEND ON body part)
 */

/**
 * ============================================================
 * MUSCLE DATABASE - DEPENDENCY MAPPING
 * ============================================================
 * 
 * This object defines which muscles belong to which body part.
 * This is the CORE DEPENDENCY that makes this component dynamic.
 * 
 * FORMAT: { 'BodyPartName': ['Muscle1', 'Muscle2', ...] }
 * 
 * TODO: Expand this list with accurate anatomical muscle names
 * TODO: Verify muscle names with physiotherapy expert
 */
const musclesByBodyPart = {
  // Nacken (Neck) - muscles in the neck region
  'Nacken': [
    'Trapezius',
    'Sternocleidomastoideus',
    'Levator scapulae',
    'Splenius capitis'
  ],
  
  // Schulter (Shoulder) - shoulder muscles
  'Schulter': [
    'Deltoideus anterior',
    'Deltoideus medius',
    'Deltoideus posterior',
    'Supraspinatus'
  ],
  
  // Oberarm (Upper arm) - upper arm muscles
  'Oberarm': [
    'Bizeps brachii',
    'Trizeps brachii',
    'Brachialis',
    'Coracobrachialis'
  ],
  
  // Ellbogen (Elbow) - elbow area muscles
  'Ellbogen': [
    'Brachioradialis',
    'Anconeus',
    'Bizeps Sehne',
    'Trizeps Sehne'
  ],
  
  // Unterarm (Forearm) - forearm muscles
  'Unterarm': [
    'Flexor carpi radialis',
    'Extensor carpi',
    'Pronator teres',
    'Supinator'
  ],
  
  // Wirbelsäule (Spine) - spinal muscles
  'Wirbelsäule': [
    'Erector spinae',
    'Multifidus',
    'Latissimus dorsi',
    'Quadratus lumborum'
  ],
  
  // Hüfte (Hip) - hip muscles
  'Hüfte': [
    'Gluteus maximus',
    'Gluteus medius',
    'Iliopsoas',
    'Piriformis'
  ],
  
  // Oberschenkel (Thigh) - thigh muscles
  'Oberschenkel': [
    'Quadrizeps femoris',
    'Hamstrings',
    'Adduktoren',
    'Tensor fasciae latae'
  ],
  
  // Knie (Knee) - knee area muscles
  'Knie': [
    'Vastus medialis',
    'Patellarsehne',
    'Pes anserinus',
    'Popliteus'
  ],
  
  // Unterschenkel (Lower leg) - lower leg muscles
  'Unterschenkel': [
    'Gastrocnemius',
    'Soleus',
    'Tibialis anterior',
    'Peroneus longus'
  ],
  
  // Fuß (Foot) - foot muscles
  'Fuß': [
    'Flexor digitorum',
    'Extensor digitorum',
    'Achillessehne',
    'Plantarfaszie'
  ],
  
  // Default fallback - shown when no body part is selected
  'default': [
    'Wählen Sie zuerst',
    'einen Körperbereich',
    'aus dem Bild',
    'links'
  ]
};

export default function BodyPartMuscles({ selectedBodyPart, selectedMuscle, onMuscleClick }) {
  /**
   * PROPS:
   * - selectedBodyPart: string - The currently selected body part from AnatomyViewer
   *                              THIS IS THE KEY DEPENDENCY - changes which muscles are shown
   * - selectedMuscle: string - The currently selected muscle (for highlighting)
   * - onMuscleClick: function - Callback when a muscle button is clicked
   */

  /**
   * DYNAMIC MUSCLE LOOKUP
   * This line demonstrates the DEPENDENCY:
   * - If selectedBodyPart is "Schulter" → shows shoulder muscles
   * - If selectedBodyPart is "Knie" → shows knee muscles
   * - If no body part selected → shows default message
   */
  const muscles = musclesByBodyPart[selectedBodyPart] || musclesByBodyPart['default'];
  
  return (
    <Card className="bg-white border-2 border-gray-300 h-full flex flex-col">
      {/* 
        HEADER SECTION
        Shows which body part's muscles are currently displayed
        This makes the DEPENDENCY visible to the user
      */}
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-700">
          {/* Dynamic title showing current body part */}
          {selectedBodyPart ? `Muskeln: ${selectedBodyPart}` : 'Muskeln'}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {/* Instruction text explaining the dependency */}
          {selectedBodyPart 
            ? 'Muskeln für den ausgewählten Bereich' 
            : 'Wählen Sie einen Körperbereich aus'}
        </p>
      </div>
      
      {/* 
        MUSCLE BUTTONS SECTION
        Displays all muscles for the selected body part
        These buttons are DEPENDENT on the selectedBodyPart prop
      */}
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        {muscles.map((muscle, index) => (
          <Button
            key={index}
            onClick={() => onMuscleClick(muscle)}
            // Only allow clicking if not default message
            disabled={!selectedBodyPart}
            className={`w-full h-16 text-lg font-semibold transition-all ${
              // Highlight selected muscle
              selectedMuscle === muscle
                ? 'bg-blue-700 hover:bg-blue-800 text-white ring-4 ring-blue-300'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {muscle}
          </Button>
        ))}
      </div>
      
      {/* 
        VISUAL INDICATOR
        Shows connection between body part selection and muscle display
      */}
      {selectedBodyPart && (
        <div className="p-3 bg-blue-50 border-t border-blue-200">
          <p className="text-xs text-blue-700 text-center">
            ↑ Diese Muskeln gehören zu: <strong>{selectedBodyPart}</strong>
          </p>
        </div>
      )}
    </Card>
  );
}