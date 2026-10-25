# Moving into the product monorepo

The site is built in its own repo for now, but it's laid out to move into the
product monorepo as `marketing-site/`, beside `dashboard-app/`, with no code
changes.

## How it's kept portable

- Everything lives under `marketing-site/`. The repo root holds nothing the
  site needs except the stand-in folders below.
- `@library` and `@legal` resolve to `../packages/library` and `../legal`, the
  paths they have in the monorepo. Until the move, snapshots of those folders
  sit at the same paths in this repo's root.
- `marketing-site/` has its own `package.json` and lockfile (npm), and doesn't
  rely on a root workspace.
- CI path filters are written for the monorepo layout (`marketing-site/**`,
  `legal/**`, `packages/library/**`).

## Stand-ins in this repo

| Path | Monorepo source | Status |
| --- | --- | --- |
| `../packages/library` | `packages/library` | Not yet supplied |
| `../legal` | `legal/*.md` | Not yet supplied |
| `docs/source/` | Handoff docs | Kept local, not committed (this repo is public) |

Snapshots are copies, so they go stale. Note the monorepo commit each one was
taken from when it's added.

## Move checklist

1. Copy `marketing-site/` into the monorepo root. Don't copy the stand-ins.
2. Check that the monorepo's package manager matches. If it isn't npm,
   regenerate the lockfile with its tool and update the scripts and CI.
3. Run the type check and build from the monorepo, so `@library` and `@legal`
   resolve against the real folders.
4. Move the CI workflow to the monorepo's `.github/workflows/marketing.yml`.
5. Remove the `docs/source/` line from `.gitignore` if the monorepo is private.
6. Archive this repo.
