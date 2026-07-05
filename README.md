# CreditFlow AI

A premium **B2B fintech SaaS prototype** — a *human-in-the-loop credit risk review platform*
for credit managers. AI generates credit recommendations (risk level, suggested limit,
confidence, reasoning, and source context), but the human reviewer always **accepts, edits,
declines, overrides, escalates, or requests more information**, and every action is recorded
to an audit trail.

> AI speeds up credit review, but the credit manager remains in control of the final decision.

This is a **frontend prototype** built with mock data and local state. It does **not** perform
real credit scoring, connect to real ERP systems, or use real customer financial data.

## Stack

- **React 18** + **TypeScript**
- **Vite** (dev server / bundler)
- **React Router** (`/`, `/applications/:id`, `/applications/:id/audit`, `/policy-rules`)
- **Tailwind CSS** (calm, enterprise design system)
- **lucide-react** icons
- Mock JSON-style fixtures + a React context store with `localStorage` persistence

## Getting started

Requires **Node.js 18+** and npm.

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build    # type-check + production build
npm run preview  # preview the production build
npm run lint     # type-check only (tsc --noEmit)
```

## Main flow

1. Open the **Applications Queue** (`/`) — customer applications sorted by urgency and risk.
2. Open a **Client Credit Profile** — customer details, the AI recommendation, risk signals,
   source context, confidence, and matched policy rules.
3. Review the AI reasoning and the evidence behind it.
4. Choose an action: **Accept / Edit limit / Decline / Override / Escalate / Request info**.
5. Confirm in the **Decision Modal** (override requires a reason note + confirmation).
6. The application status, recommendation status, and **Audit Trail** all update; a
   **Decision Outcome** banner summarizes the result.

Try editing a suggested limit (e.g. $175,000 → $150,000) on
**Northstar Medical Supplies** and confirming — the queue row, profile, and audit trail
all reflect the human decision. Decisions persist across reloads via `localStorage`.
To clear all decisions, run `localStorage.removeItem("creditflow.overlay.v1")` in the console.

## Project structure

```
src/
  components/        UI + domain components (ui/ holds the primitives)
  data/              Mock fixtures (applications, recommendations, signals, sources, audit, policy)
  lib/               Formatting, label maps + tones, policy matching, cn()
  pages/             QueuePage, ProfilePage, AuditPage, PolicyRulesPage, NotFoundPage
  store/             AppStore — overlays human decisions on the mock data
  types/             Domain model
```

## Deployment (Vercel)

This repo is configured for **Vercel**. `vercel.json` adds an SPA rewrite so
client-side routes (e.g. `/applications/APP-1042`) resolve on direct load and refresh.

Once the repo is on GitHub and connected to Vercel, Vercel auto-detects the Vite
setup (build: `vite build`, output: `dist`) and deploys on every push:

- Push to `main` → **production** deploy
- Push any other branch / open a PR → **preview** deploy with its own URL

No secrets or environment variables are required (the prototype uses mock data).

## Mock customers

Northstar Medical Supplies · Apex Industrial Parts · BlueWave Retail Group ·
Horizon BuildCo · Summit Electronics
