// src/data/vocabulary.js
//
// Every word the app can say, in one place.
//
// Each entry carries the `type` the backend needs to build a correct German
// sentence — a body part is not a direction, and a "7" on the pain slider is
// not seven repetitions. Adding a button is a matter of adding one line here.

import SchmerzIcon from '../assets/icons/Schmerz.png';
import ZuschauenIcon from '../assets/icons/Zuschauen.png';
import BewegenIcon from '../assets/icons/Bewegen.png';
import BeugenIcon from '../assets/icons/Beugen.png';
import AnspannenIcon from '../assets/icons/Anspannen.png';
import StreckenIcon from '../assets/icons/Strecken.png';
import WiederholenIcon from '../assets/icons/Wiederholen.png';
import ZielIcon from '../assets/icons/Ziel.png';

import GefuehlIcon from '../assets/icons/Gefühl.png';
import FrageIcon from '../assets/icons/Question.png';
import UebungenIcon from '../assets/icons/Übungen.png';
import BeweglichkeitIcon from '../assets/icons/Beweglichkeit.png';
import SpitzIcon from '../assets/icons/Spitz.png';
import StumpfIcon from '../assets/icons/Stumpf.png';
import WoIcon from '../assets/icons/Wo.png';
import WannIcon from '../assets/icons/Wann.png';
import WieLangIcon from '../assets/icons/Wie_lang.png';
import WieOftIcon from '../assets/icons/Wie_oft.png';
import TrainingIcon from '../assets/icons/Training.png';
import AkutIcon from '../assets/icons/Akut.png';
import ChronischIcon from '../assets/icons/Chronisch.png';

import MultiplicationIcon from '../assets/icons/Multiplication.png';
import SubtractionIcon from '../assets/icons/Subtraction.png';
import AdditionIcon from '../assets/icons/Addition.png';
import ExclamationIcon from '../assets/icons/Exclamation.png';
import QuestionIcon from '../assets/icons/Question.png';
import LangsamIcon from '../assets/icons/Langsam.png';
import SchnellIcon from '../assets/icons/Schnell.png';
import DrehenIcon from '../assets/icons/Drehen.png';
import NeigenIcon from '../assets/icons/Neigen.png';

import UpArrow from '../assets/icons/up_arrow.png';
import DownArrow from '../assets/icons/down_arrow.png';
import LeftArrow from '../assets/icons/left_arrow.png';
import RightArrow from '../assets/icons/right_arrow.png';
import TwoSideArrow from '../assets/icons/two_side_arrow.png';

/** Movement and symptom buttons on the "Erweitert" tab. */
export const ACTION_BUTTONS = [
  { value: 'Schmerz', type: 'symptom', icon: SchmerzIcon, color: 'bg-red-500 hover:bg-red-600' },
  { value: 'zuschauen', type: 'action', icon: ZuschauenIcon, color: 'bg-yellow-400 hover:bg-yellow-500' },
  { value: 'bewegen', type: 'action', icon: BewegenIcon, color: 'bg-pink-400 hover:bg-pink-500' },
  { value: 'anspannen', type: 'action', icon: AnspannenIcon, color: 'bg-orange-400 hover:bg-orange-500' },
  { value: 'beugen', type: 'action', icon: BeugenIcon, color: 'bg-purple-300 hover:bg-purple-400' },
  { value: 'strecken', type: 'action', icon: StreckenIcon, color: 'bg-cyan-500 hover:bg-cyan-600' },
  { value: 'wiederholen', type: 'action', icon: WiederholenIcon, color: 'bg-gray-400 hover:bg-gray-500' },
  { value: 'ziel', type: 'topic', icon: ZielIcon, color: 'bg-blue-500 hover:bg-blue-600' },
];

/** Symptom, topic and question-word buttons on the "Fragen" tab. */
export const RESPONSE_BUTTONS = [
  { value: 'Schmerz', type: 'symptom', icon: SchmerzIcon, color: 'bg-red-500 hover:bg-red-600 text-black' },
  { value: 'stumpf', type: 'symptom', icon: StumpfIcon, color: 'bg-red-400 hover:bg-red-600 text-black' },
  { value: 'spitz', type: 'symptom', icon: SpitzIcon, color: 'bg-red-300 hover:bg-red-600 text-black' },
  { value: 'Übungen', type: 'topic', icon: UebungenIcon, color: 'bg-blue-500 hover:bg-blue-600 text-black' },
  { value: 'Beweglichkeit', type: 'topic', icon: BeweglichkeitIcon, color: 'bg-blue-400 hover:bg-blue-600 text-black' },
  { value: 'Training', type: 'topic', icon: TrainingIcon, color: 'bg-blue-300 hover:bg-blue-600 text-black' },
  { value: 'wo', type: 'question', icon: WoIcon, color: 'bg-yellow-400 hover:bg-yellow-500 text-black' },
  { value: 'wann', type: 'question', icon: WannIcon, color: 'bg-yellow-300 hover:bg-yellow-500 text-black' },
  { value: 'wie oft', type: 'question', icon: WieOftIcon, color: 'bg-yellow-200 hover:bg-yellow-500 text-black' },
  { value: 'wie lange', type: 'question', icon: WieLangIcon, color: 'bg-green-300 hover:bg-green-500 text-black' },
  { value: 'akut', type: 'symptom', icon: AkutIcon, color: 'bg-green-200 hover:bg-green-500 text-black' },
  { value: 'chronisch', type: 'symptom', icon: ChronischIcon, color: 'bg-green-100 hover:bg-green-500 text-black' },
];

/**
 * Complete sentences on their own buttons. These are spoken verbatim — they
 * never go near the model, so they always say exactly what is written here.
 */
export const PHRASE_BUTTONS = [
  {
    id: 'how-are-you',
    label: "Wie geht's?",
    type: 'phrase',
    icon: GefuehlIcon,
    value:
      'Erzählen Sie mir Tag für Tag, wie sich Ihre Beschwerden seit der letzten Physiotherapie verändert haben.',
  },
  {
    id: 'any-questions',
    label: 'Noch Fragen?',
    type: 'phrase',
    icon: FrageIcon,
    value: 'Möchten Sie noch etwas fragen?',
  },
];

export const DIRECTIONS = [
  { value: 'links', type: 'direction', icon: LeftArrow },
  { value: 'oben', type: 'direction', icon: UpArrow },
  { value: 'rechts', type: 'direction', icon: RightArrow },
  { value: 'vor', type: 'direction', icon: TwoSideArrow },
  { value: 'unten', type: 'direction', icon: DownArrow },
  { value: 'zurück', type: 'direction', icon: TwoSideArrow },
];

// `caption` is the text under the button; the phrase bar keeps showing the
// symbol itself, which is what the therapist is used to reading back.
export const OPERATORS = [
  { value: '-', type: 'operator', caption: 'minus', icon: SubtractionIcon },
  { value: '+', type: 'operator', caption: 'plus', icon: AdditionIcon },
  { value: '*', type: 'operator', caption: 'mal', icon: MultiplicationIcon },
];

export const MOODS = [
  { value: '?', type: 'mood', caption: 'Frage', icon: QuestionIcon },
  { value: '!', type: 'mood', caption: 'Aussage', icon: ExclamationIcon },
];

export const SPEEDS = [
  { value: 'langsam', type: 'speed', icon: LangsamIcon },
  { value: 'schnell', type: 'speed', icon: SchnellIcon },
];

export const ROTATIONS = [
  { value: 'drehen', type: 'action', icon: DrehenIcon },
  { value: 'neigen', type: 'action', icon: NeigenIcon },
];
