The marketing and brand system for renudge.it's own website. It is a sibling of the product's dashboard tokens, not a copy: it shares the product's ink, blue and radii so a screenshot never looks foreign on the page, then adds a voice of its own (a serif, warm paper, the highlighter) because a website has to persuade, and the dashboard only has to work.

**The idea in one line: correspondence, not software.** The product's promise is that clients get messages they wouldn't guess came from software. The website keeps that promise in how it looks. Pages read like a well-set letter: serif headlines, plain paper, hairline rules, mono timestamps. The product appears inside that letter as proof, framed and real.

## Principles

1. **Show the follow-up, not the form.** Every competitor shows the moment of receiving. Our visuals show what happens in the two weeks after the request goes out: the thread, the nudge, the reply turned into data, the item that reached a person and why.
2. **One accent, one job.** `nudge` blue marks the single thing a view wants you to do. It is never a background band, never decoration, never two primary buttons side by side.
3. **The highlighter is the agent.** `highlight` appears only where the agent read something: the value pulled out of "rev was 145k", the date in "can I send it friday". If it's highlighted, the AI found it. Nothing else gets highlighted.
4. **Proof over claims.** A real screen beats a sentence about it. No invented customers, quotes, logos or metrics, no placeholder figures shipped as real. Where we don't have the number yet, the section isn't on the page.
5. **Flat isn't structureless.** Hairlines and whitespace do the work cards do elsewhere, but every thread keeps its sender labels and every drop zone keeps its edge (the product's own rule for client pages).

## Content fundamentals

Write like the agent writes to clients: plain register, a reason instead of an adjective.

- **Say the consequence, not the feature.** "Most requests complete on their own" beats "AI-powered automation". "Your rate lock expires Friday" is the model sentence: a fact someone can act on.
- **Two registers, never blended in one block.** Practitioner copy is relief from drudgery ("Your morning starts with a short list of things that actually need a human"). Buyer copy is revenue and risk ("Every open request has a clock on it, and you can see exactly where it's stuck"). Use `TwoRegister` when a section has to speak to both.
- **Don't overclaim autonomy.** The agent escalates when it isn't sure. Say so. "It tells you rather than going quiet" is a selling point, not a caveat.
- **Size things.** "Four documents, five short questions and one signature, about 20 minutes." Numbers that are true and specific, never "dozens" or "hundreds".
- **Name the product `renudge.it` in running copy**, lowercase, with the dot. The wordmark is set separately (see `Wordmark`).
- **Sentence case everywhere**: headlines, buttons, nav. Buttons start with a verb: "Start free", "See how it works", "Book a walkthrough".
- **You and your.** Address the operator directly. "We" is renudge.it the company; never write "we" as if renudge.it were the client's firm.
- **No emoji**, no exclamation marks, no "supercharge", "seamless", "effortless", "leverage" or "revolutionise".
- **Placeholder copy lives in brackets** (`[Quote: practitioner]`) and never ships. A build check should fail on `[` placeholders and `$XX` figures.

Real lines to model on, from the V1 copy draft: "Stop chasing clients for paperwork." · "It's not that clients don't want to help — they get busy, they get confused, they forget." · "'Rev was 145k' is an answer. We'll treat it like one." · "Most tools stop at the request. renudge.it keeps working."

## Color

- Pages sit on `paper`. Alternate bands use `paper-sunken`. Cards and plans use `paper-raised`. Text is `ink`, supporting copy `ink-muted`, mono meta `ink-subtle`.
- `nudge` is for the primary button, the focus ring (`focus`), progress fills and the wordmark square. Links are `nudge-deep`. A recommended plan or selected state sits on `nudge-wash` with `nudge-deep` text.
- `highlight` marks extracted values only (principle 3), with `ink` text on it.
- `night` is the one dark band per page, almost always the closing CTA. Text on it is `on-night` and `on-night-muted`; the primary button keeps its `nudge` fill.
- `success`, `warning`, `destructive` and their washes are for proof visuals (status badges inside mockups, upload errors). They never colour marketing copy and always sit beside a word.
- `product-*` tokens are fixed in both themes because the product has no dark mode. Use them only inside `ProductFrame` and `PhoneFrame`.
- `operator-teal` and `operator-berry` are the accents of two fictional operators (below). They appear only on white-labelled client mockups.

## Type

Three families, each with one job.

