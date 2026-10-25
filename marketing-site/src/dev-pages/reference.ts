// Serves each design-system preview.html as the design system renders it:
// bundle.css on the generated tokens, in light or dark, with the self-hosted
// fonts in place of the Google Fonts import. The kitchen sink frames these
// beside the ports.
import type { APIRoute, GetStaticPaths } from 'astro';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { DESIGN_COMPONENTS } from '../lib/paths';
import tokensCss from '../styles/tokens.css?raw';
import display from '@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2?url';
import sans400 from '@fontsource/instrument-sans/files/instrument-sans-latin-400-normal.woff2?url';
import sans500 from '@fontsource/instrument-sans/files/instrument-sans-latin-500-normal.woff2?url';
import sans600 from '@fontsource/instrument-sans/files/instrument-sans-latin-600-normal.woff2?url';
import mono400 from '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2?url';
import mono500 from '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2?url';

const DIR = DESIGN_COMPONENTS;

export const getStaticPaths = (() =>
  readdirSync(DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(new URL(`${d.name}/preview.html`, DIR)))
    .flatMap((d) => (['light', 'dark'] as const).map((theme) => ({ params: { name: d.name, theme } })))) satisfies GetStaticPaths;

const face = (family: string, weight: string, url: string) =>
  `@font-face { font-family: '${family}'; font-weight: ${weight}; font-display: swap; src: url(${url}) format('woff2'); }`;

const fonts = [
  face('Newsreader Variable', '200 800', display),
  face('Instrument Sans', '400', sans400),
  face('Instrument Sans', '500', sans500),
  face('Instrument Sans', '600', sans600),
  face('IBM Plex Mono', '400', mono400),
  face('IBM Plex Mono', '500', mono500),
].join('\n');

export const GET: APIRoute = ({ params }) => {
  const bundle = readFileSync(new URL('bundle.css', DIR), 'utf8').replace(/^@import url\([^)]*\);\s*/m, '');
  const preview = readFileSync(new URL(`${params.name}/preview.html`, DIR), 'utf8')
    .replace(/^<!--.*?-->\s*/, '')
    .replace('<html>', `<html data-theme="${params.theme}">`)
    .replace('</head>', `<style>${fonts}\n${tokensCss}\n${bundle}</style></head>`);
  return new Response(preview, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
