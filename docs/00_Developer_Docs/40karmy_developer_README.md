# 40KArmy Developer README

This document explains the project structure for developers working on
40KArmy. The public-facing project summary lives in the root
[`README.md`](../../README.md).

## Project Shape

40KArmy is a Next.js App Router application. The user-facing app is built from
React components in `app/`, while the army, unit, kit, mapping, and price data
is stored as JSON and CSV files in `data/`.

At a high level:

```text
40karmy/
├── app/
├── data/
├── docs/
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

`data/` is the project data layer. It is checked into the repository and read
directly by the app and API routes.

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

## `docs/`

`docs/` contains planning, pipeline, architecture, and historical reference
material.

Important areas:

- `docs/00_Developer_Docs/` contains current developer-facing orientation docs.
- `docs/00_Wahapedia/` stores source reference material used during data work.
- `docs/01_MVP_Docs/` contains MVP-era pipeline and UI planning notes.
- `docs/02_V2/` contains V2 architecture, deployment, pricing, mobile UI, and
  data pipeline notes.
- `docs/03_V2.3/`, `docs/04_V2.4/`, and `docs/05_V2.5/` contain later
  iteration notes.
- `docs/V3_CompositionNotes.md` contains V3 composition and data-model notes.

## `scripts/`

`scripts/` contains data maintenance utilities. Many current scripts are
organized under `scripts/OLD/`, which reflects the project's historical data
pipeline rather than active application runtime code.

Script responsibilities include:

- fetching or transforming Wahapedia-derived unit data;
- validating kit registries and kit mappings;
- detecting missing or unmapped kits;
- merging duplicate mappings;
- extracting or updating regional price data;
- producing project and data coverage reports.

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

See `package.json` for the authoritative script list. Common maintenance tasks
include:

```bash
npm run validate:kits
npm run validate:mappings
npm run detect:kits
npm run diagnose:unmapped
npm run diagnose:faction
npm run merge:mappings
```

## Editing Guidelines

- Keep root `README.md` focused on what the application does and how to run it.
- Put implementation and repository-structure details in this developer README.
- Keep data-shape changes synchronized across `data/factions`, `data/kits`, and
  `data/kit-mappings`.
- Prefer updating existing pipeline docs when changing data-generation behavior.
- Run the relevant validation script after changing kit or mapping data.
