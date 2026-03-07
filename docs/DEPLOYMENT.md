# Warhammer Army Cost Calculator — Deployment Guide

This document explains how the application is deployed and the security expectations for production.

The project is designed to be deployed as a **static Next.js application with lightweight API routes**.

---

# Hosting Platform

Recommended hosting:

**Vercel**

Reasons:

• Native Next.js support
• Automatic HTTPS
• Edge caching
• Simple CI/CD via GitHub
• Built-in security protections

---

# Repository

The application is deployed directly from the Git repository.

Typical workflow:

```text
Local development
↓
Commit to Git
↓
Push to GitHub
↓
Vercel auto-deploys
```

---

# Build Command

Vercel automatically detects the Next.js project.

Build command:

```bash
npm run build
```

---

# Output

Next.js produces a production build that includes:

• static frontend assets
• API routes
• optimised JavaScript bundles

---

# Environment Variables

The project currently requires **no environment variables**.

However future features may introduce:

• API keys
• analytics keys
• external services

Rules:

• store in Vercel environment settings
• never commit `.env` files
• never expose server secrets to the browser

---

# HTTPS

Production must enforce HTTPS.

Vercel provides:

• automatic TLS certificates
• HTTP → HTTPS redirects

---

# Security Headers

Security headers should be configured in `next.config.js`.

Recommended headers:

```javascript
{
  key: "X-Frame-Options",
  value: "DENY"
},
{
  key: "X-Content-Type-Options",
  value: "nosniff"
},
{
  key: "Referrer-Policy",
  value: "strict-origin-when-cross-origin"
},
{
  key: "Strict-Transport-Security",
  value: "max-age=63072000; includeSubDomains; preload"
}
```

A **Content Security Policy (CSP)** should also be defined.

Example:

```text
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
```

---

# CORS

The API should only allow requests from the same origin.

This prevents other websites from abusing the endpoints.

---

# Rate Limiting

Because the API routes are public, rate limiting should be added.

Possible approaches:

• Vercel Edge Middleware
• Vercel rate limiting libraries
• edge caching of API responses

---

# Caching

The API responses are ideal candidates for caching.

Recommended strategy:

```text
Cache-Control: public, max-age=3600, immutable
```

Because the dataset rarely changes.

---

# Monitoring

Production monitoring should include:

### Uptime monitoring

Recommended tools:

• UptimeRobot
• Instatus

These services check the site regularly and notify if downtime occurs.

---

# Dependency Security

Before deployment, run:

```bash
npm audit
```

Resolve any high-severity vulnerabilities.

---

# Performance Audit

Run Lighthouse or PageSpeed Insights.

Check:

• bundle size
• caching
• load speed

The app should load extremely fast due to static data.

---

# Deployment Checklist

Before going live:

• run `npm run build` successfully
• verify API routes respond correctly
• verify faction dropdown loads all factions
• verify cost calculations work
• confirm HTTPS enabled
• confirm security headers present
• confirm CSP working
• confirm no console errors

---

# First Public Release

Initial release plan:

1. Deploy to Vercel
2. Verify production build
3. Test on mobile + desktop
4. Share link publicly

The application is expected to handle **large traffic spikes** because it serves mostly static content.

---

# Post-Launch

After launch the next priorities are:

• image pipeline for unit artwork
• SEO improvements
• optional army sharing links
• performance monitoring
