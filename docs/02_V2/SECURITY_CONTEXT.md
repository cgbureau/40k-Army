# Warhammer Army Cost Calculator — Security Context

This document provides the context required to perform a **full security sweep** of the application.

It describes the architecture, current attack surface, and how the security principles in the **Security Spine** apply to this project.

---

# Security Goal

The application will be posted publicly to large online communities (e.g. Reddit).
It must therefore be safe against:

• malicious requests
• automated scraping or abuse
• injection attacks
• server crashes
• misconfigured headers

The application should also be **future-safe for scaling**.

---

# Application Architecture

The app is intentionally simple.

Architecture:

Client (browser)
↓
Next.js frontend
↓
Next.js API routes
↓
Static JSON datasets

There is **no database**.

There are **no user accounts**.

There is **no authentication system**.

The server **only reads static files and returns JSON**.

---

# Data Sources

All data lives inside the repository:

```text
/data
  /factions
  /kits
  /kit-mappings
```

These files are **read-only** at runtime.

The server does not write to disk.

Users cannot upload data.

---

# API Surface

Two API endpoints exist.

### GET /api/factions

Returns the list of factions.

Source:

```text
data/factions/{slug}
```

---

### GET /api/factions/[slug]/units

Returns all units for the requested faction.

Example:

```
/api/factions/orks/units
```

The API reads:

```
data/factions/{slug}/units.json
```

---

# Server Behaviour

The server:

• reads JSON files
• parses them
• returns them as JSON responses

There are **no POST endpoints**.

There are **no mutations**.

There is **no user data**.

---

# Current Risk Surface

Primary potential risks:

### 1. Path traversal

A malicious user could attempt:

```
/api/factions/../../etc/passwd
```

The API must validate slugs against the known faction list.

---

### 2. Denial of service (request flooding)

Because the endpoints are public, someone could spam requests.

Protection should include:

• rate limiting
• edge caching

---

### 3. JSON parsing safety

Server must not crash if JSON is malformed.

---

### 4. Input validation

API parameters must be validated.

Example:

```
slug must match known faction slugs
```

---

### 5. XSS (Cross-Site Scripting)

Unit names and faction names originate from internal datasets.

Even though they are internal, they should be treated as **untrusted input** and rendered safely.

React already escapes content by default, but this should be verified.

---

# Security Spine — Relevance to this Project

The full security spine includes many categories.

Some **apply now**, others apply **only if the product grows**.

---

# Core Environment

Production environment
The app will be deployed publicly.

Development environment
Local development via:

```
npm run dev
```

---

# Middleware

Next.js middleware can be used for:

• request validation
• rate limiting
• header enforcement

---

# Data & Permissions

Row Level Security
Not applicable — no database.

SQL database
Not used.

Database warnings
Not applicable.

---

# Secrets & Credentials

The app currently uses **no external APIs**.

However:

• environment variables must never be committed
• future integrations must keep keys server-side

---

# Authentication

There is **no authentication system**.

Future features may include:

• saved army lists
• user accounts

If added later, authentication must include:

• secure session tokens
• server validation
• session expiry

---

# Admin Interfaces

There is **no admin panel**.

If one is added in the future, it must never rely on client-side checks.

---

# Request Handling

Important protections for this project:

### Rate limiting

Prevent abuse of API routes.

### Race conditions

Currently minimal risk because no writes occur.

### Input validation

Validate all request parameters.

---

# Security Headers

The production deployment should include strong headers.

Recommended:

```
Content-Security-Policy
X-Frame-Options
X-Content-Type-Options
Referrer-Policy
Strict-Transport-Security
```

These reduce common attack vectors.

---

# CSP (Content Security Policy)

CSP should restrict script sources to:

```
self
```

No external scripts are required.

---

# CORS

API endpoints should only allow requests from the same origin.

---

# CSRF

CSRF is minimal risk because:

• no POST endpoints
• no authenticated sessions

However headers should still enforce safe defaults.

---

# XSS Protection

All dynamic content must be safely rendered.

React's default escaping should prevent injection.

However:

• avoid dangerouslySetInnerHTML
• never render unsanitised HTML

---

# Webhooks

Not used.

---

# Ingress / Egress

The app should minimise:

• unnecessary endpoints
• unnecessary outbound calls

Currently there are **no outbound network calls**.

---

# Encryption

Encryption in transit:

HTTPS must be enforced.

Encryption at rest:

Handled by hosting provider (Vercel).

---

# Caching

The API responses are ideal for caching.

Recommended:

• edge caching
• immutable JSON responses

---

# Performance Security

Prevent performance-based attacks.

Focus areas:

• avoid excessive memory usage
• avoid loading large datasets unnecessarily

Current dataset size is small (~427 units).

---

# Logging

The app should log:

• server errors
• failed requests

Logs must **not include sensitive data**.

---

# Monitoring

Production should include uptime monitoring.

Recommended:

• UptimeRobot
• Instatus

---

# Security Audit Goal

The upcoming security sweep should verify:

1. API slug validation
2. Safe JSON loading
3. Rate limiting
4. Security headers
5. CSP configuration
6. HTTPS enforcement
7. No XSS risks
8. No exposed environment variables
9. No dependency vulnerabilities

The audit must **not change the application's behaviour**.

Only security improvements should be applied.
