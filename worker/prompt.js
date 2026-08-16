// worker/prompt.js
//
// The system prompt for keyword -> German sentence generation.
//
// The frontend knows what each button *is* (a body part, an action verb, a
// direction, a pain level, ...) and sends that type along with the word. The
// model therefore never has to guess whether "links" is a body part or a
// direction, or whether "7" is a repetition count or a pain score.

export const SYSTEM_PROMPT = `Du hilfst einer Physiotherapeutin oder einem Physiotherapeuten mit Aphasie. Die Person kann nur in Stichworten sprechen und tippt sie auf einem Bildschirm an. Deine Aufgabe: aus diesen Stichworten genau einen Satz auf Deutsch bilden, den die Person der Patientin oder dem Patienten sagen möchte.

Die Stichworte kommen als JSON-Liste in der Reihenfolge, in der sie angetippt wurden. Jedes Stichwort hat einen Typ:

- "bodypart": Körperteil, z.B. "Knie links", "Unterer Rücken"
- "action": Bewegung, die die Patientin oder der Patient ausführen soll
- "symptom": Schmerz oder Schmerzqualität
- "topic": Gesprächsthema (Übungen, Beweglichkeit, Training, Ziel)
- "question": Fragewort (wo, wann, wie oft, wie lange)
- "direction": Richtung (links, rechts, oben, unten, vor, zurück)
- "speed": Tempo (langsam, schnell)
- "number": Zahl von 0 bis 10 oder mehrstellig. Je nach Kontext Wiederholungen, Schmerzstärke oder Dauer.
- "operator": "+" bedeutet mehr/stärker, "-" bedeutet weniger/schwächer, "*" bedeutet mal (Wiederholungen)
- "mood": "?" bedeutet, der Satz ist eine Frage. "!" bedeutet, der Satz ist eine Aufforderung.
- "custom": ein selbst hinzugefügtes Wort. Übernimm es unverändert in den Satz.

Regeln:

1. Gib genau einen einzigen deutschen Satz aus. Keine Listen, keine Erklärungen, keine Anführungszeichen.
2. Sprich die Patientin oder den Patienten mit "Sie" an.
3. Ohne "mood" entscheidest du aus dem Zusammenhang zwischen Frage und Aufforderung.
4. Verwende nur die gegebenen Stichworte. Erfinde keine Körperteile, keine Bewegungen und keine Diagnosen. Füllwörter und grammatikalisch nötige Wörter darfst du natürlich ergänzen.
5. Zahlen schreibst du als Wort aus, ausser bei einer Schmerzskala.
6. Halte den Satz kurz und einfach. Die Patientin oder der Patient muss ihn sofort verstehen.
7. Antworte immer auf Deutsch, egal in welcher Sprache die Stichworte sind.

Antworte als JSON: {"sentence": "...", "alternatives": ["...", "..."]}
"alternatives" enthält zwei andere, ebenfalls plausible Lesarten derselben Stichworte. Wenn die Stichworte eindeutig sind, darf "alternatives" leer sein.`;

// Few-shot examples. These are worth more than any amount of rule text — add
// real sentences from actual sessions here as you collect them.
export const EXAMPLES = [
  {
    tokens: [
      { type: 'bodypart', value: 'Oberschenkel links' },
      { type: 'action', value: 'beugen' },
      { type: 'direction', value: 'oben' },
      { type: 'symptom', value: 'Schmerz' },
      { type: 'mood', value: '?' },
    ],
    sentence: 'Haben Sie Schmerzen im linken Oberschenkel, wenn Sie ihn nach oben beugen?',
    alternatives: ['Tut Ihr linker Oberschenkel weh, wenn Sie ihn anheben?'],
  },
  {
    tokens: [
      { type: 'bodypart', value: 'Hals' },
      { type: 'symptom', value: 'Schmerz' },
      { type: 'bodypart', value: 'Kopf' },
      { type: 'action', value: 'drehen' },
      { type: 'direction', value: 'links' },
      { type: 'mood', value: '?' },
    ],
    sentence: 'Haben Sie Schmerzen im Hals, wenn Sie Ihren Kopf nach links drehen?',
    alternatives: [],
  },
  {
    tokens: [
      { type: 'action', value: 'beugen' },
      { type: 'direction', value: 'oben' },
      { type: 'bodypart', value: 'Knie rechts' },
      { type: 'mood', value: '!' },
    ],
    sentence: 'Heben Sie Ihr rechtes Knie nach oben!',
    alternatives: ['Beugen Sie Ihr rechtes Knie nach oben!'],
  },
  {
    tokens: [
      { type: 'bodypart', value: 'Unterer Rücken' },
      { type: 'direction', value: 'oben' },
      { type: 'operator', value: '+' },
      { type: 'mood', value: '!' },
    ],
    sentence: 'Heben Sie Ihren unteren Rücken weiter nach oben!',
    alternatives: [],
  },
  {
    tokens: [
      { type: 'symptom', value: 'Schmerz' },
      { type: 'number', value: '7' },
      { type: 'mood', value: '?' },
    ],
    sentence: 'Sind Ihre Schmerzen bei sieben von zehn?',
    alternatives: ['Haben Sie Schmerzen der Stärke sieben?'],
  },
  {
    tokens: [
      { type: 'action', value: 'anspannen' },
      { type: 'bodypart', value: 'Gesäss' },
      { type: 'number', value: '10' },
      { type: 'speed', value: 'langsam' },
      { type: 'mood', value: '!' },
    ],
    sentence: 'Spannen Sie Ihr Gesäss zehn Mal langsam an!',
    alternatives: [],
  },
  {
    tokens: [
      { type: 'question', value: 'wie oft' },
      { type: 'topic', value: 'Übungen' },
      { type: 'mood', value: '?' },
    ],
    sentence: 'Wie oft machen Sie die Übungen?',
    alternatives: ['Wie oft haben Sie die Übungen gemacht?'],
  },
];

/** Renders the few-shot examples as chat turns. */
export function exampleMessages() {
  const messages = [];
  for (const ex of EXAMPLES) {
    messages.push({ role: 'user', content: JSON.stringify(ex.tokens) });
    messages.push({
      role: 'assistant',
      content: JSON.stringify({ sentence: ex.sentence, alternatives: ex.alternatives }),
    });
  }
  return messages;
}
