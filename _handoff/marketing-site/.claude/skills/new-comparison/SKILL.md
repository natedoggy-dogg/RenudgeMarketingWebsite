---
name: new-comparison
description: Build a /vs/[x] comparison page. Use when asked to compare renudge.it with an alternative or competitor.
---

# New comparison

1. Read `CLAUDE.md` and the comparison section of the copy draft in `docs/source/`.
2. **Refuse to draft competitor claims without sources.** For a named competitor, Nathan must supply (or approve) dated sources: their pricing page, docs, or a hands-on trial. Record each source as `{ url, checkedAt }`. `/vs/email-and-spreadsheets` needs no external sources.
3. Create `src/content/comparisons/<slug>.mdx` with `competitor`, `lastVerified`, `sources[]` and `whereTheyreStronger`. The schema rejects the page without them.
4. Page shape, in this order:
   1. an honest one-line summary, including who the alternative suits better
   2. `VerifiedNote`
   3. a comparison table on the standard dimensions (chases or just receives; channels; client friction; documents and data; partial submission; reply interpretation; in-channel questions; escalation; audit trail)
   4. where they're stronger (a real concession)
   5. where renudge.it is stronger
   6. who should pick which
   7. `CTABand`
5. Every renudge.it cell in the table must trace to `claims.json`.
6. Tell Nathan the date the page needs re-verifying (90 days on).
7. Run `claims-check` and `seo-aeo-preflight`. Don't create the `/vs` hub until three comparisons are verified.
