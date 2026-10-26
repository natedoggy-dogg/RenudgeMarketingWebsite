// Proves each content-schema rule: every case in tests/content-fixtures/
// overlays the valid _base tree, runs `astro sync` against it, and must fail
// with its expected message (or pass, if it expects nothing). Fixtures live
// outside src/, so they never reach production content.
//
// Usage: node scripts/check-content-fixtures.ts [case-name-filter]

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const FIXTURES = 'tests/content-fixtures';
const WORK = '.content-fixtures';
// A fixed "today", so date rules don't drift.
const TODAY = '2026-10-25';
const FIXTURE_IDS = 'fixture-template';

interface Case {
  rule: string;
  expect: string | null;
  warn?: string;
  env?: Record<string, string | null>;
}

// Astro skips re-validating entries whose files haven't changed, so clear its
// store before every run.
const STORE = 'node_modules/.astro/data-store.json';

function sync(env: Record<string, string | undefined>) {
  rmSync(STORE, { force: true });
  const r = spawnSync('npx', ['astro', 'sync'], { env, encoding: 'utf8' });
  return { ok: r.status === 0, out: `${r.stdout}${r.stderr}` };
}

const filter = process.argv[2];
const names = readdirSync(FIXTURES)
  .filter((n) => n !== '_base' && existsSync(`${FIXTURES}/${n}/case.json`))
  .filter((n) => !filter || n.includes(filter))
  .sort();

let failures = 0;
for (const name of names) {
  const c = JSON.parse(readFileSync(`${FIXTURES}/${name}/case.json`, 'utf8')) as Case;
  const root = `${WORK}/${name}`;
  rmSync(root, { recursive: true, force: true });
  mkdirSync(root, { recursive: true });
  cpSync(`${FIXTURES}/_base`, root, { recursive: true });
  cpSync(`${FIXTURES}/${name}`, root, { recursive: true, filter: (src) => !src.endsWith('case.json') });

  const env: Record<string, string | undefined> = {
    ...process.env,
    CONTENT_ROOT: root,
    CONTENT_TODAY: TODAY,
    LIBRARY_FIXTURE_IDS: FIXTURE_IDS,
  };
  delete env.PUBLIC_ENV;
  for (const [k, v] of Object.entries(c.env ?? {})) {
    if (v === null) delete env[k];
    else env[k] = v;
  }

  const { ok, out } = sync(env);
  let problem = '';
  if (c.expect === null) {
    if (!ok) problem = `expected to pass, but failed:\n${out.split('\n').filter((l) => /Error|:/.test(l)).slice(0, 6).join('\n')}`;
    else if (c.warn && !out.includes(c.warn)) problem = `expected the warning "${c.warn}"`;
  } else if (ok) {
    problem = `expected to fail with "${c.expect}", but passed`;
  } else if (!out.includes(c.expect)) {
    problem = `failed, but not with "${c.expect}":\n${out.split('\n').slice(0, 12).join('\n')}`;
  }

  if (problem) failures++;
  console.log(`${problem ? '✗' : '✓'} ${name.padEnd(34)} ${c.rule}`);
  if (problem) console.log(`    ${problem.replace(/\n/g, '\n    ')}`);
}

rmSync(WORK, { recursive: true, force: true });
// Leave the content store as the real content built it.
const restore = { ...process.env };
delete restore.LIBRARY_FIXTURE_IDS;
sync(restore);

console.log(`\n${names.length - failures} of ${names.length} content fixtures behave as expected`);
if (failures) process.exit(1);
