# 40KArmy — Deployment Guide

## Overview

40KArmy is deployed on **Vercel** using a standard Next.js deployment pipeline.

The application is a **frontend-only Next.js app** that consumes static JSON datasets for factions and units.

Deployment is designed to remain extremely simple.


---

# Tech Stack

Frontend

- Next.js (App Router)
- TypeScript
- React
- Tailwind CSS

Hosting

- Vercel

Analytics

- Vercel Analytics

Version Control

- Git
- GitHub


---

# Repository Structure

Key directories:


/docs
data/
scripts/
warhammer-calculator/


Application root:


warhammer-calculator/


Important files:


app/layout.tsx
app/page.tsx
app/sitemap.ts
app/robots.ts


These control metadata, rendering, and SEO.


---

# Deployment Flow

Deployment occurs automatically via Git.

Process:


Developer commits changes
↓
Push to GitHub
↓
Vercel detects new commit
↓
Vercel builds Next.js app
↓
Deployment goes live


No manual server setup required.


---

# Standard Deploy Commands

Typical workflow:


git add .
git commit -m "update description"
git push


Vercel then automatically builds and deploys.


---

# Build System

Vercel runs:


npm install
npm run build


Which executes the Next.js production build.


---

# Environment Variables

Currently **none required**.

The project uses:

- static datasets
- public APIs only


---

# SEO Infrastructure

The application includes the following SEO components:


app/sitemap.ts
app/robots.ts
metadata in layout.tsx


These provide:

- sitemap generation
- crawl permissions
- search metadata


---

# Domain

Production domain:


https://40karmy.com


The domain is configured within Vercel.


---

# Analytics

Analytics currently use:


@vercel/analytics


This provides lightweight traffic monitoring.


---

# Performance Characteristics

The site is extremely lightweight because:

- no database queries
- static data
- minimal API usage

This results in:

- fast page loads
- strong mobile performance
- minimal infrastructure cost


---

# Deployment Risks

Low risk.

Potential issues:

• incorrect dataset updates  
• breaking UI changes  
• Next.js build errors  


All deployments can be rolled back within Vercel.


---

# Rollback Procedure

If a deployment fails or introduces a bug:

1. Open Vercel dashboard
2. Navigate to deployments
3. Select previous stable deployment
4. Redeploy


---

# Future Deployment Changes

Possible future additions:

• affiliate API integrations  
• price update scripts  
• faction SEO pages  


These will not significantly change deployment structure.