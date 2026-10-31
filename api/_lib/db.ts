import { neon } from "@neondatabase/serverless";
import type {
  AuditEvent,
  CustomerApplication,
  PolicyRule,
  Recommendation,
  RiskSignal,
  SourceContext,
} from "../../src/types";
import {
  seedApplications,
  seedAuditEvents,
  seedPolicyRules,
  seedRecommendations,
  seedRiskSignals,
  seedSourceContext,
} from "./seed-data";

function connectionString(): string {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ""
  );
}

// Which DB-related env var names are present (names only — never values).
export function dbEnvPresence(): Record<string, boolean> {
  return {
    DATABASE_URL: !!process.env.DATABASE_URL,
    POSTGRES_URL: !!process.env.POSTGRES_URL,
    POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
  };
}

// Lazily create the client so a missing connection string surfaces as a clean
// JSON error inside a handler instead of crashing the function at import time.
type SqlTag = ReturnType<typeof neon>;
let _sql: SqlTag | null = null;

function getSql(): SqlTag {
  if (_sql) return _sql;
  const cs = connectionString();
  if (!cs) {
    throw new Error(
      "No database connection string. Set DATABASE_URL or POSTGRES_URL (Vercel → Storage → Neon).",
    );
  }
  _sql = neon(cs);
  return _sql;
}

// Tagged-template proxy that initializes the client on first use.
export const sql: SqlTag = ((strings: TemplateStringsArray, ...params: unknown[]) =>
  (getSql() as unknown as (s: TemplateStringsArray, ...p: unknown[]) => unknown)(
    strings,
    ...params,
  )) as unknown as SqlTag;

// ---------------------------------------------------------------------------
// Schema + seed (idempotent; runs on first request per warm instance)
// ---------------------------------------------------------------------------
let readyPromise: Promise<void> | null = null;

export function ensureReady(): Promise<void> {
  if (!readyPromise) readyPromise = bootstrap();
  return readyPromise;
}

