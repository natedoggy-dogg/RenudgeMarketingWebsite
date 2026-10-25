# Handoff: renudge.it marketing site

Everything a Claude Code session needs to set up and build the marketing site in the product repo.

## What's here

- `BUILD_BRIEF.md` — the build, step by step. Phase 0 sets up the architecture; Phases 1–3 are the pages.
- `marketing-site/CLAUDE.md` — standing instructions for the site.
- `marketing-site/.claude/skills/` — the 12 runbooks.
- `design-system/` — tokens, brand book and component references (a copy of the design system artifact).
- `docs/source/` — the seven project docs.

## How to hand it off

1. Unzip this folder at the root of the product repo as `_handoff/` (add it to `.gitignore`, or delete it after step 0.9).
2. Open Claude Code in the repo and paste:

```text
Read _handoff/README.md and _handoff/BUILD_BRIEF.md in full.
Then do Phase 0, step 0.1 only. Before writing code, tell me what you
found about the repo's package manager, how dashboard-app is set up, and
how packages/library is exported. Stop after 0.1 and show me the result.
```

3. After each step, review it, then say "next step". Don't let it run all of Phase 0 in one go; the brief is written to be worked one step at a time.
4. Phase 0 ends with `marketing-site/docs/engineering-requests.md`. Send that to engineering for the `app.` / `www.` cutover.

## Before Phase 1, you'll need

- Pricing numbers and trial terms (pricing stays as placeholders until then)
- A practitioner reviewer for the mortgage templates
- Whether template preload on sign-up exists or is on the product roadmap
