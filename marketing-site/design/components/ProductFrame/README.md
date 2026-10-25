# ProductFrame

A window for dashboard mockups: a slim bar with the app URL in mono, the product sidebar, and a main area. It renders light in both themes, because the product has no dark mode.

- Build contents from `product-*` tokens and the `product-*` type styles; they mirror the dashboard spec. Don't screenshot staging.
- Use real nav labels in order: Triage board, Requests, Templates, Branding, Usage, Settings. Highlight the one the section is about.
- Use real state words and real copy patterns ("paused — in triage", "tomorrow 09:00 · SMS"). Counts must agree with what's drawn.
- No traffic-light dots, no tilt, no floating fragments. One `shadow-frame`.
- Crop to the part that proves the point; a full dashboard at 400px wide proves nothing.
- Consumer provides: URL path, active nav item, and the main-area content.
