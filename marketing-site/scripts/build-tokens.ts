// Generates src/styles/tokens.css from design/tokens.json.
//
// tokens.json is the only source of design values. This script validates it,
// then writes CSS custom properties (light on :root, dark under the media query
// and [data-theme="dark"]), one utility class per type style, and the Tailwind
// v4 @theme mapping. Any malformed token stops the build.
//
// Usage: node scripts/build-tokens.ts (runs before `dev` and `build`)

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = `${ROOT}design/tokens.json`;
const OUTPUT = `${ROOT}src/styles/tokens.css`;

// The design system switches type sizes and stacks layouts at this width
// (design/components/bundle.css).
const MOBILE_MAX_WIDTH = '720px';
// The same switch as a Tailwind breakpoint: `desktop:` applies above 720px,
// `max-desktop:` at 720px and below. In rem so it sorts with Tailwind's own.
const DESKTOP_MIN_WIDTH = `${(parseInt(MOBILE_MAX_WIDTH) + 1) / 16}rem`;

// Self-hosted Fontsource families, put first in each stack. Fontsource names
// variable fonts "<Family> Variable".
const FONTSOURCE_FAMILIES: Record<string, string> = {
  display: 'Newsreader Variable',
  sans: 'Instrument Sans',
  mono: 'IBM Plex Mono',
};

// Tokens that sit inside product mockups. The product has no dark mode, so
// these must be identical in both themes.
const FIXED_PREFIXES = ['product-', 'operator-'];

// ---------------------------------------------------------------------------
// Schema

const name = z.string().regex(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/, 'must be kebab-case');
const hex = z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/, 'must be a lowercase #rgb, #rrggbb or #rrggbbaa hex');
const px = z.string().regex(/^-?\d+(\.\d+)?px$/, 'must be a px value');
const em = z.string().regex(/^-?\d+(\.\d+)?em$/, 'must be an em value');
const alias = z.string().regex(/^\{[a-z][a-z0-9-]*\}$/, 'must be an alias like {nudge}');
const themed = <T extends z.ZodType>(v: T) => z.object({ light: v, dark: v }).strict();

const colorToken = z
  .object({ name, value: z.union([alias, themed(hex)]), usage: z.string().min(1) })
  .strict();

const typeStyle = z
  .object({
    name,
    fontSize: px,
    lineHeight: px,
    fontWeight: z.number().int().min(100).max(1000),
    letterSpacing: em.optional(),
    sample: z.string(),
    usage: z.string().min(1),
  })
  .strict();

const sizeToken = z.object({ name, value: px, usage: z.string().min(1) }).strict();
const shadowToken = z.object({ name, value: themed(z.string().min(1)), usage: z.string().min(1) }).strict();

const tokensSchema = z.object({
  name: z.string(),
  version: z.number(),
  color: z.object({
    themes: z.array(z.object({ id: z.enum(['light', 'dark']), name: z.string() })),
    tokens: z.array(colorToken).min(1),
  }),
  type: z.object({
    fonts: z.array(z.unknown()),
    families: z.record(name, z.string().min(1)),
    groups: z.array(z.object({ name: z.string(), family: name, styles: z.array(typeStyle).min(1) })).min(1),
  }),
  spacing: z.object({ tokens: z.array(sizeToken).min(1) }),
  radius: z.object({ tokens: z.array(sizeToken).min(1) }),
  shadow: z.object({ tokens: z.array(shadowToken).min(1) }),
  layout: z.object({ tokens: z.array(sizeToken).min(1) }),
});

export type Tokens = z.infer<typeof tokensSchema>;

export class TokenError extends Error {}

// ---------------------------------------------------------------------------
// Checks the schema can't express

