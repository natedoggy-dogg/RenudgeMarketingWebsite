// The only way the site reads the task library (@library). Template pages take
// every item, count and client-facing string from here, never from MDX.
//
// STATUS: the interface below is what the site's pages need. The mapping from
// the library's real exports (`fromLibrary`) is NOT written: packages/library
// hasn't been available to read, and the brief says not to guess its API. Until
// it is, every call throws LibraryUnavailableError. See MIGRATION.md.

import { existsSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// ---------------------------------------------------------------------------
// What the site needs

export interface LibraryTemplate {
  id: string;
  /** The template's name as operators see it. */
  name: string;
  /** The library's own vertical or category, if it has one. */
  vertical?: string;
  itemCount: number;
}

export interface LibraryItem {
  /** Client-facing wording. Null when the library only has an operator label:
   *  that's a gap to report, never to fill in. */
  clientLabel: string | null;
  clientInstruction: string | null;
  operatorLabel: string;
  kind: string;
  dataType?: string;
  required: boolean;
  whyWeNeedThis?: string;
  failureModes?: string[];
}

export interface ProductFact {
  id: string;
  value: string;
  source?: string;
}

interface Library {
  templates: LibraryTemplate[];
  items: Map<string, LibraryItem[]>;
  facts: Map<string, ProductFact>;
}

export class LibraryUnavailableError extends Error {}

// ---------------------------------------------------------------------------
// Loading

/** Where the library sits relative to marketing-site/, in the monorepo and in
 *  the standalone repo's stand-in alike. */
export const LIBRARY_DIR = new URL('../packages/library/', pathToFileURL(`${process.cwd()}/`));

/** The library's entry point, read from its package.json. */
export function libraryEntry(): URL {
  const pkgUrl = new URL('package.json', LIBRARY_DIR);
  if (!existsSync(pkgUrl))
    throw new LibraryUnavailableError(`packages/library isn't available at ${LIBRARY_DIR.pathname} (see MIGRATION.md)`);
  const pkg = JSON.parse(readFileSync(pkgUrl, 'utf8')) as {
    exports?: string | { '.'?: string | { import?: string; default?: string } };
    module?: string;
    main?: string;
  };
  const dot = typeof pkg.exports === 'string' ? pkg.exports : pkg.exports?.['.'];
  const entry =
    (typeof dot === 'string' ? dot : (dot?.import ?? dot?.default)) ?? pkg.module ?? pkg.main ?? 'index.js';
  return new URL(entry, LIBRARY_DIR);
}

/** Maps the library module's exports to the shape above. Written in step 0.6
 *  after reading packages/library: templates, task types, client-facing
 *  wording, why_we_need_this, failure_modes and product facts. */
function fromLibrary(_mod: Record<string, unknown>): Library {
  throw new LibraryUnavailableError(
    'src/lib/library.ts: fromLibrary() is not written yet. Read packages/library and map its exports (step 0.6).',
  );
}

let cached: Promise<Library> | undefined;
function load(): Promise<Library> {
  cached ??= (async () => {
    const entry = libraryEntry();
    const mod = (await import(/* @vite-ignore */ pathToFileURL(entry.pathname).href)) as Record<string, unknown>;
    return fromLibrary(mod);
  })();
  return cached;
}

// ---------------------------------------------------------------------------
// Public helpers

export async function getTemplates(): Promise<LibraryTemplate[]> {
  return (await load()).templates;
}

export async function getTemplate(id: string): Promise<LibraryTemplate | undefined> {
  return (await load()).templates.find((t) => t.id === id);
}

export async function getTemplateItems(id: string): Promise<LibraryItem[]> {
  const items = (await load()).items.get(id);
  if (!items) throw new Error(`@library has no template "${id}"`);
  return items;
}

export async function getProductFact(id: string): Promise<ProductFact> {
  const fact = (await load()).facts.get(id);
  if (!fact) throw new Error(`@library has no product fact "${id}"`);
  return fact;
}

/** Items that only have an operator label, per template. Reported, not filled. */
export async function getClientWordingGaps(): Promise<{ templateId: string; operatorLabel: string }[]> {
  const lib = await load();
  return [...lib.items].flatMap(([templateId, items]) =>
    items.filter((i) => !i.clientLabel).map((i) => ({ templateId, operatorLabel: i.operatorLabel })),
  );
}
