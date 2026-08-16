// Run with: npm test
//
// The template layer is pure logic with no network, so it is cheap to pin
// down. These cases are the sentences a therapist builds most often.

import { strict as assert } from 'node:assert';
import test from 'node:test';
import { renderTemplate } from '../templates.js';

const t = (type, value) => ({ type, value });

test('imperative with body part and direction', () => {
  assert.equal(
    renderTemplate([
      t('action', 'beugen'),
      t('bodypart', 'Knie rechts'),
      t('direction', 'oben'),
      t('mood', '!'),
    ]),
    'Beugen Sie Ihr rechtes Knie nach oben!'
  );
});

test('separable verb keeps the particle at the end', () => {
  assert.equal(
    renderTemplate([
      t('action', 'anspannen'),
      t('bodypart', 'Gesäss'),
      t('number', '10'),
      t('speed', 'langsam'),
      t('mood', '!'),
    ]),
    'Spannen Sie Ihr Gesäss zehn Mal langsam an!'
  );
});

test('feminine body parts decline correctly', () => {
  assert.equal(
    renderTemplate([t('action', 'bewegen'), t('bodypart', 'Schulter links'), t('mood', '!')]),
    'Bewegen Sie Ihre linke Schulter!'
  );
});

test('pain question uses the dative', () => {
  assert.equal(
    renderTemplate([t('symptom', 'Schmerz'), t('bodypart', 'Hüfte rechts'), t('mood', '?')]),
    'Haben Sie Schmerzen in der rechten Hüfte?'
  );
});

test('pain question with a movement becomes a subordinate clause', () => {
  assert.equal(
    renderTemplate([
      t('symptom', 'Schmerz'),
      t('bodypart', 'Oberschenkel links'),
      t('action', 'beugen'),
      t('direction', 'oben'),
      t('mood', '?'),
    ]),
    'Haben Sie Schmerzen im linken Oberschenkel, wenn Sie ihn nach oben beugen?'
  );
});

test('pain level question without a body part', () => {
  assert.equal(
    renderTemplate([t('symptom', 'Schmerz'), t('number', '7'), t('mood', '?')]),
    'Sind Ihre Schmerzen bei 7 von zehn?'
  );
});

test('fixed question words', () => {
  assert.equal(
    renderTemplate([t('question', 'wo'), t('symptom', 'Schmerz'), t('mood', '?')]),
    'Wo haben Sie Schmerzen?'
  );
});

test('a canned phrase is returned verbatim', () => {
  const phrase = 'Möchten Sie noch etwas fragen?';
  assert.equal(renderTemplate([t('phrase', phrase)]), phrase);
});

test('unknown body parts fall through to the model', () => {
  assert.equal(
    renderTemplate([t('action', 'beugen'), t('bodypart', 'Knie innen'), t('mood', '!')]),
    null
  );
});

test('custom words fall through to the model', () => {
  assert.equal(renderTemplate([t('custom', 'tschutte'), t('mood', '!')]), null);
});

test('two body parts are too ambiguous to template', () => {
  assert.equal(
    renderTemplate([t('bodypart', 'Knie links'), t('bodypart', 'Fuss links'), t('mood', '!')]),
    null
  );
});

test('intransitive verbs take no object', () => {
  assert.equal(renderTemplate([t('action', 'zuschauen'), t('mood', '!')]), 'Schauen Sie zu!');
});
