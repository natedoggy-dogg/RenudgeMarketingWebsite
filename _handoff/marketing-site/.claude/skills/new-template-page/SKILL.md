---
name: new-template-page
description: Publish or refresh a /templates/[slug] page from a task-library template. Use when asked to add, publish or update a template page.
---

# New template page

1. Read `CLAUDE.md` and `design/README.md` if they're not already in context.
2. Find the template through `src/lib/library.ts` by id or name. If it doesn't exist, stop and ask. Never invent items.
3. Create `src/content/templates/<slug>.mdx` with `libraryTemplateId`, `vertical`, `title`, `summary` (≤ 155 chars) and `published: false`. Items, counts and client wording come from the library at build time; don't copy them in.
4. Write "Why these items": one short paragraph for each commonly confusing item, drawn from the library's `why_we_need_this` and `failure_modes`. Client voice, plain register.
5. Write 3–5 FAQs from those notes. They render on the page and as `FAQPage` JSON-LD.
6. For the suggested cadence, reference the `claims.json` cadence entry and render it with `CadenceTimeline`. Never type a schedule.
7. If the vertical is healthcare, legal or mortgage, leave `reviewedBy` unset and tell Nathan who should review it. Healthcare pages get the HIPAA responsibility line.
8. Let `src/lib/related.ts` pick three related templates, and confirm the matching `/for/` page link.
9. The CTA is "Use this template", pointing to the sign-up URL with `?template=<libraryTemplateId>`.
10. Run `claims-check` and `seo-aeo-preflight`, and fix what they report.
11. Show the page on the local preview. Set `published: true` only when Nathan says so.
