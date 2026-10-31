# CreditFlow AI

A **full-stack, database-driven web application** - a *human-in-the-loop credit risk review
platform* for credit managers. AI generates credit recommendations (risk level, suggested
limit, confidence, reasoning, and source context), but the human reviewer always **accepts,
edits, declines, overrides, escalates, or requests more information**, and every action is
persisted to a database and surfaced in an audit trail.

A public marketing **landing page** with an **interactive lead-capture form** fronts the app;
the review workspace lives under `/app`.

> AI speeds up credit review, but the credit manager remains in control of the final decision.

This is a portfolio demo using **sample data only** - it does not perform real credit
scoring, connect to real ERP systems, or use real customer financial data.

## Stack

**Frontend**
- React 18 + TypeScript
- Vite (dev server / bundler)
- React Router - `/` (landing), `/app`, `/app/applications/:id`, `/app/applications/:id/audit`, `/app/policy-rules`
- Tailwind CSS (calm, enterprise design system), lucide-react icons

**Backend**
- Vercel Serverless Functions (`/api/*.ts`, TypeScript)
- **Neon** serverless Postgres via `@neondatabase/serverless`
- Schema is auto-created and seeded on first request (idempotent)

**API**
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/applications` | List applications (queue) |
| GET | `/api/applications/:id` | Full application bundle (recommendation, signals, sources, audit, matched policies, decision) |
| POST | `/api/applications/:id/decision` | Submit a human decision (updates status, writes audit) |
| GET | `/api/policy-rules` | List credit policy rules |
| POST | `/api/leads` | Capture a demo-request lead |
| GET | `/api/health` | DB connectivity + seed status |

## Getting started

Requires **Node.js 18+** and npm.

```bash
npm install
npm run dev      # frontend dev server (http://localhost:5173)
```

> The serverless API (`/api`) runs on Vercel, not under plain `vite dev`. Locally, the
> landing page works fully; the `/app` screens need the deployed API (or `vercel dev`
> with a `DATABASE_URL`). The simplest way to exercise the full stack is a Vercel
> preview/production deploy.

Scripts:

```bash
npm run build     # type-check (frontend) + production build
npm run lint      # frontend type-check (tsc --noEmit)
npm run lint:api  # API type-check (tsc -p tsconfig.api.json)
npm run preview   # preview the production build
```

## Database

The app expects a Postgres connection string in **`DATABASE_URL`** (also accepts
`POSTGRES_URL`). On Vercel, add **Neon** from the project's **Storage** tab - the connection
string is injected automatically. On first request the API creates its tables and seeds the
five sample customers; no manual migration step is needed.

## Deployment (Vercel)

`vercel.json` rewrites non-API routes to `index.html` (SPA routing) while leaving `/api/*`
to the serverless functions. Vercel auto-detects the Vite build.

- Push to `main` → **production** deploy
- Push any other branch / open a PR → **preview** deploy with its own URL

## Project structure

```
api/                 Serverless functions + shared server code
  _lib/              db (schema + seed), repo (queries, decision engine), seed-data
  applications/      list, [id] bundle, [id]/decision
  policy-rules.ts, leads.ts, health.ts
src/
  components/        UI + domain components (ui/ holds primitives)
  data/              currentUser (the demo reviewer)
  hooks/             useApplicationBundle
  lib/               api client, formatting, label maps + tones, cn()
  pages/             Landing, Queue, Profile, Audit, PolicyRules, NotFound
  store/             AppStore - API-backed application list
  types/             Shared domain model (frontend + API)
```

## Mock customers

Northstar Medical Supplies · Apex Industrial Parts · BlueWave Retail Group ·
Horizon BuildCo · Summit Electronics
