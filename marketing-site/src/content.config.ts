// Content collections and the rules their schemas enforce. A rule here is a
// build failure, not a warning, unless it says otherwise.
//
// Astro 7 reads this file from src/content.config.ts (the brief's
// src/content/config.ts is the pre-Astro-5 location and is rejected).
//
// CONTENT_ROOT points the collections at another tree with the same layout
// (content/ and data/). The fixture runner uses it to build each rule's
// failing example from tests/content-fixtures/; production never sets it.

import { existsSync } from 'node:fs';
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { templateIdExists } from './lib/library-ids';

const ROOT = process.env.CONTENT_ROOT ?? 'src';
const CONTENT = `${ROOT}/content`;
const DATA = `${ROOT}/data`;
const isProduction = process.env.PUBLIC_ENV === 'production';
const today = process.env.CONTENT_TODAY ? new Date(process.env.CONTENT_TODAY) : new Date();

const DAY = 24 * 60 * 60 * 1000;
const daysSince = (d: Date) => Math.floor((today.getTime() - d.getTime()) / DAY);

const mdx = (dir: string) => glob({ pattern: '**/*.mdx', base: `${CONTENT}/${dir}` });

// ---------------------------------------------------------------------------
// Shared fields

const title = z.string().min(1).max(60, 'title must be 60 characters or fewer');
const description = z.string().min(1).max(155, 'description must be 155 characters or fewer');
const tags = z.array(z.string().regex(/^[a-z0-9-]+$/, 'tags are lowercase-kebab')).default([]);
const faq = z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) }).strict()).default([]);
const nonEmpty = (what: string) => z.string().trim().min(1, `${what} can't be empty`);

// The verticals the site and the library talk about. Sensitive ones need a
// practitioner's review before a template page can publish.
const VERTICALS = [
  'mortgage',
  'bookkeeping',
  'accounting',
  'property',
  'legal',
  'hr',
  'insurance',
  'healthcare',
  'vendor',
  'general',
] as const;
const SENSITIVE_VERTICALS: readonly string[] = ['healthcare', 'legal', 'mortgage'];

// ---------------------------------------------------------------------------
// MDX collections

const pages = defineCollection({
  loader: mdx('pages'),
  schema: z
    .object({
      title,
      description,
      ogImage: z.string().optional(),
      tags,
    })
    .strict(),
});

const templates = defineCollection({
  loader: mdx('templates'),
  schema: z
    .object({
      // Enrichment only: items, counts and client wording come from @library.
      libraryTemplateId: z.string().min(1),
      title,
      description,
      vertical: z.enum(VERTICALS),
      published: z.boolean().default(false),
      reviewedBy: z
        .object({ name: nonEmpty('reviewedBy.name'), role: nonEmpty('reviewedBy.role'), reviewedAt: z.coerce.date() })
        .strict()
        .optional(),
      faq,
      tags,
      items: z.never({ message: 'template items come from @library, never from MDX' }).optional(),
    })
    .strict()
    .superRefine((t, ctx) => {
      const found = templateIdExists(t.libraryTemplateId);
      if (found !== true)
        ctx.addIssue({ code: 'custom', path: ['libraryTemplateId'], message: found });
      if (t.published && SENSITIVE_VERTICALS.includes(t.vertical) && !t.reviewedBy)
        ctx.addIssue({
          code: 'custom',
          path: ['reviewedBy'],
          message: `${t.vertical} templates need a practitioner review (reviewedBy) before they can be published`,
        });
    }),
});

const verticals = defineCollection({
  loader: mdx('verticals'),
  schema: z
    .object({
      title,
      description,
      vertical: z.enum(VERTICALS),
      launchVertical: z.boolean(),
      // Whether the homepage "Built for" section links here.
      homepage: z.boolean().default(false),
      tags,
    })
    .strict()
    .refine((v) => !v.homepage || v.launchVertical, {
      path: ['homepage'],
      message: 'only launch verticals may be linked from the homepage',
    }),
});

const comparisons = defineCollection({
  loader: mdx('comparisons'),
  schema: z
    .object({
      title,
      description,
      competitor: nonEmpty('competitor'),
      lastVerified: z.coerce.date(),
      sources: z
        .array(z.object({ url: z.url(), checkedAt: z.coerce.date() }).strict())
        .min(1, 'a comparison needs at least one source'),
      whereTheyreStronger: nonEmpty('whereTheyreStronger'),
      faq,
      tags,
    })
    .strict()
    .superRefine((c, ctx) => {
      const age = daysSince(c.lastVerified);
      if (age > 180)
        ctx.addIssue({
          code: 'custom',
          path: ['lastVerified'],
          message: `last verified ${age} days ago; comparisons must be re-verified within 180 days`,
        });
      else if (age > 90)
        console.warn(`[comparisons] ${c.competitor}: last verified ${age} days ago (re-verify before 180)`);
    }),
});

const customers = defineCollection({
  loader: mdx('customers'),
  schema: z
    .object({
      title,
      description,
      customer: nonEmpty('customer'),
      published: z.boolean().default(false),
      permissionOnFile: z.boolean().default(false),
      // The honest part of the story: what they had to change to make it work.
      whatTookAdjustment: z.string().default(''),
      tags,
    })
    .strict()
    .superRefine((c, ctx) => {
      if (!c.published) return;
      if (!c.permissionOnFile)
        ctx.addIssue({
          code: 'custom',
          path: ['permissionOnFile'],
          message: 'a published case study needs written permission on file',
        });
      if (!c.whatTookAdjustment.trim())
        ctx.addIssue({
          code: 'custom',
          path: ['whatTookAdjustment'],
          message: 'a published case study needs whatTookAdjustment',
        });
    }),
});

