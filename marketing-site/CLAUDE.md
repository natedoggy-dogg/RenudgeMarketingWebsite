# renudge.it marketing site

The public website for renudge.it: Astro, static output, served by the `renudge-marketing` Cloudflare Worker at `www.renudge.it`. It's built to live in the product monorepo and import product code, but it never touches client data or the product Worker. For now it's in its own repo, laid out to move without code changes: see `MIGRATION.md`.

## Read first

- `design/README.md` (copied from the design system) is the brand book. Its rules on colour, the highlighter, product mockups and voice are binding.
- `design/tokens.json` is the only source of design values. `src/styles/tokens.css` is generated from it (and gitignored), so don't edit it by hand.
- Tailwind utilities come from the tokens only; the default palette is switched off. Colours drop nothing (`bg-paper`, `text-ink-muted`, `bg-product-surface`), spacing, radius and shadow drop their prefix (`p-6`, `rounded-card`, `shadow-frame`), and layout widths keep the full name (`max-w-width-prose`) because Tailwind's own `max-w-prose` is 65ch. Type styles are plain classes named after the token (`display-xl`, `lede`, `eyebrow`). The design system's 720px switch is the `desktop:` / `max-desktop:` breakpoint.
- `docs/source/` holds the copy draft, personas, use cases and product docs.

## Where things live

| Path | What |
| --- | --- |
| `src/content/` | MDX collections (pages, templates, verticals, comparisons, tools, guides, customers) and their Zod schemas in `config.ts` |
| `src/data/` | `pricing.json`, `claims.json`, `integrations.json`, `redirects.json`, `nav.json` |
| `src/components/` | Ported design-system components: `brand/`, `sections/`, `proof/`, `labels/`, `actions/`, plus React `islands/` |
| `src/config/site.ts` | `SITE_NAME`, site and app URLs, `signUpUrl()` |
| `src/layouts/Base.astro` | Head tags, fonts, skip link, nav and footer. JSON-LD goes in its `jsonld` slot. |
| `src/lib/library.ts` | The only way to read the task library (`@library`). Template items, counts and client wording come from here. |
| `src/lib/schema.ts` | JSON-LD builders |
| `scripts/` | `build-tokens`, `check-placeholders`, `check-claims`, `check-links` |
| `.claude/skills/` | Runbooks for every recurring job (below) |

## Rules

- **Never invent facts.** No made-up product mechanics, customers, quotes, logos, metrics, prices or integrations. Unknown means a `[bracketed placeholder]`, listed in your summary. Placeholders fail the production build.
- **Product mechanics go through `claims.json`.** Cadence, retention, channels, send times, link expiry: reference the claim, don't type the number.
- **Client-page mockups are white-labelled.** Use Riverside Mortgages or Altogether Ventures, never renudge.it. Dashboard mockups use the real nav labels and state words.
- **One primary button per view.** `nudge` blue is never a background band. The highlighter only marks extracted values.
- **Name:** `renudge.it` in running copy (constant `SITE_NAME`); the wordmark per the `Wordmark` component.
- **Copy:** plain register, sentence case, verbs on buttons, a reason instead of an adjective, no emoji or exclamation marks. Practitioner and buyer copy stay in separate blocks (`TwoRegister`).
- **Don't modify** the product Worker, `dashboard-app/`, migrations or product CI. Write requests in `docs/engineering-requests.md`.
- **Legal text** lives in the repo's `legal/*.md`, which is the only copy. Render it; don't fork it.

## Skills

| Skill | When |
| --- | --- |
| `new-page` | Any one-off page |
| `new-template-page` | Publish or refresh a `/templates/[slug]` page from the library |
| `new-vertical-page` | A `/for/[vertical]` page |
| `new-comparison` | A `/vs/[x]` page |
| `new-tool` | A free tool under `/tools/` |
| `new-case-study` | A named customer story (needs written permission) |
| `abm-page` | A `noindex` page for one target account |
| `product-visual` | Any product mockup in a section |
| `claims-check` | Before shipping any page, or when asked whether copy is accurate |
| `seo-aeo-preflight` | Before shipping any page |
| `slug-change` | Renaming or moving a URL |
| `ship` | Ready to go to staging and open a PR |

## Commands

Fill these in once Phase 0 is built:

- dev: `npm run dev` (Node 24, see `.nvmrc`)
- build: `npm run build` (type check, then `astro build`)
- tokens: `npm run tokens` (runs automatically before `dev` and `build`)
- tests: `npm test`
- checks:
- preview the Worker locally:
- deploy staging: CI on push to `main`
- deploy production: manual `workflow_dispatch` only
