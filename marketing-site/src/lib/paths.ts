// Build-time paths. Astro bundles pages before rendering them, so
// import.meta.url doesn't point at the source file; resolve from the site root
// (where `astro` runs) instead.
import { pathToFileURL } from 'node:url';

export const SITE_ROOT = pathToFileURL(`${process.cwd()}/`);
export const DESIGN_COMPONENTS = new URL('design/components/', SITE_ROOT);
