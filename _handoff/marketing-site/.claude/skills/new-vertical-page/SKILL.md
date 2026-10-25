---
name: new-vertical-page
description: Build a /for/[vertical] landing page for one industry. Use when asked for an industry, persona or vertical page.
---

# New vertical page

1. Read `CLAUDE.md`, `design/README.md`, and the Buyer Personas and Use Cases docs in `docs/source/`.
2. Name the task-doer and the buyer for this vertical from the personas doc. If they're the same person (Tier 1), say so; the copy is simpler.
3. Create `src/content/verticals/<slug>.mdx` with `persona`, `launchVertical` (true only for mortgage and bookkeeping), `painPoints[]` (in their words) and `templates[]` (library ids).
4. Page shape:
   - `Hero` whose eyebrow names the audience
   - the problem in their terms
   - a `ReplyToData` or `MessageThread` using a realistic exchange from their work
   - `TwoRegister`: task-doer relief on the left, buyer outcome on the right
   - their templates as a short list linking to template pages
   - `FAQ`
   - `CTABand`
5. The operator in any client mockup is the fictional one that fits: Riverside Mortgages for mortgage, Altogether Ventures for accounting. For other verticals, ask before inventing a third.
6. Don't claim the library covers a vertical it doesn't. Check the library for the vertical's templates; if they're missing, the page links to `/use-cases`, not to templates.
7. Run `claims-check` and `seo-aeo-preflight`, then show it.