const tools = defineCollection({
  loader: mdx('tools'),
  schema: z
    .object({
      title,
      description,
      // The React island in src/components/islands/ that runs the tool.
      island: z.string().regex(/^[A-Z][A-Za-z0-9]*$/, 'island is a component name, like CostEstimator'),
      limitsNote: nonEmpty('limitsNote'),
      gated: z.never({ message: 'free tools are never gated; remove gated' }).optional(),
      faq,
      tags,
    })
    .strict()
    .superRefine((t, ctx) => {
      if (!existsSync(`${ROOT}/components/islands/${t.island}.tsx`))
        ctx.addIssue({
          code: 'custom',
          path: ['island'],
          message: `no island at ${ROOT}/components/islands/${t.island}.tsx`,
        });
    }),
});

const guides = defineCollection({
  loader: mdx('guides'),
  schema: z
    .object({
      title,
      description,
      // The question the page answers, in the searcher's words.
      question: nonEmpty('question'),
      cluster: z.string().regex(/^[a-z0-9-]+$/, 'cluster is a lowercase-kebab tag'),
      faq,
      tags,
    })
    .strict(),
});

// ---------------------------------------------------------------------------
// JSON collections

const integrations = defineCollection({
  loader: file(`${DATA}/integrations.json`),
  schema: z
    .object({
      id: z.string().regex(/^[a-z0-9-]+$/, 'id is lowercase-kebab'),
      name: nonEmpty('name'),
      // Only `shipped` renders under "Available now".
      status: z.enum(['shipped', 'building', 'requested']),
      summary: z.string().optional(),
    })
    .strict(),
});

// Prices are null until set. Null is fine in dev and staging (pages show a
// bracketed placeholder) and fails the production build.
const price = z.number().nonnegative().nullable();
const count = z.number().int().nonnegative().nullable();
const nullsIn = (value: unknown, path: string[] = []): string[] => {
  if (value === null) return [path.join('.')];
  if (Array.isArray(value)) return value.flatMap((v, i) => nullsIn(v, [...path, String(i)]));
  if (value && typeof value === 'object')
    return Object.entries(value).flatMap(([k, v]) => nullsIn(v, [...path, k]));
  return [];
};

const pricing = defineCollection({
  loader: file(`${DATA}/pricing.json`, { parser: (text) => [{ id: 'pricing', ...JSON.parse(text) }] }),
  schema: z
    .object({
      id: z.literal('pricing'),
      currency: z.literal('USD'),
      plans: z
        .array(
          z
            .object({
              id: z.string().regex(/^[a-z-]+$/),
              name: nonEmpty('name'),
              monthlyBase: price,
              includedActiveRequests: count,
              overagePerRequest: price,
              teamMembers: z.union([count, z.literal('unlimited')]),
              recommended: z.boolean().default(false),
              cta: z.object({ label: nonEmpty('cta.label'), kind: z.enum(['signup', 'contact']) }).strict(),
            })
            .strict(),
        )
        .min(1),
      sms: z.object({ country: z.literal('US'), perSegment: price }).strict(),
      dedicatedNumberMonthly: price,
      trialActiveRequests: count,
    })
    .strict()
    .superRefine((p, ctx) => {
      if (p.plans.filter((x) => x.recommended).length > 1)
        ctx.addIssue({ code: 'custom', path: ['plans'], message: 'at most one plan is recommended' });
      if (!isProduction) return;
      const { id: _id, ...rest } = p;
      for (const at of nullsIn(rest))
        ctx.addIssue({
          code: 'custom',
          path: at.split('.'),
          message: 'pricing is null; set it before a production build',
        });
    }),
});

const claims = defineCollection({
  loader: file(`${DATA}/claims.json`),
  schema: z
    .object({
      // Referenced from copy as <Claim id="…" />.
      id: z.string().regex(/^[a-z0-9-]+$/, 'id is lowercase-kebab'),
      claim: nonEmpty('claim'),
      // Where the fact comes from: a repo path, a library fact id or a doc.
      source: z
        .string()
        .regex(
          /^(repo:[\w./@-]+(#.+)?|library:[\w.-]+|doc:.+)$/,
          'source is "repo:<path>", "library:<fact id>" or "doc:<document name>"',
        ),
      verifiedAt: z.coerce.date(),
    })
    .strict(),
});

const redirects = defineCollection({
  loader: file(`${DATA}/redirects.json`, {
    parser: (text) => (JSON.parse(text) as { from: string }[]).map((r) => ({ id: r.from, ...r })),
  }),
  schema: z
    .object({
      id: z.string(),
      from: z.string().regex(/^\/[^\s]*$/, 'from is a site path starting with /'),
      to: z.string().regex(/^(\/|https:\/\/)[^\s]*$/, 'to is a site path or an https URL'),
      status: z.union([z.literal(301), z.literal(302), z.literal(307), z.literal(308)]),
    })
    .strict()
    .refine((r) => r.from !== r.to, { message: 'a redirect cannot point at itself' }),
});

export const collections = {
  pages,
  templates,
  verticals,
  comparisons,
  customers,
  tools,
  guides,
  integrations,
  pricing,
  claims,
  redirects,
};
