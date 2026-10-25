# renudge.it marketing site — build brief for Claude Code

Build the renudge.it marketing website inside the product monorepo, as `marketing-site/`. Astro, static output, deployed on Cloudflare Workers.

## How to use this brief

Work **one step at a time**. Build the step, show the result, commit, then move on. Don't read ahead and build several steps at once. That's how approximations creep in.

Each step ends with **Done when**. A step isn't finished until every line there is true.

When this brief and the product repo disagree about how the product works, **the repo wins**. Stop and tell Nathan, rather than guessing.

Where this brief and the design system disagree about visuals, **the design system wins**.

## What renudge.it is

renudge.it is an AI agent that chases clients on a firm's behalf. It sends a checklist of documents and questions, then follows up by email, SMS and a mobile portal with chat. It answers clients' questions, turns casual replies into structured values, and hands off to a person only when it should.

- **Launch verticals:** mortgage brokerages and bookkeeping/accounting practices.
- **First market:** USA, `en-US` only.
- **North star:** it saves the time spent chasing clients.

## Inputs in this handoff folder

| Path | What it is | Use it for |
| --- | --- | --- |
| `design-system/README.md` | Brand book: principles, voice, colour, type, layout, product-visual rules | Read before any UI work. It's binding. |
| `design-system/tokens.json` | Every colour (light + dark), type style, spacing, radius, shadow, layout width | The only source of design values. Never hard-code a hex. |
| `design-system/components/*/README.md` + `preview.html` | 19 components: guidelines plus a reference implementation | Port each one to an Astro component. `components/bundle.css` is the reference CSS. Skip `Cover`. |
| `marketing-site/CLAUDE.md` | Standing instructions for the site | Copy into `marketing-site/` in step 0.1 |
| `marketing-site/.claude/skills/*` | 12 runbooks for recurring jobs | Copy into `marketing-site/.claude/skills/` in step 0.9 |
| `docs/source/Website_Content_V1_Draft-_reNudge.it.pdf` | Draft copy for every page | Page copy. See "Copy corrections" before using it. |
| `docs/source/Buyer_Personas_…`, `Use_Cases_…` | Who buys, who does the work | Vertical pages, two-register copy |
| `docs/source/UI_Build_Spec_…`, `UIUX_Reference_Patterns_…` | The product's own screens and copy rules | Product mockups must match these |
| `docs/source/Product_Vision_…`, `Product_Tech_Structure_…` | What the product is and how it's built | Claims, architecture |

The `preview.html` files expect a `tokens.css` that you'll generate in step 0.2. Until then they render unstyled.

## Decisions already made

Don't relitigate these. If one turns out impossible, stop and say why.

1. **Stack:** Astro (current stable major), TypeScript, Tailwind v4, MDX, Zod via Astro content collections. React islands only where a page needs interactivity, using the dashboard's shadcn/Base UI set.
2. **Hosting:** a new, separate Cloudflare Worker called `renudge-marketing`, serving static assets. It never touches client data.
3. **Location:** `marketing-site/` in the product monorepo, beside `dashboard-app/`. It has its own `package.json` and imports product code by path alias.
4. **Domains:** the marketing site takes `www.renudge.it`, which is canonical, and the apex 301s to `www`. The dashboard moves to `app.renudge.it`. Client pages stay on `{workspace}.renudge.it`. The cutover is engineering's job (see "Engineering coordination"). Until then, deploy to staging only.
5. **Legal pages:** privacy, terms and a new cookie policy live on the marketing site at `/privacy`, `/terms` and `/cookies`. They are rendered at build time from `legal/*.md`, which stays the only copy. Add `legal/cookies.md` as a draft for Nathan to complete; don't write legal text yourself beyond a clearly marked skeleton.
6. **Name in copy:** `renudge.it`, lowercase, in running copy. The wordmark is "reNudge it", set in type per the `Wordmark` component. Treat this as provisional; keep the name in one constant so it's a one-line change.
7. **Fonts:** self-host via Fontsource (`@fontsource-variable/newsreader`, `@fontsource/instrument-sans`, `@fontsource/ibm-plex-mono`). No Google Fonts requests, so the cookie policy stays simple.
8. **No localisation layer** at launch. Keep strings out of components where it's cheap, and keep slugs plain.

## Guardrails (always on)

- **Never invent product facts, customers, quotes, logos, metrics or integrations.** If copy needs a fact you can't find in the repo or the source docs, use a bracketed placeholder like `[NN]` and list it in your step summary.
- **Placeholders never reach production.** `[...]`, `$XX`, `NN` and `null` prices fail the production build (step 0.7).
- **Client-page mockups are white-labelled.** They never show renudge.it. Use the fictional operators Riverside Mortgages (`operator-teal`) and Altogether Ventures (`operator-berry`).
- **Dashboard mockups use real nav labels and state words** from the UI Build Spec.
- **Don't modify the product Worker, its routes, migrations or its CI** in this work. Changes it needs go in a written request to engineering (see the last section).
- **Don't add vendors** beyond those named here without asking.

