// The only way pages should query collections whose rules apply at render
// time rather than in the schema.

import { getCollection } from 'astro:content';

/** Integrations listed under "Available now": shipped only. */
export const availableNow = () => getCollection('integrations', (i) => i.data.status === 'shipped');

/** Verticals the homepage "Built for" section links to. The schema already
 *  guarantees they're launch verticals. */
export const homepageVerticals = () => getCollection('verticals', (v) => v.data.homepage);

/** Published template enrichments and case studies. Drafts never render. */
export const publishedTemplates = () => getCollection('templates', (t) => t.data.published);
export const publishedCustomers = () => getCollection('customers', (c) => c.data.published);

/** The single pricing entry. */
export async function getPricing() {
  const [pricing] = await getCollection('pricing');
  if (!pricing) throw new Error('src/data/pricing.json is missing');
  return pricing.data;
}
