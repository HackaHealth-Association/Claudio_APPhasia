import { strict as assert } from 'node:assert';
import test from 'node:test';
import { normalizeTokens, parseReply } from '../sentence.js';

test('parses the JSON the prompt asks for', () => {
  const r = parseReply('{"sentence":"Heben Sie Ihr Bein!","alternatives":["Strecken Sie Ihr Bein!"]}');
  assert.equal(r.sentence, 'Heben Sie Ihr Bein!');
  assert.deepEqual(r.alternatives, ['Strecken Sie Ihr Bein!']);
});

test('accepts a plain sentence when the model ignores JSON mode', () => {
  assert.equal(parseReply('Heben Sie Ihr Bein!').sentence, 'Heben Sie Ihr Bein!');
});

test('unwraps a markdown code fence', () => {
  const r = parseReply('```json\n{"sentence":"Heben Sie Ihr Bein!"}\n```');
  assert.equal(r.sentence, 'Heben Sie Ihr Bein!');
});

test('drops a reasoning block instead of speaking it', () => {
  const r = parseReply('<think>The user wants...</think>{"sentence":"Heben Sie Ihr Bein!"}');
  assert.equal(r.sentence, 'Heben Sie Ihr Bein!');
});

test('an unterminated reasoning block yields nothing to say', () => {
  assert.equal(parseReply('<think>Here is a thinking process: 1. Analyze').sentence, '');
});

test('strips surrounding quotes and keeps one line', () => {
  assert.equal(parseReply('"Heben Sie Ihr Bein!"\nNoch ein Satz.').sentence, 'Heben Sie Ihr Bein!');
});

test('plain strings from an older client are still accepted', () => {
  assert.deepEqual(normalizeTokens(['Knie', 'beugen']), [
    { type: 'custom', value: 'Knie' },
    { type: 'custom', value: 'beugen' },
  ]);
});

test('unknown token types degrade to custom rather than being dropped', () => {
  assert.deepEqual(normalizeTokens([{ type: 'nonsense', value: 'Knie' }]), [
    { type: 'custom', value: 'Knie' },
  ]);
});
