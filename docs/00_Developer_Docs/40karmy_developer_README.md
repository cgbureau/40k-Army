# 40KArmy Developer README

This document explains the project structure for developers working on
40KArmy. The public-facing project summary lives in the root
[`README.md`](../../README.md).

## Project Shape

40KArmy is a Next.js App Router application. The user-facing app is built from
React components in `app/`.

The repository currently has two data areas:

- `data/` is the legacy JSON/CSV data layer still used by parts of the
  application and older scripts.
- `db/` is the future-state data layer. It contains the Prisma-aligned,
  Zod-validated, typed seed datasets that are replacing the legacy data tree.

At a high level:

```text
40karmy/
├── app/
├── data/
├── db/
├── docs/
├── prisma/
├── public/
├── scripts/
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── postcss.config.mjs
```

## `app/`

`app/` contains the Next.js application code.

Important areas:

- `app/(calculator)/page.tsx` is the main calculator experience. It owns the
  selected faction, selected units, quantities, currency, filters, target
  points, discounts, URL serialization, and summary calculations.
- `app/(factions)/` contains SEO-focused faction landing pages such as
  Space Marines, Orks, Necrons, Tyranids, and other supported factions.
- `app/(guides)/` contains guide pages for specific starter army topics.
- `app/api/factions/route.ts` returns the available factions from
  `data/factions`.
- `app/api/factions/[slug]/units/route.ts` returns unit data for one faction.
- `app/layout.tsx` defines global metadata, fonts, analytics, and the root HTML
  shell.
- `app/globals.css` contains global styling.

## `app/components/`

`app/components/` contains shared UI components used by the calculator and page
layout.

Important areas:

- `app/components/calculator/ArmySummary.tsx` renders the selected army
  overview.
- `app/components/calculator/CalculatorControls.tsx` renders search, faction,
  chapter, target-points, discount, and related controls.
- `app/components/calculator/UnitTable.tsx` renders the filtered unit table and
  availability toggles.
- `app/components/calculator/UnitRow.tsx` renders an individual unit row with
  quantity controls and pricing.
- `app/components/layout/SiteHeader.tsx` and
  `app/components/layout/SiteFooter.tsx` render shared page chrome.
- `app/components/ui/BackToTop.tsx` provides the reusable back-to-top control.

## `app/config/`, `app/faction-pages/`, and `app/lib/`

These folders hold application configuration and small helper modules.

- `app/config/factionColors.ts` maps factions to UI accent colors.
- `app/faction-pages/config.ts` defines faction landing page metadata and copy.
- `app/lib/affiliate/amazon.ts` builds Amazon affiliate search links and picks
  the storefront region from the user's browser locale.

## `data/`

`data/` is the legacy app data layer. It is checked into the repository and is
still read directly by parts of the app and API routes, but it is no longer the
target shape for new 40KArmy data work.

Important areas:

- `data/factions/{slug}/units.json` contains faction unit payloads served by the
  API.
- `data/kits/` contains retail kit registries by faction.
- `data/kits/space-marines/` contains Space Marines chapter-specific kit data.
- `data/kit-mappings/` maps unit IDs to one or more retail kits.
- `data/prices/` contains price source CSV files and global tier data.
- `data/army-data-clean.json` and `data/army-data-no-legends.json` are
  aggregate army-data artifacts used by earlier pipeline stages and docs.
- `data/retail-kit-data.json` is a larger retail kit data artifact.

The calculator joins unit data, kit mappings, kit metadata, and prices to
estimate how many boxes a selected army may require and what those boxes cost.

New data modeling work should not add to this tree unless the change is
explicitly part of a legacy-app compatibility bridge.

## `db/`

`db/` is the current canonical seed-data workspace for future database-backed
40KArmy behavior.

Important areas:

- `db/schemas/*.schema.ts` contains Zod runtime schemas in database column
  shape.
- `db/seed_config/types/` derives TypeScript seed types from the Zod schemas.
- `db/seed_config/seed/data/` contains typed seed datasets. Rules datasets are
  increasingly organized by edition and faction, for example
  `units/10e/<faction>.data.ts` and `unit_weapons/10e/<faction>.data.ts`.
- `db/seed_config/seed/collections/` registers datasets into seed collections
  so coverage tests can confirm every dataset is part of the seed graph.
- `db/seed_config/seed/ids/` stores deterministic IDs used by the typed
  datasets.

