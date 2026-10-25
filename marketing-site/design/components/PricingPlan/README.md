# PricingPlan

Three plan cards with the recommended one outlined in `nudge` and flagged. Plan name in `display-s`, price in the serif `numeral`, inclusions as hairline-separated rows, one button.

- Only the recommended plan gets the primary button; the others are secondary.
- Prices come from `pricing.json`, never typed into the page. The preview shows placeholders deliberately; the build must fail if any placeholder reaches production.
- Below the plans, the "What counts as an active request" block does more work than the plans themselves. Keep it unambiguous and next to them.
- Consumer provides: plans (name, price, unit, inclusions, CTA label and URL, recommended flag).
