# Highlight

`.rn-mark` puts the `highlight` marker behind a phrase the agent extracted from a client's casual message. It is the brand's one decorative mark, and it always means "the AI read this".

- Only on values the product would actually extract: amounts, dates, yes/no answers, "still the same". Never on headline words for emphasis.
- Keep the client's own spelling and casing in the quoted message; the tidy value appears in `ReplyToData`'s field.
- Animated version (optional): sweep the marker left to right over 300ms, then show the field. End state only under reduced motion.
- Consumer provides: the message text with the extracted spans wrapped.
