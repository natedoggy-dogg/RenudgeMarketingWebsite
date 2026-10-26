// Prints every library template with its item count, and the items that only
// have an operator label. Compare the counts with the library's own tests or
// data before trusting a template page.
//
// Usage: node scripts/print-library.ts

import { getClientWordingGaps, getTemplateItems, getTemplates, LibraryUnavailableError } from '../src/lib/library.ts';

try {
  const templates = await getTemplates();
  for (const t of templates) {
    const items = await getTemplateItems(t.id);
    console.log(`${t.id.padEnd(40)} ${String(items.length).padStart(3)} items  ${t.name}`);
  }
  console.log(`\n${templates.length} templates`);
  const gaps = await getClientWordingGaps();
  if (gaps.length) {
    console.log(`\n${gaps.length} items have no client-facing wording (report these; don't fill them in):`);
    for (const g of gaps) console.log(`  ${g.templateId}: ${g.operatorLabel}`);
  }
} catch (e) {
  if (e instanceof LibraryUnavailableError) {
    console.error(`library: ${e.message}`);
    process.exit(1);
  }
  throw e;
}
