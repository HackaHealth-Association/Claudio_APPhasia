// worker/templates.js
//
// A small German grammar for the most common button combinations.
//
// Why this exists: "Knie links + beugen + oben + !" is a fixed sentence
// pattern, not a creative writing task. Handling it here makes the output
// instant, free, and byte-identical every single time — which matters more
// than variety when a therapist has to trust what the button will say. Any
// combination this file does not recognise falls through to the model.

const M = 'm', F = 'f', N = 'n', PL = 'pl';

// Gender of every body part the anatomy viewer can produce. A part that is
// missing here simply falls through to the model.
const BODY_PARTS = {
  'Kopf': M, 'Hals': M, 'Nacken': M, 'Schulter': F, 'Oberarm': M, 'Unterarm': M,
  'Hand': F, 'Handgelenk': N, 'Ellbogen': M, 'Finger': M, 'Brust': F, 'Bauch': M,
  'Rippen': PL, 'Gesäss': N, 'Hüfte': F, 'Oberschenkel': M, 'Unterschenkel': M,
  'Knie': N, 'Fuss': M, 'Fussgelenk': N,
  'Oberer Rücken': M, 'Mittlerer Rücken': M, 'Unterer Rücken': M,
};

// Verbs, with the separable prefix split off where there is one.
const VERBS = {
  beugen:      { head: 'Beugen',    infinitive: 'beugen',      particle: null, transitive: true },
  strecken:    { head: 'Strecken',  infinitive: 'strecken',    particle: null, transitive: true },
  bewegen:     { head: 'Bewegen',   infinitive: 'bewegen',     particle: null, transitive: true },
  drehen:      { head: 'Drehen',    infinitive: 'drehen',      particle: null, transitive: true },
  neigen:      { head: 'Neigen',    infinitive: 'neigen',      particle: null, transitive: true },
  anspannen:   { head: 'Spannen',   infinitive: 'anspannen',   particle: 'an', transitive: true },
  wiederholen: { head: 'Wiederholen', infinitive: 'wiederholen', particle: null, transitive: true },
  zuschauen:   { head: 'Schauen',   infinitive: 'zuschauen',   particle: 'zu', transitive: false },
};

const DIRECTIONS = {
  oben: 'nach oben', unten: 'nach unten', links: 'nach links', rechts: 'nach rechts',
  vor: 'nach vorne', 'zurück': 'nach hinten',
};

const SPEEDS = { langsam: 'langsam', schnell: 'schnell' };

const NUMBER_WORDS = [
  'null', 'ein', 'zwei', 'drei', 'vier', 'fünf',
  'sechs', 'sieben', 'acht', 'neun', 'zehn',
];

/** "zehn" for 10, otherwise the digits — good enough for a repetition count. */
function numberWord(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n < NUMBER_WORDS.length ? NUMBER_WORDS[n] : String(value);
}

/** Splits "Knie links" into { base: "Knie", side: "links" }. */
function splitBodyPart(value) {
  const match = /^(.*?)\s+(links|rechts)$/i.exec(value.trim());
  if (match) return { base: match[1].trim(), side: match[2].toLowerCase() };
  return { base: value.trim(), side: null };
}

/** "Ihr linkes Knie" — accusative object with the side adjective declined. */
function accusative(part) {
  const { base, side } = splitBodyPart(part);
  const gender = BODY_PARTS[base];
  if (!gender) return null;
  const possessive = { m: 'Ihren', f: 'Ihre', n: 'Ihr', pl: 'Ihre' }[gender];
  if (!side) return `${possessive} ${base}`;
  const adjective = { m: 'linken', f: 'linke', n: 'linkes', pl: 'linken' }[gender];
  const declined = side === 'rechts' ? adjective.replace('link', 'recht') : adjective;
  return `${possessive} ${declined} ${base}`;
}

/** "im linken Knie" / "in der linken Schulter" — locative for pain questions. */
function locative(part) {
  const { base, side } = splitBodyPart(part);
  const gender = BODY_PARTS[base];
  if (!gender) return null;
  const preposition = { m: 'im', f: 'in der', n: 'im', pl: 'in den' }[gender];
  if (!side) return `${preposition} ${base}`;
  const adjective = side === 'rechts' ? 'rechten' : 'linken';
  return `${preposition} ${adjective} ${base}`;
}

