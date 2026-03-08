# Warhammer Army Cost Calculator — Project Overview

## Project

A web application that helps Warhammer 40k players estimate the real-world cost of building an army.

The tool allows users to:

* Select a faction
* Add units to an army list
* See total points
* See estimated real-world cost
* Calculate cost efficiency (£ / 1000pts)

The application is **read-only** and uses static data.
There are **no user accounts**, **no authentication**, and **no database**.

The app is a **fan-made tool** and not affiliated with Games Workshop.

---

# Core Features

• Select faction from all 18 Warhammer 40k factions
• View full unit list for that faction
• Add/remove units to an army list
• Track total points
• Calculate number of boxes required
• Calculate estimated total cost (£)
• Calculate cost per 1000 points
• Search units by name

Army composition is limited to **one faction at a time**.

---

# Dataset

The application contains:

• 18 factions
• 427 total units

Each unit includes:

```
id
name
points
models_per_box
box_price
```

Example:

```
{
  "id": "intercessor_squad",
  "name": "Intercessors",
  "points": 95,
  "models_per_box": 10,
  "box_price": 40
}
```

Cost calculations use:

```
boxes_required = ceil(quantity / models_per_box)
total_cost = boxes_required * box_price
```

---

# Tech Stack

Framework:
• Next.js (App Router)

Language:
• TypeScript / JavaScript

Data:
• Static JSON files stored in the repository

No external database is used.

---

# API

The application exposes two API routes:

### GET `/api/factions`

Returns a list of factions based on the folder structure:

```
data/factions/{slug}
```

Example response:

```
[
  { "slug": "space-marines", "name": "Space Marines" },
  { "slug": "orks", "name": "Orks" }
]
```

---

### GET `/api/factions/[slug]/units`

Returns all units for the given faction.

Example:

```
/api/factions/orks/units
```

Returns:

```
{
  faction: "Orks",
  units: [...]
}
```

---

# Application Behaviour

When the page loads:

1. Factions are fetched from `/api/factions`
2. Default faction loads
3. Units load from `/api/factions/[slug]/units`
4. User builds army client-side

All calculations happen **in the browser**.

The server is only used to **serve static data**.

---

# User Interface

Main UI components:

Left panel
• Search
• Target points
• Unit list

Right panel
• Army summary
• Cost breakdown
• Totals

Faction colours are used as **subtle UI accents only**.

---

# Deployment Target

The application is intended to be deployed as a **static web application**.

Expected hosting:

• Vercel

The application has **no backend services** or database.

---

# Project Goal

Provide a simple tool for players to understand:

**"How much will this army cost to build?"**

The tool prioritises:

• simplicity
• speed
• accurate kit pricing


## V1 Launch Status

Version 1 includes:

• all factions supported
• verified kit mappings
• multi-currency pricing (GBP / USD / EUR)
• army cost calculation
• shareable army links

Deployment: Vercel
