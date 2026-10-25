// Shared prop shapes for the design-system components.

export interface Cta {
  label: string;
  href: string;
}

/** Text with the spans the agent extracted marked: ['income is ', { mark: 'about 96k' }, ' before tax']. */
export type MarkedText = (string | { mark: string })[];
