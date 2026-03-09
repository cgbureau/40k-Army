# 40KArmy — Project Overview (V1)

## Project

40KArmy is a lightweight web tool that calculates the approximate real-world cost of building a Warhammer 40K army.

Users select a faction, add units to an army list, and the tool estimates:

- Total points
- Number of boxes required
- Estimated total cost

The tool is intentionally simple, fast, and mobile-friendly.

Primary audience:
Warhammer 40K hobbyists planning an army purchase.


---

# Core Features (V1)

• Faction selector  
• Unit search  
• +/- unit quantity controls  
• Target points tracker  
• Army summary  
• Box calculation  
• Estimated army cost  
• Currency selection (GBP / USD / EUR)  
• Shareable army links  
• Export army list  


---

# Architecture

Frontend only application built with:

- Next.js (App Router)
- TypeScript
- Vercel hosting
- Static JSON datasets for factions and units

No authentication, database, or user accounts.


---

# Data Model

Each faction loads units from:


data/factions/{faction}/units.json


Each unit contains:


id
name
points
models_per_box
box_price
prices { GBP, USD, EUR }
is_legends


Army state is stored client-side and serialized into the URL.


Example:


?army=intercessor:2,dreadnought:1



---

# Design Goals

1. Extremely fast load time
2. Mobile-first usability
3. Clear cost visibility
4. Minimal UI complexity
5. Easy dataset maintenance


---

# Launch

Initial launch occurred via Reddit community posts in r/Warhammer40k.

The launch generated:

- Significant traffic
- Early user feedback
- Requests for improved unit data accuracy


---

# Known Limitations

V1 limitations:

• Unit data incomplete for some factions  
• Box calculations may require refinement  
• Prices currently rough estimates for some regions  
• No unit imagery  
• No affiliate monetization yet  


---

# Planned Improvements (V2)

Priority roadmap:

1. Accurate unit datasets for all factions
2. Verified points values
3. Improved box-to-unit mapping
4. Stronger mobile UX
5. Affiliate purchase links
6. Optional desktop unit info panel
7. Additional SEO pages for factions


---

# Monetisation Direction

Primary monetisation strategy:

Affiliate links to hobby retailers.

Examples:

- Element Games
- Wayland Games
- Goblin Gaming
- Amazon
- eBay

Ads are considered a secondary option but not preferred due to UI impact.


---

# Traffic Characteristics (Launch)

Early analytics indicate:

• Majority mobile users  
• Strong US and UK traffic  
• Reddit as primary acquisition channel  


This informs future design priorities (mobile-first).


---

# Security Model

Current system has minimal attack surface.

The application:

- has no user accounts
- stores no personal data
- performs no server-side writes

Security focus is therefore limited to standard hosting protections.


---

# Project Philosophy

The project is designed as a fast, focused utility tool.

Success metrics:

- Ease of use
- Data accuracy
- Community adoption


## Current Priorities

1. Accurate MSRP price data per region
2. Improved kit → box mapping
3. Mobile UI improvements
4. Discount slider
5. Cost-per-point metric