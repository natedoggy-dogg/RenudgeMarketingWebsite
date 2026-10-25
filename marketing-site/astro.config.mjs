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

const isProduction = process.env.PUBLIC_ENV === 'production';

// Dev pages (kitchen sink, token and layout checks, design references) live in
// src/dev-pages and are only routed outside production. They stay out of the
// sitemap everywhere.
const DEV_ROUTES = [
  ['/dev/components', './src/dev-pages/components.astro'],
  ['/dev/tokens', './src/dev-pages/tokens.astro'],
  ['/dev/layout', './src/dev-pages/layout.astro'],
  ['/dev/reference/[name]/[theme].html', './src/dev-pages/reference.ts'],
];

/** @type {import('astro').AstroIntegration} */
const devPages = {
  name: 'dev-pages',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      if (isProduction) return;
      for (const [pattern, entrypoint] of DEV_ROUTES) injectRoute({ pattern, entrypoint });
    },
  },
};

export default defineConfig({
  site: 'https://www.renudge.it',
  output: 'static',
  trailingSlash: 'never',
  integrations: [mdx(), react(), sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/dev/') }), devPages],
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
