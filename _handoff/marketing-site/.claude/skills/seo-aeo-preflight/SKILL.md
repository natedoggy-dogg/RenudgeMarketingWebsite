---
name: seo-aeo-preflight
description: Run the SEO and AI-search checklist on a page before it ships.
---

# SEO and AEO preflight

Check each item and fix failures before reporting:

1. **Title** ≤ 60 chars and unique. **Description** ≤ 155 chars and unique. Exactly one `h1`, matching the page's job.
2. **Canonical** is `https://www.renudge.it/<path>`, with no trailing slash. **`noindex`** is set only where intended (ABM, staging, drafts).
3. **JSON-LD** is present for the page type (FAQPage for FAQ blocks, HowTo for templates, Offer for pricing, BreadcrumbList for nested pages) and validates. Its text matches the visible copy exactly.
4. The **`.md` twin** renders and reads sensibly on its own. The page is listed in `llms.txt` if it's a key page.
5. **Internal links:** at least two inbound and three related outbound. No broken links (`scripts/check-links.ts`).
6. **Images:** through Astro's image pipeline, sized, with `alt` text describing what they show. Product visuals are HTML components, not screenshots.
7. **Performance:** no island on a page that doesn't need one, and Lighthouse targets met (performance ≥ 95, accessibility 100, SEO 100).
8. **OG image** renders with the right title.
9. The page is in the sitemap if indexable. A redirect exists if it replaced an old URL.
10. **Answer-first:** the opening sentence of the page and of each section states the point plainly, so AI search can quote it.