function assertConsistent(t: Tokens): void {
  const errors: string[] = [];

  const all = [
    ...t.color.tokens.map((x) => x.name),
    ...t.spacing.tokens.map((x) => x.name),
    ...t.radius.tokens.map((x) => x.name),
    ...t.shadow.tokens.map((x) => x.name),
    ...t.layout.tokens.map((x) => x.name),
    ...Object.keys(t.type.families).map((f) => `font-${f}`),
  ];
  for (const dup of all.filter((n, i) => all.indexOf(n) !== i)) errors.push(`duplicate token name "${dup}"`);

  const styles = t.type.groups.flatMap((g) => g.styles.map((s) => s.name));
  for (const dup of styles.filter((n, i) => styles.indexOf(n) !== i)) errors.push(`duplicate type style "${dup}"`);

  const colors = new Map(t.color.tokens.map((c) => [c.name, c]));
  for (const c of t.color.tokens) {
    if (typeof c.value === 'string') {
      const target = c.value.slice(1, -1);
      const resolved = colors.get(target);
      if (!resolved) errors.push(`color "${c.name}" aliases unknown token "${target}"`);
      else if (typeof resolved.value === 'string') errors.push(`color "${c.name}" aliases another alias "${target}"`);
    }
    if (FIXED_PREFIXES.some((p) => c.name.startsWith(p))) {
      if (typeof c.value === 'string') errors.push(`product token "${c.name}" must have a fixed value, not an alias`);
      else if (c.value.light !== c.value.dark)
        errors.push(`product token "${c.name}" differs between themes (${c.value.light} vs ${c.value.dark}); the product has no dark mode`);
    }
  }

  for (const g of t.type.groups) {
    if (!(g.family in t.type.families)) errors.push(`type group "${g.name}" uses unknown family "${g.family}"`);
  }
  for (const f of Object.keys(FONTSOURCE_FAMILIES)) {
    if (!(f in t.type.families)) errors.push(`type family "${f}" is missing; it's self-hosted via Fontsource`);
  }

  if (errors.length) throw new TokenError(errors.join('\n'));
}

// Mobile sizes are written in the usage note, e.g. "44px / 48px below 720px
// wide" or "28px / 34px on mobile". A note that mentions mobile but doesn't
// parse is an error, so a size can't silently go missing.
function mobileSize(style: z.infer<typeof typeStyle>): { fontSize: string; lineHeight: string } | null {
  const m = style.usage.match(/(\d+px)\s*\/\s*(\d+px)\s+(?:below 720px wide|on mobile)/);
  if (m) return { fontSize: m[1]!, lineHeight: m[2]! };
  if (/mobile|below \d+px wide/i.test(style.usage))
    throw new TokenError(`type style "${style.name}" mentions a mobile size that can't be read: "${style.usage}"`);
  return null;
}

// ---------------------------------------------------------------------------
// CSS

function familyStack(key: string, stack: string): string {
  const self = FONTSOURCE_FAMILIES[key];
  if (!self) return stack;
  const first = stack.split(',')[0]!.trim().replace(/^"|"$/g, '');
  return first === self ? stack : `"${self}", ${stack}`;
}

