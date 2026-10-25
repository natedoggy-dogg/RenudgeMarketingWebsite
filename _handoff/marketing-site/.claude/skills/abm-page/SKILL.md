---
name: abm-page
description: Build a noindex landing page for one target account, for ads or sales outreach. Use when asked for an ABM, account or prospect-specific page.
---

# ABM page

1. Get from Nathan: the account name, its vertical, the contact's role, the campaign, and an expiry date. Use only public information he provides about the account.
2. Create the page under `src/content/pages/abm/<account-slug>.mdx` with `noindex: true`, `expires`, `campaign` and `vertical`. ABM pages are excluded from the sitemap and `llms.txt`, and get a `noindex` header.
3. Reuse the matching vertical page's structure. Personalise the hero, the template shown (the one closest to their work) and the CTA (a booked walkthrough with a UTM'd link).
4. Don't put the prospect's logo or name in product mockups. Mockups keep the fictional operators.
5. Don't imply a relationship that doesn't exist. No "trusted by", no "your team".
6. Run `claims-check`. After `expires`, the build should drop the page and add a redirect to the vertical page. Confirm that works.
