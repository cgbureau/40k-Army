# 40KArmy – V2 Roadmap

This document defines the next development priorities following the successful MVP launch of **40karmy.com**.

The MVP validated that the concept is useful and interesting to the Warhammer 40K community. The next phase focuses on improving **data accuracy, usability (especially mobile), and monetisation potential**.

---

# Current Status (Post-MVP Launch)

Launch source:
Reddit thread in r/Warhammer40k

Initial results:
- ~1300 visitors within the first launch window
- Strong positive feedback on usefulness and design
- Multiple feature requests
- Several data accuracy issues identified

Key takeaway:
The concept is validated. The next phase must improve **data accuracy and usability** before expanding features.

---

# V2 Development Priorities

## 1. Data Accuracy (Highest Priority)

Trust in the tool depends entirely on accurate data.

Current problems:
- Some units missing across factions
- Incorrect model counts per box
- Incorrect points values
- USD pricing calculated via GBP conversion instead of local MSRP
- Price not updating correctly for multiple units

Required improvements:

### Complete Unit Coverage
All factions must include:
- All currently sold units
- Correct models per box
- Correct points cost
- Correct retail price

### Regional Pricing
Instead of currency conversion, store real prices:


prices: {
GBP
USD
EUR
}


Prices should reflect **local Games Workshop MSRP**.

### Data Pipeline Integrity

Current architecture:


units → kit mapping → kit definitions → faction dataset


Maintain this system and improve validation.

---

# 2. Bundle / Combat Patrol Support

Highly requested feature.

Many armies are purchased through:

- Combat Patrol boxes
- Battleforce boxes
- Army bundles

System design example:


bundle = {
name
price
included_units[]
}


Bundles should:

- contribute units to the army
- calculate savings vs buying kits individually
- optionally suggest optimal bundle combinations

---

# 3. Discount Calculator

Many hobbyists buy from third-party retailers with discounts.

Add a global discount control.

Example options:


Retail Discount

0%
5%
10%
15%
20%


Price calculation:


final_price = rrp * (1 - discount)


This dramatically improves real-world accuracy.

---

# 4. Mobile Optimisation (Critical)

A large percentage of traffic is mobile.

The interface must be redesigned specifically for mobile usage.

Targets:

- faster scrolling
- clearer unit selection
- improved list editing
- sticky totals panel
- simplified UI density

Mobile must become the **primary user experience**.

---

# 5. Affiliate Monetisation

Primary monetisation strategy.

Instead of ads, use affiliate links to hobby retailers.

Potential partners:

- Wayland Games
- Element Games
- Goblin Gaming
- Amazon (optional)

Example UX:


Unit card
↓
Buy this kit
↓
Affiliate retailer link


Goal:

Convert **purchase intent → affiliate revenue**.

---

# 6. Unit Image System

Future enhancement.

Each unit should eventually include a small visual reference.

Possible system:


unit_image: "/images/units/intercessor.png"


Images must be:

- lightweight
- consistent
- optional for mobile performance

---

# 7. Security Review (Future)

Current system is low risk.

Conditions that require a security sweep:

- 10k+ monthly users
- user accounts
- saved army lists
- database storage

Security review will focus on:

- API protection
- rate limiting
- input validation
- caching strategy

---

# 8. SEO Expansion (Later Phase)

Current SEO setup includes:

- metadata
- sitemap
- robots.txt
- Google Search Console verification

Future SEO opportunities:

- faction pages
- unit pages
- pricing guides
- army building guides

This can generate significant organic traffic.

---

# Long-Term Vision

40KArmy can evolve into a full hobby planning tool.

Potential future features:

- saved army lists
- cost comparison across retailers
- army purchase planning
- bundle optimisation
- community army sharing

The goal is to become the **standard tool for planning Warhammer army purchases**.


## Pricing Engine

Goal:
Provide accurate retail cost estimates per region.

Requirements:
• Separate price data from unit data
• Support GBP / USD / EUR / AUD / CAD MSRP
• Correct models-per-box mapping
• Allow discount calculation

Architecture proposal:

units.json
 → kit-mappings.json
 → kits.json
 → prices { GBP, USD, EUR }