// Product facts the mockups depend on. Source: UI Build Spec (sidebar nav after
// Knowledge moved into template detail: "six items now").

export const PRODUCT_NAV = ['Triage board', 'Requests', 'Templates', 'Branding', 'Usage', 'Settings'] as const;
export type ProductNavItem = (typeof PRODUCT_NAV)[number];

export const APP_HOST = 'app.renudge.it';

// The fictional operators used in white-labelled client mockups.
export const OPERATORS = {
  riverside: { name: 'Riverside Mortgages', initials: 'RM', accent: 'teal' },
  altogether: { name: 'Altogether Ventures', initials: 'AV', accent: 'berry' },
} as const;
export type OperatorKey = keyof typeof OPERATORS;
