// Whether a template id exists in the task library, for the templates schema.
// Returns true, or the reason it can't be confirmed.
//
// Step 0.6 replaces the lookup with the library adapter once packages/library
// is available. Until then, every template entry fails, so nothing can publish
// against a library we haven't read. The content fixtures supply their own id
// list through LIBRARY_FIXTURE_IDS (comma-separated); nothing else may set it.

import { existsSync } from 'node:fs';

const LIBRARY_PATH = '../packages/library';

let ids: Set<string> | null = null;
function knownIds(): Set<string> | string {
  if (process.env.LIBRARY_FIXTURE_IDS !== undefined)
    return new Set(process.env.LIBRARY_FIXTURE_IDS.split(',').filter(Boolean));
  if (!existsSync(LIBRARY_PATH))
    return `can't check libraryTemplateId: ${LIBRARY_PATH} isn't available (see MIGRATION.md)`;
  return `can't check libraryTemplateId: the library adapter isn't built yet (step 0.6)`;
}

export function templateIdExists(id: string): true | string {
  const known = ids ?? knownIds();
  if (typeof known === 'string') return known;
  ids = known;
  return known.has(id) ? true : `libraryTemplateId "${id}" isn't in @library`;
}