---

## Phase 0 — Foundations

### 0.1 Scaffold the workspace

- Inspect the repo first. Find the package manager from the lockfile, how `dashboard-app/` is set up, and how it imports Worker code (the `@worker` alias). Mirror those conventions.
- Create `marketing-site/` with Astro, the `@astrojs/mdx`, `@astrojs/sitemap` and React integrations, Tailwind v4 via its Vite plugin, and TypeScript strict.
- Set `output: 'static'`, `site: 'https://www.renudge.it'`, `trailingSlash: 'never'`.
- Add path aliases:
  - `@library` → `../packages/library` (entry point found by reading its `package.json`)
  - `@legal` → `../legal`
- Copy from this handoff:
  - `marketing-site/CLAUDE.md` → `marketing-site/CLAUDE.md`
  - the whole `design-system/` folder → `marketing-site/design/`
  - `docs/source/` → `marketing-site/docs/source/`

**Done when:** `npm run dev` (or the repo's equivalent) serves a blank page from `marketing-site/`, the type check passes, and nothing outside `marketing-site/` changed except the root workspace config, if the repo needs one.

### 0.2 Tokens → CSS and Tailwind

- Write `scripts/build-tokens.ts`, run before `dev` and `build`. It generates `src/styles/tokens.css` containing:
  - `:root` with light colour values plus all spacing, radius, layout and shadow tokens as CSS custom properties, using the token names exactly (`--paper`, `--space-6`, `--radius-card`, …)
  - dark colour values under `@media (prefers-color-scheme: dark)` and under `[data-theme="dark"]`
  - colour aliases like `{nudge}` resolved to `var(--nudge)`
  - `--font-display`, `--font-sans`, `--font-mono`, `--font-product` from `type.families`, with the Fontsource family names first
  - a utility class per type style (`.display-xl`, `.lede`, `.eyebrow`, …)
- Map the variables into Tailwind v4's `@theme` so utilities like `bg-paper`, `text-ink-muted` and `rounded-card` work.
- Product tokens (`product-*`, `operator-*`) must have the same value in both themes. Assert this in the script.

**Done when:** changing a value in `tokens.json` and rebuilding changes the site, a grep for `#[0-9a-f]{3,8}` in `src/` finds nothing outside the generated file, and the script fails loudly on a malformed token.

### 0.3 Base layout

- `src/layouts/Base.astro`:
  - `<head>`: title, description, canonical, OG and Twitter tags, `theme-color` for both schemes
  - fonts with `font-display: swap`; preload only the display and sans weights used above the fold
  - skip link
  - `Nav` and footer
  - a slot for JSON-LD
- Footer: wordmark, Product, Templates, Pricing, Security, Privacy, Terms, Cookies, and a "Sign in" link to `https://app.renudge.it`.
- Global focus style: `outline: 2px solid var(--focus); outline-offset: 2px`.

**Done when:** a test page renders with the right fonts, the focus ring is visible on every link, and the layout works from 360px to 1440px with no horizontal scroll.

### 0.4 Component library

Port all 19 design-system components except `Cover` to `src/components/`, grouped as in the design system: `brand/`, `sections/`, `proof/`, `labels/`, `actions/`.

- Props-driven. The props come from each component's README ("Consumer provides").
- Styles via Tailwind utilities on the tokens, or a scoped `<style>` using only `var(--…)`.
- `ProductFrame` and `PhoneFrame` must render light in dark mode (`product-*` tokens only).
- `FAQ` emits `FAQPage` JSON-LD from the same props it renders.
- `ReplyToData` and `MessageThread` take structured data, not HTML strings. Animation is optional; respect `prefers-reduced-motion`.
- Build `src/pages/dev/components.astro`, a kitchen sink showing every component in light and dark. Exclude it from the sitemap and production build.

**Done when:** the kitchen sink matches the design-system previews side by side, and keyboard-only navigation reaches every interactive element.

### 0.5 Content collections and schemas

Define these in `src/content/config.ts`. The rules in the right column are build failures, not warnings, unless marked.

| Collection | Format | Rule the schema enforces |
| --- | --- | --- |
| `pages` | MDX | `title` ≤ 60 chars, `description` ≤ 155 chars, `ogImage` optional |
| `templates` | MDX (enrichment only) | `libraryTemplateId` must exist in `@library`. If `vertical` is `healthcare`, `legal` or `mortgage`, `published: true` requires `reviewedBy`. Items are never stored here. |
| `verticals` | MDX | `launchVertical` boolean; only launch verticals may be linked from the homepage |
| `comparisons` | MDX | `lastVerified` date, `sources[]` (url + checkedAt) with at least one, `whereTheyreStronger` non-empty. Warn past 90 days, fail past 180. |
| `customers` | MDX | `permissionOnFile: true` and a non-empty `whatTookAdjustment`, or `published` must be false |
| `tools` | MDX | `island` component name, `limitsNote` required, no `gated` field allowed |
| `guides` | MDX | `question` required (the question the page answers), `cluster` tag |
| `integrations` | JSON | `status: shipped | building | requested`; only `shipped` renders under "Available now" |
| `pricing` | JSON | Plans, allowances, overage, SMS rates, trial count. `null` is allowed in dev and fails `astro build` when `PUBLIC_ENV=production`. |
| `claims` | JSON | `{ id, claim, source, verifiedAt }`. `source` is a repo path, a library fact id, or a doc name. |
| `redirects` | JSON | `{ from, to, status }`. Compiled to `_redirects` in step 0.8. |

**Done when:** each rule has a fixture that fails the build for the right reason, and the fixtures are excluded from production content.

### 0.6 Library adapter

- Read `packages/library` before writing anything. Learn how templates, task types, client-facing wording, `why_we_need_this`, `failure_modes` and product facts are actually exported. Don't guess the API.
- Write `src/lib/library.ts` with typed helpers: `getTemplates()`, `getTemplate(id)`, `getTemplateItems(id)` (client label, client instruction, kind, data type, required), and `getProductFact(id)`.
- Template pages must take every item, count and client-facing string from here, never from MDX.
- If the library only has operator labels for some tasks, list the gaps in your summary. Don't fill them yourself.

**Done when:** a script prints all library templates with their item counts, and those counts agree with the library's own tests or data.

### 0.7 Guard scripts

Write these in `scripts/` and run them in CI before `astro build`:

- **`check-placeholders.ts`** — fails if `[`-bracket placeholders, `$XX`, `NN` or `null` pricing appear in any page that's part of the production build.
- **`check-claims.ts`** — finds numbers and product mechanics in page content (days, percentages, channel names, retention periods, cadence steps). Each must reference a `claims.json` id via a `<Claim id="…" />` component or frontmatter, or the script reports it. Start with these claims, sourced from the repo:
  - default cadence (`src/chase/`)
  - retention (30 days after completion, 90 days after last activity)
  - channels
  - send time (09:00 client local, weekends skipped)
  - SMS coverage (US)
  - link expiry (14 days)
- **`check-links.ts`** — no broken internal links, and every page has at least two inbound internal links (warning only).
- **Lighthouse CI** on `/`, `/pricing` and one template page: performance ≥ 95, accessibility 100, SEO 100.

**Done when:** each script has a passing and a failing example, and CI runs them.

### 0.8 SEO and AEO plumbing

- `src/lib/schema.ts` builds `Organization`, `SoftwareApplication`, `Offer`, `FAQPage`, `BreadcrumbList` and `HowTo` JSON-LD from page data.
- `@astrojs/sitemap` covers production pages only.
- `src/pages/llms.txt.ts` lists key pages with one-line summaries from frontmatter.
- `src/pages/[...slug].md.ts` gives every content page a `.md` twin generated from the same source.
- `_redirects` and `_headers` are generated into `dist/` from `redirects.json` and a headers config (security headers; `noindex` on staging and ABM pages).
- An OG image endpoint renders title, eyebrow and wordmark with Satori, using the tokens.
- An internal-link scorer (`src/lib/related.ts`) picks three related items by shared tags across templates, verticals, tools and guides.

**Done when:** the test page validates in a JSON-LD validator, `/llms.txt` and `/test.md` render, and a redirect in `redirects.json` works on the local Worker preview.

### 0.9 Skills

- Copy the 12 skills from this handoff into `marketing-site/.claude/skills/`.
- Read each one and adjust paths or commands to match what you built in 0.1–0.8. Keep their steps and checks intact.

**Done when:** `CLAUDE.md` lists each skill with when to use it, and every command a skill references exists.

### 0.10 Deploy and CI

- `marketing-site/wrangler.toml`: Worker `renudge-marketing`, static assets from `dist/`, `not_found_handling = "404-page"`.
- GitHub Actions workflow `marketing.yml`, path-filtered to `marketing-site/**`, `legal/**`, `packages/library/**` and the workflow file itself. Mirror the product's pattern:
  - **push to `main`:** guard scripts → build → deploy to staging (the `workers.dev` URL or `staging-www.renudge.it`, with `noindex` headers)
  - **production:** manual `workflow_dispatch` only, re-running the full suite first
- Don't touch the existing product workflows.

**Done when:** a push that changes only `marketing-site/` deploys staging without triggering product CI, and production can't deploy without a manual run.

---

## Phase 1 — Launch set

Build these pages in order, with the `new-page`, `new-template-page` and `new-vertical-page` skills. Source copy comes from the V1 draft, corrected per the table below.

1. **`/`** — Hero (eyebrow "For mortgage brokers and bookkeepers"), problem section, Steps, `ReplyToData`, `TwoRegister`, a "Built for" section with the two launch verticals plus a link to `/use-cases`, trust block, and CTABand. **No** social-proof section until there is real proof.
2. **`/product`** — eight numbered sections from the draft, each with a proof visual. Section 5 (`ReplyToData`) gets the most visual weight.
3. **`/pricing`** — plans from `pricing.json`, the "What counts as an active request" block, a `CostEstimator` island with three static worked examples underneath, and the billing FAQ. Prices stay `null` until Nathan supplies them; staging shows "[pricing to come]".
4. **`/security`** — skeleton built only from facts in the tech structure doc: encryption, retention schedule, virus scanning, SMS opt-out, audit log. Every claim goes through `claims.json`.
5. **`/privacy`, `/terms`, `/cookies`** — rendered from `legal/*.md` through the `@legal` alias, with an "as of" date taken from git history.
6. **`/templates` and `/templates/[slug]`** — every library template, generated through the adapter, plus MDX enrichment ("why these items", FAQs). Sensitive verticals stay `published: false` until reviewed. Healthcare pages carry the HIPAA responsibility line.
7. **`/for/mortgage-brokers` and `/for/bookkeepers`.**

**Signup links:** every "Start free" goes to `https://app.renudge.it/sign-up`. Template CTAs add `?template=<libraryTemplateId>`. Check the dashboard's actual sign-up route in the repo and use it; if template preload doesn't exist, keep the parameter and note it in your summary.

### Copy corrections (the V1 draft vs the product)

| Draft says | Use instead |
| --- | --- |
| Cadence: email day 1 and 3, SMS day 5, human day 8 | Whatever `src/chase/` ships, via `claims.json` |
| "Intervention Hub", "Triage Queue / Context Thread / Action Sandbox" | "Triage board" with Queue, Context thread, Action sandbox |
| "Correct it once and it learns your answer" / Update Brain | "Save it as an answer and attach it to the template" |
| "Purged on a schedule you control" | The fixed schedule: 30 days after completion, 90 days after last activity |
| Kinde | Don't name a billing provider |
| SMS monthly cap | Leave out unless it exists in the repo |
| 10 starter templates | Whatever the library contains |
| Homepage verticals: accounting, property, insurance, law, HR, healthcare | Mortgage + bookkeeping on the homepage; the rest on `/use-cases` (Phase 2) |

**Phase 1 done when:** every page passes the guard scripts and Lighthouse targets on staging, and Nathan has reviewed each one.

## Phase 2 — Demand

Build these with the `new-comparison`, `new-tool` and `new-page` skills:

- `/vs/email-and-spreadsheets` (linked from the homepage; no `/vs` hub yet)
- `/tools/document-request-email` and `/tools/sms-cost-calculator`
- `/roi`, with the working shown and defaults labelled illustrative
- `/use-cases`
- `/guides/[slug]`
- `/integrations`, with its demand form posting to a Worker route. Ask Nathan where submissions should land before building it.

## Phase 3 — Gated

These are blocked on reality, not effort. Don't build routes for them until Nathan says the gate is met:

- `/customers`
- `/partners`
- further comparisons and the `/vs` hub (needs 3+ verified comparisons)
- ABM pages (`abm-page` skill)

---

## Engineering coordination (write it up; don't do it)

At the end of Phase 0, write `marketing-site/docs/engineering-requests.md` covering:

1. **Move the dashboard** from the apex to `app.renudge.it`. Update `run_worker_first` and the static-asset routing, Clerk allowed origins and redirect URLs, Resend and Twilio links that point at the apex, and any hard-coded URLs in the composer.
2. **Reserve `www`, `app` and `staging-www`** as workspace subdomains so no operator can claim them.
3. **301 from the product Worker:** `/privacy`, `/terms` and the old homepage go to `https://www.renudge.it/...` after cutover.
4. **Apex → `www` redirect and DNS routes** for `renudge-marketing` at cutover.
5. **Optional:** a cookie on `.renudge.it` that the app sets on sign-in, so the marketing nav can show "Go to your dashboard".

Include a cutover checklist and a rollback step.
