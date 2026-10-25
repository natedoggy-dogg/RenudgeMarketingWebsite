# Chip

Two label types. `.rn-chip` is a neutral mono tag for channels (Email, SMS, Portal chat) and task kinds (Document, Answer, Signature). `.rn-badge` carries a state in one of four tones.

- Badge words are the product's own state words: "complete", "waiting on you", "stalled", "chasing", "fulfilled", "needs a person". Don't invent marketing states.
- Status tones only appear in proof contexts (mockups, checklists, comparison tables), never to decorate copy.
- Always a word; never a coloured dot alone.
- Consumer provides: the label and, for badges, the tone (`success`, `warning`, `destructive`, `neutral`).
