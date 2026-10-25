---
name: slug-change
description: Rename or move a page URL without losing links or search equity.
---

# Slug change

1. Confirm the old and new paths with Nathan.
2. Move or rename the content file and update its slug.
3. Add `{ from: old, to: new, status: 301 }` to `src/data/redirects.json`. If any existing redirect points to the old path, repoint it to the new one, so there are no chains.
4. Search the whole site (content, components, data, nav, footer, `llms.txt` sources) for the old path and update every link.
5. Rebuild and run `scripts/check-links.ts` and the related-links scorer.
6. Verify on the local Worker preview that the old URL returns a 301 to the new one, and that the new page is in the sitemap while the old one isn't.
7. Summarise every file changed.
