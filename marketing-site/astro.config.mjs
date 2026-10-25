// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Product code is read by path, never copied. These paths are where the
// folders sit in the product monorepo. While the site lives in its own repo,
// snapshots sit at the same relative paths (see MIGRATION.md).
const libraryPath = fileURLToPath(new URL('../packages/library', import.meta.url));
const legalPath = fileURLToPath(new URL('../legal', import.meta.url));

export default defineConfig({
  site: 'https://www.renudge.it',
  output: 'static',
  trailingSlash: 'never',
  integrations: [mdx(), react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@library': libraryPath,
        '@legal': legalPath,
      },
    },
  },
});
