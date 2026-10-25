---
name: new-page
description: Build a one-off marketing page (security, about, use cases) from the component library. Use when asked to add or rebuild a page that isn't a template, vertical, comparison, tool or case study.
---

# New page

1. Read `CLAUDE.md` and `design/README.md` if they're not already in context.
2. Ask, or find in `docs/source/`, the page's job in one sentence and who it's for (practitioner, buyer, or both). Stop if neither exists.
3. Create `src/content/pages/<slug>.mdx` with `title` (≤ 60 chars), `description` (≤ 155 chars) and `eyebrow`.
4. Compose it from existing components only, in this order: `Hero`, sections (each opened by `SectionHead`), then `CTABand`. If a section needs something no component does, stop and propose a component rather than one-off markup.
5. Route every product fact through `claims.json`. If a claim isn't there yet, add it with a repo or doc `source`, or leave a placeholder and say so.
6. Use `product-visual` for any product image.
7. Run `claims-check`, then `seo-aeo-preflight`. Fix what they report.
8. Show the page on the local preview at 360px and 1280px, in both themes. Summarise placeholders and open questions.