export function buildCss(input: unknown): string {
  const parsed = tokensSchema.safeParse(input);
  if (!parsed.success) {
    const lines = parsed.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`);
    throw new TokenError(`design/tokens.json is malformed:\n${lines.join('\n')}`);
  }
  const t = parsed.data;
  assertConsistent(t);

  const colorValue = (c: Tokens['color']['tokens'][number], theme: 'light' | 'dark') =>
    typeof c.value === 'string' ? `var(--${c.value.slice(1, -1)})` : c.value[theme];

  const rootVars = [
    ...t.color.tokens.map((c) => `  --${c.name}: ${colorValue(c, 'light')};`),
    ...t.shadow.tokens.map((s) => `  --${s.name}: ${s.value.light};`),
    ...t.spacing.tokens.map((s) => `  --${s.name}: ${s.value};`),
    ...t.radius.tokens.map((s) => `  --${s.name}: ${s.value};`),
    ...t.layout.tokens.map((s) => `  --${s.name}: ${s.value};`),
    ...Object.entries(t.type.families).map(([k, v]) => `  --font-${k}: ${familyStack(k, v)};`),
  ];

  // Product tokens never change, so only themed values are repeated per theme.
  // Aliases are repeated too: var() resolves where it's declared, so an alias
  // set only on :root would keep its light value inside a [data-theme] subtree.
  const themedColors = t.color.tokens.filter((c) => !FIXED_PREFIXES.some((p) => c.name.startsWith(p)));
  const darkVars = [
    ...themedColors.map((c) => `  --${c.name}: ${colorValue(c, 'dark')};`),
    ...t.shadow.tokens.map((s) => `  --${s.name}: ${s.value.dark};`),
  ];
  const indent = (lines: string[]) => lines.map((l) => `  ${l}`);

  const typeClasses: string[] = [];
  const mobileClasses: string[] = [];
  for (const g of t.type.groups) {
    for (const s of g.styles) {
      const decl = [
        `font-family: var(--font-${g.family});`,
        `font-size: ${s.fontSize};`,
        `line-height: ${s.lineHeight};`,
        `font-weight: ${s.fontWeight};`,
        ...(s.letterSpacing ? [`letter-spacing: ${s.letterSpacing};`] : []),
        ...(s.name === 'eyebrow' || s.name === 'product-label' ? ['text-transform: uppercase;'] : []),
      ];
      typeClasses.push(`.${s.name} { ${decl.join(' ')} }`);
      const m = mobileSize(s);
      if (m) mobileClasses.push(`  .${s.name} { font-size: ${m.fontSize}; line-height: ${m.lineHeight}; }`);
    }
  }

  // Tailwind v4 mapping. `inline` makes utilities read the variables above
  // directly, so they follow the theme; `reference` stops Tailwind emitting
  // its own copies (which would be self-referencing). The default palette,
  // fonts and radii are cleared so only token utilities exist.
  const theme = [
    '  --color-*: initial;',
    '  --font-*: initial;',
    '  --radius-*: initial;',
    '  --shadow-*: initial;',
    '  --container-*: initial;',
    `  --breakpoint-desktop: ${DESKTOP_MIN_WIDTH};`,
    '  --color-white: #fff;',
    '  --color-transparent: transparent;',
    '  --color-current: currentColor;',
    ...t.color.tokens.map((c) => `  --color-${c.name}: var(--${c.name});`),
    ...Object.keys(t.type.families).map((k) => `  --font-${k}: var(--font-${k});`),
    ...t.spacing.tokens.map((s) => `  --spacing-${s.name.replace(/^space-/, '')}: var(--${s.name});`),
    ...t.radius.tokens.map((s) => `  --radius-${s.name.replace(/^radius-/, '')}: var(--${s.name});`),
    ...t.shadow.tokens.map((s) => `  --shadow-${s.name.replace(/^shadow-/, '')}: var(--${s.name});`),
    // Layout keeps the full token name (max-w-width-prose): Tailwind's own
    // max-w-prose is a fixed 65ch that can't be overridden from @theme.
    ...t.layout.tokens.map((s) => `  --container-${s.name}: var(--${s.name});`),
  ];

  return [
    '/* Generated by scripts/build-tokens.ts from design/tokens.json. Do not edit. */',
    '',
    ':root {',
    '  color-scheme: light;',
    ...rootVars,
    '}',
    '',
    '@media (prefers-color-scheme: dark) {',
    '  :root:not([data-theme="light"]) {',
    '    color-scheme: dark;',
    ...indent(darkVars),
    '  }',
    '}',
    '',
    ':root[data-theme="dark"], [data-theme="dark"] {',
    '  color-scheme: dark;',
    ...darkVars,
    '}',
    '',
    '/* Light can also be forced on a subtree, e.g. for side-by-side previews. */',
    '[data-theme="light"] {',
    '  color-scheme: light;',
    ...themedColors.map((c) => `  --${c.name}: ${colorValue(c, 'light')};`),
    ...t.shadow.tokens.map((s) => `  --${s.name}: ${s.value.light};`),
    '}',
    '',
    '/* Type styles */',
    ...typeClasses,
    '',
    `@media (max-width: ${MOBILE_MAX_WIDTH}) {`,
    ...mobileClasses,
    '}',
    '',
    '@theme inline reference {',
    ...theme,
    '}',
    '',

  ].join('\n');
}

// ---------------------------------------------------------------------------
// CLI

function main(): void {
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(SOURCE, 'utf8'));
  } catch (e) {
    throw new TokenError(`Can't read design/tokens.json: ${(e as Error).message}`);
  }
  const css = buildCss(raw);
  // Only write on change, so the dev server doesn't reload for nothing.
  if (existsSync(OUTPUT) && readFileSync(OUTPUT, 'utf8') === css) return;
  writeFileSync(OUTPUT, css);
  console.log('tokens: wrote src/styles/tokens.css');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    main();
  } catch (e) {
    if (e instanceof TokenError) {
      console.error(`\ntokens: FAILED\n${e.message}\n`);
      process.exit(1);
    }
    throw e;
  }
}
