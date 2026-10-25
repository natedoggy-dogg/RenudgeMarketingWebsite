---
name: ship
description: Take finished page work to staging and open a pull request. Use when Nathan says a page or change is ready.
---

# Ship

1. Run the full check suite: `check-placeholders`, `check-claims`, `check-links`, the type check, the build, and Lighthouse CI on the changed pages. Stop on any failure and fix it, or report it.
2. Run `claims-check` and `seo-aeo-preflight` on each changed page if they weren't run this session.
3. Take screenshots of each changed page at 360px and 1280px, light theme, plus dark for any page with new components.
4. Commit with a message that says what changed and why. Push a branch and open a PR. The description should have:
   - pages changed
   - claims added or changed
   - remaining placeholders
   - screenshots
5. After merge, the push to `main` deploys staging. Give Nathan the staging URL.
6. Never trigger the production workflow yourself. Production is a manual run by Nathan.