The database stack is documented in
[`database/database-file-map.md`](database/database-file-map.md). The
model-centered logical data model is documented in
[`database/model-centered-data-model.md`](database/model-centered-data-model.md).

## `prisma/`

`prisma/` contains the database source of truth.

Important areas:

- `prisma/schema.prisma` defines enums, models, relationships, mapped table
  names, and generated Prisma client output.
- `prisma.config.ts` in the repository root configures Prisma CLI behavior.

When schema fields change, keep the Prisma schema, Zod schemas, seed types,
seed data, collection registration, tests, and docs synchronized.

## `docs/`

`docs/` contains planning, pipeline, architecture, and historical reference
material.

Important areas:

- `docs/00_Developer_Docs/` contains current developer-facing orientation docs.
- `docs/00_GW_Source_PDFs/` stores GW source reference material used during data work.
- `docs/01_MVP_Docs/` contains MVP-era pipeline and UI planning notes.
- `docs/02_V2/` contains V2 architecture, deployment, pricing, mobile UI, and
  data pipeline notes.
- `docs/03_V2.3/`, `docs/04_V2.4/`, and `docs/05_V2.5/` contain later
  iteration notes.
- `docs/V3_CompositionNotes.md` contains V3 composition and data-model notes.

The docs tree still mixes current reference material with historical planning
notes. A future cleanup should archive legacy docs into a clearly named
historical area while keeping current developer and database references easy to
find.

## `scripts/`

`scripts/` contains a mix of current importers and legacy data utilities. Treat
the folder as an audit target, not as a clean source of truth.

Current scripts include:

- `scripts/sync-bsdata-*.py` and `scripts/bsdata_expected_counts.py` for
  BSData-backed rules datasets.
- `scripts/sync-kit-content.py` and `scripts/kit_content_importer/**` for
  source-backed kit, kit-unit, kit-model, and kit-price seed data.
- `scripts/generate-dataset-inventory.ts` and
  `scripts/generate-kit-dataset-inventory.ts` for docs inventory reports.

Legacy or transitional scripts include:

- `scripts/OLD/**`.
- Older `validate:*`, `detect:*`, `diagnose:*`, `merge:*`, and price-fetching
  npm scripts that operate on the legacy `data/` tree.
- `scripts/normalize-legacy-kit-data.ts`, which should be treated as a
  one-time migration/audit helper rather than a canonical data source.

The canonical list of npm entry points is in `package.json`.

## `public/`

`public/` contains static assets served by Next.js. This includes the project
favicon and other static image assets referenced by the app.

## Root Configuration Files

Important root files:

- `package.json` defines npm scripts and runtime dependencies.
- `package-lock.json` locks npm dependency versions.
- `next.config.ts` configures Next.js.
- `tsconfig.json` configures TypeScript.
- `eslint.config.mjs` configures ESLint.
- `postcss.config.mjs` configures PostCSS and Tailwind processing.

## Common Development Commands

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Run linting:

```bash
npm run lint
```

Build the production app:

```bash
npm run build
```

## Data Maintenance Commands

See `package.json` for the authoritative script list. Current database-oriented
maintenance tasks include:

```bash
npm run data:sync-kit-content
npm run docs:dataset-inventory
npm run docs:kit-dataset-inventory
npm run db:validate
npx tsc --noEmit
```

BSData rules sync scripts are run directly from the repository root:

```bash
python3 scripts/sync-bsdata-core-datasets.py
python3 scripts/sync-bsdata-rules-faction-units.py
python3 scripts/sync-bsdata-unit-models.py
python3 scripts/sync-bsdata-unit-profiles.py
python3 scripts/sync-bsdata-unit-weapons.py
python3 scripts/sync-bsdata-abilities.py
```

## Editing Guidelines

- Keep root `README.md` focused on what the application does and how to run it.
- Put implementation and repository-structure details in this developer README.
- Prefer `db/seed_config/seed/data/**` for new canonical seed data.
- Avoid adding new legacy JSON/CSV data unless the change is explicitly for
  compatibility with the current app runtime.
- Keep data-shape changes synchronized across `prisma/schema.prisma`,
  `db/schemas/*.schema.ts`, seed types, seed collections, tests, and docs.
- Prefer updating existing database and pipeline docs when changing
  data-generation behavior.
- Run the relevant importer, inventory generator, TypeScript check, and Prisma
  validation after changing typed seed data.
