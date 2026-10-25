---
name: claims-check
description: Check a page's copy against what the product actually does, before shipping or when asked whether copy is accurate.
---

# Claims check

1. Run `scripts/check-claims.ts` on the page and read its report.
2. Then read the page yourself and list every factual statement about the product: mechanics, numbers, channels, timings, limits, security, integrations, pricing and comparisons.
3. Classify each one:
   - **Backed** — references a `claims.json` id whose `source` still says the same thing. Spot-check the source in the repo; if it changed, update the claim and every page that uses it.
   - **Backable** — true per the repo or `docs/source/`, but not yet in `claims.json`. Add it with a source.
   - **Unbacked** — you can't find it. Rewrite it to something you can back, or replace it with a placeholder, and tell Nathan.
4. Pay particular attention to:
   - cadence days and channels
   - "learns" or "AI handles everything" language (the agent escalates when unsure, and answers are attached per template)
   - retention periods (fixed, not user-controlled)
   - SMS coverage (US only)
   - features that may not exist yet: SMS cap, template preload, integrations, API
5. Report a short table: claim · status · source or fix. The check passes only when nothing is unbacked.
