# 40KArmy

40KArmy is a Warhammer 40,000 army cost calculator. It helps players estimate
the real-world cost of collecting an army before buying miniatures.

The app combines faction unit data, points values, model counts, kit mappings,
and regional pricing data so users can build a draft army list and see both the
points total and estimated box cost.

## What It Does

- Lets users choose a Warhammer 40K faction and browse available units.
- Tracks selected units, quantities, total points, and estimated purchase cost.
- Supports common collection-planning filters such as Legends, Forge World,
  allied, and unavailable units.
- Supports multiple currencies with GBP fallback pricing.
- Provides faction-specific landing pages and starter guide pages.
- Builds Amazon search links for faction-related kits by user region.

## Why It Exists

Warhammer 40K army planning usually answers two different questions:

1. How many points is this list?
2. How much will it cost to actually collect?

Most list-building tools focus on the first question. 40KArmy focuses on the
second by making box counts, kit availability, and real retail prices visible
while a player experiments with a list.

## Tech Stack

- [Next.js](https://nextjs.org/) App Router
- React
- TypeScript
- Tailwind CSS
- JSON-backed faction, kit, and pricing data
- Vercel Analytics

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Data maintenance scripts are also available for kit validation, mapping
validation, price updates, and unmapped-unit diagnostics. See
[`package.json`](package.json) for the current script list.

## Project Documentation

Developer-facing setup and architecture notes live in
[`docs/00_Developer_Docs/40karmy_developer_README.md`](docs/00_Developer_Docs/40karmy_developer_README.md).

The rest of `docs/` contains historical MVP, V2, data pipeline, cleanup, and
pricing notes that describe how the project data model evolved.
