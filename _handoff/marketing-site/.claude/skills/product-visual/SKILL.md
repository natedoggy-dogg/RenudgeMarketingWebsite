---
name: product-visual
description: Build a product mockup for a page section from the proof components (ProductFrame, PhoneFrame, ReplyToData, MessageThread, CadenceTimeline, ChecklistCard). Use whenever a section needs to show the product.
---

# Product visual

1. Name the one thing the visual must prove (for example, "a casual reply becomes two fields"). Crop to that. A whole dashboard at small size proves nothing.
2. Pick the component:
   - operator's view → `ProductFrame`
   - client's view → `PhoneFrame`
   - extraction → `ReplyToData`
   - follow-up over time → `MessageThread`
   - schedule → `CadenceTimeline`
   - checklist contents → `ChecklistCard`
3. **Client surfaces are white-labelled:** Riverside Mortgages (`operator-teal`) or Altogether Ventures (`operator-berry`), with clients on first names only. renudge.it never appears on a client surface.
4. **Dashboard surfaces** use the UI Build Spec's real nav labels, state words ("waiting on you", "paused — in triage", "cadence exhausted") and copy patterns. Check `docs/source/UI Build Spec` for the exact words.
5. **Make it internally consistent:** "3 of 10 done" means ten tasks exist, and timestamps run in order with nudges at 09:00 client time. Nothing reads as an aggregate result.
6. **Keep the system events** ("AI held the reply — no grounded answer, flagged for a person"). They're the persuasive part.
7. Pass data as props, not HTML. Check it in both themes; product frames stay light.
