# 40KArmy – Mobile UI Specification V2

This document defines the second phase of the mobile interface improvements.

It builds on MOBILE_UI_V1.md and introduces a sticky totals system designed to reduce scrolling friction for mobile users.

The data pipeline and backend architecture must not be modified.


--------------------------------------------------

# Core Behaviour

Mobile users frequently scroll through large unit lists.

To prevent users needing to scroll to the bottom of the page to see army totals, a sticky totals bar is introduced.


--------------------------------------------------

# Sticky Totals Bar

The sticky totals bar appears at the bottom of the screen.

It must only appear when the army contains at least one unit.


Rule:

army_units >= 1 → show sticky totals bar  
army_units = 0 → hide sticky totals bar


--------------------------------------------------

# Sticky Bar Content

The sticky bar displays:

Total points  
Estimated cost


Example:

410 pts • £87.50


--------------------------------------------------

# Sticky Bar Buttons

The bar also contains two buttons:

Summary  
Cost


Example layout:

410 pts • £87.50

[Summary]   [Cost]


--------------------------------------------------

# Expandable Panel

Pressing Summary or Cost expands a panel above the sticky bar.

The panel should animate upward and remain anchored to the bottom of the screen.


--------------------------------------------------

# Summary Panel

Displays the selected units.

Example:

Aggressor Squad x3  
Storm Speeder Hammerstrike x1


--------------------------------------------------

# Cost Panel

Displays the cost breakdown.

Each entry should wrap cleanly to avoid text overflow.

Example:

Aggressor Squad  
Qty:3 • Box:1 • £38

Storm Speeder Hammerstrike  
Qty:1 • Box:1 • £49


--------------------------------------------------

# Layout Rules

The sticky bar must:

• remain visible while scrolling  
• never overlap critical UI elements  
• collapse when no units exist


--------------------------------------------------

# Mobile Performance

The feature must be implemented without adding external libraries.

Use simple client-side state management.

No backend or API modifications are allowed.


--------------------------------------------------

# Architecture Protection

The following areas must not be modified:

data/  
scripts/  
dataset generation  
pricing logic  
API routes


--------------------------------------------------

# Goal

Mobile users must always be able to see their army totals without scrolling to the bottom of the page.

The interface should feel responsive, fast, and comfortable for list building on phones.