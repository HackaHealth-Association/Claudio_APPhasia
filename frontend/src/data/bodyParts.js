// src/data/bodyParts.js
//
// Click targets on the body images, in the coordinate space of the source
// image (672 x 1536). A tap is matched to the nearest point within
// MAX_TAP_DISTANCE — beyond that nothing is selected, so tapping empty space
// no longer picks a random body part.

export const IMAGE_WIDTH = 672;
export const IMAGE_HEIGHT = 1536;

/** In image pixels. Roughly a quarter of the body's width. */
export const MAX_TAP_DISTANCE = 170;

export const VIEWS = [
  { id: 'front', label: 'Vorderseite', title: 'Vorderansicht' },
  { id: 'back', label: 'Hinterseite', title: 'Rückansicht' },
  { id: 'left', label: 'Linke Seite', title: 'Linke Seite' },
  { id: 'right', label: 'Rechte Seite', title: 'Rechte Seite' },
];

export const BODY_PART_COORDS = {
  front: [
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
  ],
  back: [
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
  ],
  left: [
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
  ],
  right: [
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
  ],
};

/** Nearest body part to a point in image coordinates, or null if too far. */
export function findBodyPart(view, x, y) {
  const parts = BODY_PART_COORDS[view];
  if (!parts) return null;

  let closest = null;
  let smallest = Infinity;
  for (const part of parts) {
    const distance = Math.hypot(part.x - x, part.y - y);
    if (distance < smallest) {
      smallest = distance;
      closest = part;
    }
  }
  return smallest <= MAX_TAP_DISTANCE ? closest : null;
}
