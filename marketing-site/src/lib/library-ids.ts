// The template ids the templates schema checks libraryTemplateId against.
// Returns the ids, or the reason they can't be read: then every template entry
// fails, so nothing publishes against a library nobody has read.
//
// The content fixtures supply their own ids through LIBRARY_FIXTURE_IDS
// (comma-separated); nothing else may set it.

import { getTemplates, LibraryUnavailableError } from './library';

export async function libraryTemplateIds(): Promise<Set<string> | string> {
  if (process.env.LIBRARY_FIXTURE_IDS !== undefined)
    return new Set(process.env.LIBRARY_FIXTURE_IDS.split(',').filter(Boolean));
  try {
    return new Set((await getTemplates()).map((t) => t.id));
  } catch (e) {
    if (e instanceof LibraryUnavailableError) return `can't check libraryTemplateId: ${e.message}`;
    throw e;
  }
}