async function bootstrap(): Promise<void> {
  await sql`CREATE TABLE IF NOT EXISTS applications (
    id text PRIMARY KEY,
    customer_name text NOT NULL,
    industry text, region text, erp_account_id text,
    requested_credit_limit integer, current_credit_limit integer,
    suggested_credit_limit integer,
    status text, priority text, assigned_reviewer text,
    days_pending integer, ai_risk_level text, ai_confidence integer,
    ai_recommendation text, summary text, last_updated text,
    company_age text, customer_since text,
    open_balance integer, outstanding_invoices integer,
    final_limit integer
  )`;

  await sql`CREATE TABLE IF NOT EXISTS recommendations (
    id text PRIMARY KEY,
    application_id text NOT NULL,
    recommendation_type text, requested_limit integer, suggested_limit integer,
    confidence integer, risk_level text, reasoning text,
    supporting_signals jsonb, risk_if_approved jsonb, risk_if_declined jsonb,
    required_reviewer_role text, status text
  )`;

  await sql`CREATE TABLE IF NOT EXISTS risk_signals (
    id text PRIMARY KEY,
    application_id text NOT NULL,
    category text, label text, value text, status text, explanation text, severity text
  )`;

  await sql`CREATE TABLE IF NOT EXISTS source_context (
    id text PRIMARY KEY,
    application_id text NOT NULL,
    source_name text, source_type text, summary text,
    strength text, status text, timestamp text
  )`;

  await sql`CREATE TABLE IF NOT EXISTS audit_events (
    id text PRIMARY KEY,
    application_id text NOT NULL,
    timestamp text, actor text, actor_type text, action text,
    note text, status_change text,
    seq bigserial
  )`;

  await sql`CREATE TABLE IF NOT EXISTS policy_rules (
    id text PRIMARY KEY,
    title text, description text, category text, requires_role text, active boolean
  )`;

  await sql`CREATE TABLE IF NOT EXISTS decisions (
    application_id text PRIMARY KEY,
    decision_type text, approved_limit integer, reason_code text,
    note text, reviewer text, decided_at text
  )`;

  await sql`CREATE TABLE IF NOT EXISTS leads (
    id text PRIMARY KEY,
    name text NOT NULL, email text NOT NULL, company text,
    role text, team_size text, message text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;

  const rows = (await sql`SELECT count(*)::int AS count FROM applications`) as {
    count: number;
  }[];
  if (rows[0]?.count === 0) await seed();
}

async function seed(): Promise<void> {
  for (const a of seedApplications) {
    await sql`INSERT INTO applications (
      id, customer_name, industry, region, erp_account_id,
      requested_credit_limit, current_credit_limit, suggested_credit_limit,
      status, priority, assigned_reviewer, days_pending, ai_risk_level,
      ai_confidence, ai_recommendation, summary, last_updated,
      company_age, customer_since, open_balance, outstanding_invoices, final_limit
    ) VALUES (
      ${a.id}, ${a.customerName}, ${a.industry}, ${a.region}, ${a.erpAccountId},
      ${a.requestedCreditLimit}, ${a.currentCreditLimit}, ${a.suggestedCreditLimit},
      ${a.status}, ${a.priority}, ${a.assignedReviewer}, ${a.daysPending}, ${a.aiRiskLevel},
      ${a.aiConfidence}, ${a.aiRecommendation}, ${a.summary}, ${a.lastUpdated},
      ${a.companyAge}, ${a.customerSince}, ${a.openBalance}, ${a.outstandingInvoices}, NULL
    ) ON CONFLICT (id) DO NOTHING`;
  }

  for (const r of seedRecommendations) {
    await sql`INSERT INTO recommendations (
      id, application_id, recommendation_type, requested_limit, suggested_limit,
      confidence, risk_level, reasoning, supporting_signals, risk_if_approved,
      risk_if_declined, required_reviewer_role, status
    ) VALUES (
      ${r.id}, ${r.applicationId}, ${r.recommendationType}, ${r.requestedLimit}, ${r.suggestedLimit},
      ${r.confidence}, ${r.riskLevel}, ${r.reasoning},
      ${JSON.stringify(r.supportingSignals)}::jsonb, ${JSON.stringify(r.riskIfApproved)}::jsonb,
      ${JSON.stringify(r.riskIfDeclined)}::jsonb, ${r.requiredReviewerRole}, ${r.status}
    ) ON CONFLICT (id) DO NOTHING`;
  }

  for (const s of seedRiskSignals) {
    await sql`INSERT INTO risk_signals (
      id, application_id, category, label, value, status, explanation, severity
    ) VALUES (
      ${s.id}, ${s.applicationId}, ${s.category}, ${s.label}, ${s.value},
      ${s.status}, ${s.explanation}, ${s.severity}
    ) ON CONFLICT (id) DO NOTHING`;
  }

  for (const s of seedSourceContext) {
    await sql`INSERT INTO source_context (
      id, application_id, source_name, source_type, summary, strength, status, timestamp
    ) VALUES (
      ${s.id}, ${s.applicationId}, ${s.sourceName}, ${s.sourceType}, ${s.summary},
      ${s.strength}, ${s.status}, ${s.timestamp}
    ) ON CONFLICT (id) DO NOTHING`;
  }

  for (const e of seedAuditEvents) {
    await sql`INSERT INTO audit_events (
      id, application_id, timestamp, actor, actor_type, action, note, status_change
    ) VALUES (
      ${e.id}, ${e.applicationId}, ${e.timestamp}, ${e.actor}, ${e.actorType},
      ${e.action}, ${e.note ?? null}, ${e.statusChange ?? null}
    ) ON CONFLICT (id) DO NOTHING`;
  }

  for (const p of seedPolicyRules) {
    await sql`INSERT INTO policy_rules (
      id, title, description, category, requires_role, active
    ) VALUES (
      ${p.id}, ${p.title}, ${p.description}, ${p.category}, ${p.requiresRole}, ${p.active}
    ) ON CONFLICT (id) DO NOTHING`;
  }
}

// ---------------------------------------------------------------------------
// Row mappers (snake_case rows -> camelCase domain objects)
// ---------------------------------------------------------------------------
/* eslint-disable @typescript-eslint/no-explicit-any */
export function mapApplication(row: any): CustomerApplication {
  const finalLimit: number | null = row.final_limit;
  const suggested: number | null = row.suggested_credit_limit;
  return {
    id: row.id,
    customerName: row.customer_name,
    industry: row.industry,
    region: row.region,
    erpAccountId: row.erp_account_id,
    requestedCreditLimit: row.requested_credit_limit,
    currentCreditLimit: row.current_credit_limit,
    // Reflect a decided limit in the queue's suggested-limit surface.
    suggestedCreditLimit: finalLimit !== null && finalLimit !== undefined ? finalLimit : suggested,
    status: row.status,
    priority: row.priority,
    assignedReviewer: row.assigned_reviewer,
    daysPending: row.days_pending,
    aiRiskLevel: row.ai_risk_level,
    aiConfidence: row.ai_confidence,
    aiRecommendation: row.ai_recommendation,
    summary: row.summary,
    lastUpdated: row.last_updated,
    companyAge: row.company_age,
    customerSince: row.customer_since,
    openBalance: row.open_balance,
    outstandingInvoices: row.outstanding_invoices,
  };
}

export function mapRecommendation(row: any): Recommendation {
  return {
    id: row.id,
    applicationId: row.application_id,
    recommendationType: row.recommendation_type,
    requestedLimit: row.requested_limit,
    suggestedLimit: row.suggested_limit,
    confidence: row.confidence,
    riskLevel: row.risk_level,
    reasoning: row.reasoning,
    supportingSignals: row.supporting_signals ?? [],
    riskIfApproved: row.risk_if_approved ?? [],
    riskIfDeclined: row.risk_if_declined ?? [],
    requiredReviewerRole: row.required_reviewer_role,
    status: row.status,
  };
}

export function mapRiskSignal(row: any): RiskSignal {
  return {
    id: row.id,
    applicationId: row.application_id,
    category: row.category,
    label: row.label,
    value: row.value,
    status: row.status,
    explanation: row.explanation,
    severity: row.severity,
  };
}

export function mapSourceContext(row: any): SourceContext {
  return {
    id: row.id,
    applicationId: row.application_id,
    sourceName: row.source_name,
    sourceType: row.source_type,
    summary: row.summary,
    strength: row.strength,
    status: row.status,
    timestamp: row.timestamp,
  };
}

export function mapAuditEvent(row: any): AuditEvent {
  return {
    id: row.id,
    applicationId: row.application_id,
    timestamp: row.timestamp,
    actor: row.actor,
    actorType: row.actor_type,
    action: row.action,
    note: row.note ?? undefined,
    statusChange: row.status_change ?? undefined,
  };
}

export function mapPolicyRule(row: any): PolicyRule {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    requiresRole: row.requires_role,
    active: row.active,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Shared CORS/JSON helper for handlers.
export function sendJson(res: any, status: number, body: unknown): void {
  res.setHeader("Content-Type", "application/json");
  res.status(status).send(JSON.stringify(body));
}