- **`display`, Newsreader** (Google Fonts, optical sizes 6–72, weights 400 and 500). Headlines only: `display-xl` for the hero, `display-l` for page titles and the closing CTA, `display-m` for section heads, `display-s` for step and card titles, `numeral` for step numbers and prices. The serif is the "reads as human" signal; never set body copy in it.
- **`sans`, Instrument Sans** (Google Fonts, 400/500/600). Everything you read in sentences: `lede`, `body`, `body-s`, `label`, `small`.
- **`mono`, IBM Plex Mono** (Google Fonts, 400/500). The message-header layer: `eyebrow` (uppercase) for section eyebrows and sender labels, `meta` for timestamps, channels, file types and URLs. Never for sentences.
- **`product`** is the system stack the dashboard uses. Set text inside `ProductFrame` and `PhoneFrame` in `product-*` and `client-h1` styles so mockups match the shipped UI.

Load the faces from Google Fonts with `display=swap`; the stacks fall back to Georgia, the system sans and Menlo. Measures: `lede` ≤ 60ch, `body` ≤ 68ch (`width-prose`).

## Layout and rhythm

- Content max `width-page` (1180px), running copy max `width-prose` (680px). Gutters `space-6` desktop, `space-4` mobile.
- Sections are `space-24` top and bottom on desktop, `space-16` on mobile, separated by a `rule` hairline or a change of band, never both.
- A section is a text block (eyebrow, `display-m`, `lede`) then its visual, `space-12` apart. On desktop the visual can sit beside the text at 5/7; on mobile it always follows.
- Radii come from the product: `radius-control` for buttons and inputs, `radius-card` for cards and frames, `radius-sheet` for client cards and phone screens, `radius-pill` for chips. Buttons are never pills.
- Shadows: `shadow-raise` on plans and client task cards, `shadow-frame` on product frames only. Everything else is flat with hairlines.

## Product visuals

The product page copy says it plainly: without real product images, the site reads as claims. These rules keep the visuals honest.

- **Build mockups from the product's own tokens and copy**, not screenshots of a staging database. The `product-*` tokens and type styles mirror the dashboard spec, so an HTML mockup matches the shipped UI and stays sharp at every width.
- **Client pages are white-labelled, so client mockups never say renudge.it.** They show a fictional operator's name, initials square and accent. Use the two house operators: **Riverside Mortgages** (`operator-teal`, mortgage) and **Altogether Ventures** (`operator-berry`, accountancy). Clients are first-name only ("Alan", "Priya").
- **Dashboard mockups do show renudge.it**, because that's our product surface. Use the real nav labels (Triage board, Requests, Templates, Branding, Usage, Settings) and real state wording ("waiting on you", "paused — in triage", "cadence exhausted").
- **System events carry the story.** "AI held the reply — no grounded answer, flagged for a human" is the most persuasive sentence on the site. Keep these in thread mockups.
- **No fake numbers in UI.** Counts inside mockups must be internally consistent ("3 of 10 done" with ten tasks drawn) and obviously illustrative, never presented as aggregate results.
- **Frame, don't tilt.** Product sits square in `ProductFrame` or `PhoneFrame`. No 3D perspective, floating fragments or blurred background UI.

## Imagery and iconography

- No stock photography and no illustrations of people. The imagery is the product, the thread and typography.
- Icons are lucide (the product's set) at 1.5px stroke, `ink` or `ink-muted`, 20px in copy and 16px in UI. Use them sparingly, as labels next to words, never as a grid of feature icons.
- The highlighter is the brand's only decorative mark. Even there, it sits on a real value.

## Motion

Motion explains a mechanism or it doesn't happen. Allowed: the highlighter sweeping across an extracted value then the value appearing in its field (`ReplyToData`), a thread revealing turn by turn, progress bar width. Durations 200–400ms, ease-out. Under `prefers-reduced-motion`, show the end state.

## Accessibility

- Every text pair in this system meets 4.5:1 in both themes (3:1 for 24px+ headlines and for `rule-strong` edges). `ink-subtle` is the floor for meta text; don't go lighter.
- Focus: `outline: 2px solid var(--focus); outline-offset: 2px` on every interactive element.
- Status in mockups always carries a word, never colour alone.
- Hit targets are at least 44px tall (buttons are 44px).

## Don'ts

- Don't use `nudge` as a section background, a gradient, or on more than one button in a view.
- Don't highlight words in headlines for emphasis. The highlighter means "extracted".
- Don't put renudge.it branding inside a client-page mockup.
- Don't ship a logo strip, testimonial, case study or metrics bar until it's real and approved.
- Don't use left-border accent cards, icon grids, purple-blue gradients or floating 3D screenshots.
