# Button

Two buttons and a text link: `.rn-btn-primary` (nudge fill), `.rn-btn-secondary` (ink outline) and `.rn-link` (nudge-deep underline).

- One primary per view. The secondary sits to its right. A third action is a `.rn-link`.
- Verb first, sentence case, no arrows on buttons: "Start free", "See how it works", "Book a walkthrough", "Use this template". Links may end in "→".
- 44px tall, `radius-control`, never pills (pills are client-page actions in mockups).
- On the `night` band add `.rn-btn-on-night` to the secondary so it outlines in `on-night`.
- Focus: 2px `focus` outline at 2px offset, already in the class.
- Consumer provides: label and href.