/** "ihn" / "sie" / "es" — so the second clause does not repeat the body part. */
function pronoun(part) {
  const gender = BODY_PARTS[splitBodyPart(part).base];
  return { m: 'ihn', f: 'sie', n: 'es', pl: 'sie' }[gender] || null;
}

function groupTokens(tokens) {
  const byType = {};
  for (const token of tokens) {
    (byType[token.type] ||= []).push(token.value);
  }
  return byType;
}

/**
 * Returns a finished German sentence, or null when this combination is not one
 * the templates cover — in which case the caller asks the model.
 */
export function renderTemplate(tokens) {
  if (!tokens.length) return null;
  const by = groupTokens(tokens);

  // A canned phrase button carries its own complete sentence. Never rewrite it.
  if (by.phrase?.length === 1 && tokens.length === 1) return by.phrase[0];

  // Anything the templates have no rules for at all.
  if (by.phrase || by.custom || by.operator) return null;

  const mood = by.mood?.[0] ?? null;
  const bodyPart = by.bodypart?.length === 1 ? by.bodypart[0] : null;
  const action = by.action?.length === 1 ? VERBS[by.action[0]] : null;
  const direction = by.direction?.length === 1 ? DIRECTIONS[by.direction[0]] : null;
  const speed = by.speed?.length === 1 ? SPEEDS[by.speed[0]] : null;
  const count = by.number?.length === 1 ? by.number[0] : null;
  const hasPain = (by.symptom || []).includes('Schmerz');
  const question = by.question?.length === 1 ? by.question[0] : null;

  // Bail out on anything ambiguous: several body parts, several verbs, or a
  // symptom qualifier we have no frame for.
  if ((by.bodypart?.length ?? 0) > 1) return null;
  if ((by.action?.length ?? 0) > 1) return null;
  if ((by.symptom || []).some((s) => s !== 'Schmerz')) return null;
  if ((by.topic?.length ?? 0) > 0) return null;
  if (by.direction && !direction) return null;
  if (by.action && !action) return null;

  // --- Frame 1: fixed questions -------------------------------------------
  if (question && mood !== '!') {
    if (question === 'wo' && hasPain) return 'Wo haben Sie Schmerzen?';
    if (question === 'wie lange' && hasPain) return 'Wie lange haben Sie die Schmerzen schon?';
    if (question === 'wie oft' && hasPain) return 'Wie oft haben Sie die Schmerzen?';
    if (question === 'wann' && hasPain) return 'Wann haben Sie die Schmerzen?';
    return null;
  }
  if (question) return null;

  // --- Frame 2: pain question ---------------------------------------------
  if (hasPain && mood === '?') {
    if (!bodyPart) {
      if (count !== null) return `Sind Ihre Schmerzen bei ${count} von zehn?`;
      return 'Haben Sie Schmerzen?';
    }
    const place = locative(bodyPart);
    if (!place) return null;
    if (!action) return `Haben Sie Schmerzen ${place}?`;

    // "..., wenn Sie ihn nach oben beugen?"
    const object = action.transitive ? pronoun(bodyPart) : null;
    if (action.transitive && !object) return null;
    const clause = [
      'wenn Sie',
      object,
      direction,
      speed,
      action.infinitive,
    ].filter(Boolean).join(' ');
    return `Haben Sie Schmerzen ${place}, ${clause}?`;
  }

  // --- Frame 3: imperative -------------------------------------------------
  if (action && mood !== '?') {
    const parts = [`${action.head} Sie`];
    if (action.transitive) {
      if (!bodyPart) return null;
      const object = accusative(bodyPart);
      if (!object) return null;
      parts.push(object);
    } else if (bodyPart) {
      return null; // "zuschauen" takes no object
    }
    if (count !== null) parts.push(`${numberWord(count)} Mal`);
    if (speed) parts.push(speed);
    if (direction) parts.push(direction);
    if (action.particle) parts.push(action.particle);
    return `${parts.join(' ')}!`;
  }

  // --- Frame 4: body part on its own --------------------------------------
  if (bodyPart && !action && !hasPain) {
    const place = locative(bodyPart);
    if (!place) return null;
    if (mood === '?') return `Spüren Sie etwas ${place}?`;
  }

  return null;
}
