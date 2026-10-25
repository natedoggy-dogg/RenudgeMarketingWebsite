import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildCss, TokenError } from './build-tokens.ts';

const real = () => JSON.parse(readFileSync(new URL('../design/tokens.json', import.meta.url), 'utf8'));
const color = (t: any, name: string) => t.color.tokens.find((c: any) => c.name === name);

test('the real tokens build', () => {
  const css = buildCss(real());
  assert.match(css, /--paper: #faf9f6;/);
  assert.match(css, /--focus: var\(--nudge\);/);
  assert.match(css, /\.display-xl \{/);
  assert.match(css, /--font-display: "Newsreader Variable", Newsreader/);
});

test('a malformed hex fails', () => {
  const t = real();
  color(t, 'paper').value.light = '#fafaf';
  assert.throws(() => buildCss(t), (e) => e instanceof TokenError && /color\.tokens\.0\.value/.test(e.message));
});

test('a missing dark value fails', () => {
  const t = real();
  delete color(t, 'ink').value.dark;
  assert.throws(() => buildCss(t), TokenError);
});

test('an alias to an unknown token fails', () => {
  const t = real();
  color(t, 'focus').value = '{nudj}';
  assert.throws(() => buildCss(t), /aliases unknown token "nudj"/);
});

test('a product token that changes in dark fails', () => {
  const t = real();
  color(t, 'product-surface').value.dark = '#000000';
  assert.throws(() => buildCss(t), /product token "product-surface" differs between themes/);
});

test('an operator token that changes in dark fails', () => {
  const t = real();
  color(t, 'operator-teal').value.dark = '#14b8a6';
  assert.throws(() => buildCss(t), /operator-teal/);
});

test('a non-px spacing value fails', () => {
  const t = real();
  t.spacing.tokens[0].value = '4';
  assert.throws(() => buildCss(t), /spacing\.tokens\.0\.value: must be a px value/);
});

test('an unreadable mobile size fails', () => {
  const t = real();
  t.type.groups[0].styles[0].usage = 'Hero headline. Smaller on mobile.';
  assert.throws(() => buildCss(t), /mobile size that can't be read/);
});

test('a duplicate name fails', () => {
  const t = real();
  t.color.tokens.push({ ...color(t, 'paper') });
  assert.throws(() => buildCss(t), /duplicate token name "paper"/);
});
