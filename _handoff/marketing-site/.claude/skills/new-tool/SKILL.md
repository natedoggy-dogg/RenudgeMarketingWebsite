---
name: new-tool
description: Build a free tool page under /tools/ as a React island. Use when asked for a calculator, generator or other free tool.
---

# New tool

1. Read `CLAUDE.md` and the free-tools section of the copy draft.
2. Build the island in `src/components/islands/<Name>.tsx`. The tool must work with no signup, no email gate and no account. Offering to email the result is fine; requiring it isn't.
3. Ship the smallest JS possible: `client:visible`, no heavy dependencies, and a server-rendered fallback that explains the tool if JS fails.
4. Create `src/content/tools/<slug>.mdx` with `island`, a `limitsNote` ("where this stops being enough", honest and leading to the product) and `relatedTemplates[]`.
5. Page shape:
   1. the tool, working immediately
   2. a short explainer of how to use the output
   3. the limits note
   4. a soft CTA
   5. related templates and the matching `/for/` page
6. Any rate or number the tool uses (SMS segment sizes, costs) goes in `claims.json` or `pricing.json` with a source.
7. Run `claims-check` and `seo-aeo-preflight`. Check the island in both themes and at 360px.
