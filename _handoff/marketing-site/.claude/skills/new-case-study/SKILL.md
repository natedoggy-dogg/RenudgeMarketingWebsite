---
name: new-case-study
description: Turn a real customer interview into a /customers/[slug] case study. Use only when a named customer has agreed to be featured.
---

# New case study

1. **Stop unless Nathan confirms written permission** covering the firm's name, logo, people quoted and every figure. Set `permissionOnFile: true` only on his word.
2. Work from interview notes or a transcript Nathan provides. Never write quotes or numbers that aren't in them.
3. Create `src/content/customers/<slug>.mdx` following the 10-part shell:
   1. headline (the outcome in the customer's terms)
   2. at a glance
   3. before
   4. why they looked
   5. what they set up
   6. what changed
   7. what took adjustment (required, real)
   8. practitioner quote
   9. owner quote
   10. CTA
4. The "what changed" number must say where it came from (their tracking, renudge.it usage data, or their estimate).
5. If the interview lacks a section, list the follow-up question instead of filling it.
6. Add the customer to the `/customers` index. The index only goes into the nav when the first study is published.
7. Run `claims-check` and `seo-aeo-preflight`. Leave `published: false` until Nathan and the customer approve the final text.
