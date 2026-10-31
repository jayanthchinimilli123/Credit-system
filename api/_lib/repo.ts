import type {
  ApplicationStatus,
  AuditEvent,
  CustomerApplication,
  DecisionType,
  HumanDecision,
  PolicyRule,
  ReasonCode,
  Recommendation,
  RecommendationStatus,
  RiskSignal,
  SourceContext,
} from "../../src/types";
import {
  ensureReady,
  mapApplication,
  mapAuditEvent,
  mapPolicyRule,
  mapRecommendation,
  mapRiskSignal,
  mapSourceContext,
  sql,
} from "./db";

export interface ApplicationBundle {
  application: CustomerApplication;
  recommendation: Recommendation | null;
  signals: RiskSignal[];
  sources: SourceContext[];
  audit: AuditEvent[];
  policies: PolicyRule[];
  decision: HumanDecision | null;
}

export async function listApplications(): Promise<CustomerApplication[]> {
  await ensureReady();
  const rows = (await sql`SELECT * FROM applications`) as any[];
  return rows.map(mapApplication);
}

export async function getBundle(id: string): Promise<ApplicationBundle | null> {
  await ensureReady();
  const appRows = (await sql`SELECT * FROM applications WHERE id = ${id}`) as any[];
  if (appRows.length === 0) return null;
  const application = mapApplication(appRows[0]);

  const [recRows, sigRows, srcRows, audRows, polRows, decRows] = await Promise.all([
    sql`SELECT * FROM recommendations WHERE application_id = ${id}` as Promise<any[]>,
    sql`SELECT * FROM risk_signals WHERE application_id = ${id}` as Promise<any[]>,
    sql`SELECT * FROM source_context WHERE application_id = ${id}` as Promise<any[]>,
    sql`SELECT * FROM audit_events WHERE application_id = ${id} ORDER BY seq ASC` as Promise<any[]>,
    sql`SELECT * FROM policy_rules` as Promise<any[]>,
    sql`SELECT * FROM decisions WHERE application_id = ${id}` as Promise<any[]>,
  ]);

  const signals = sigRows.map(mapRiskSignal);
  const sources = srcRows.map(mapSourceContext);
  const allPolicies = polRows.map(mapPolicyRule);

  return {
    application,
    recommendation: recRows.length ? mapRecommendation(recRows[0]) : null,
    signals,
    sources,
    audit: audRows.map(mapAuditEvent),
    policies: matchedPolicyRules(application, signals, sources, allPolicies),
    decision: decRows.length ? mapDecision(decRows[0]) : null,
  };
}

export async function listPolicyRules(): Promise<PolicyRule[]> {
  await ensureReady();
  const rows = (await sql`SELECT * FROM policy_rules`) as any[];
  return rows.map(mapPolicyRule);
}

export interface DecisionInput {
  decisionType: DecisionType;
  approvedLimit: number | null;
  reasonCode: ReasonCode;
  note: string;
  reviewer: string;
}

export async function submitDecision(
  id: string,
  input: DecisionInput,
): Promise<ApplicationBundle | null> {
  await ensureReady();
  const exists = (await sql`SELECT id FROM applications WHERE id = ${id}`) as any[];
  if (exists.length === 0) return null;

  const { app, rec } = resolveStatuses(input.decisionType, input.approvedLimit);
  const decidedAt = `Today, ${clockLabel()}`;

  await sql`UPDATE applications SET status = ${app}, final_limit = ${input.approvedLimit} WHERE id = ${id}`;
  await sql`UPDATE recommendations SET status = ${rec} WHERE application_id = ${id}`;
  await sql`INSERT INTO decisions (application_id, decision_type, approved_limit, reason_code, note, reviewer, decided_at)
    VALUES (${id}, ${input.decisionType}, ${input.approvedLimit}, ${input.reasonCode}, ${input.note}, ${input.reviewer}, ${decidedAt})
    ON CONFLICT (application_id) DO UPDATE SET
      decision_type = EXCLUDED.decision_type, approved_limit = EXCLUDED.approved_limit,
      reason_code = EXCLUDED.reason_code, note = EXCLUDED.note,
      reviewer = EXCLUDED.reviewer, decided_at = EXCLUDED.decided_at`;

  for (const ev of buildAuditForDecision(id, input, app, decidedAt)) {
    await sql`INSERT INTO audit_events (id, application_id, timestamp, actor, actor_type, action, note, status_change)
      VALUES (${ev.id}, ${ev.applicationId}, ${ev.timestamp}, ${ev.actor}, ${ev.actorType}, ${ev.action}, ${ev.note ?? null}, ${ev.statusChange ?? null})`;
  }

  return getBundle(id);
}

export interface LeadInput {
  name: string;
  email: string;
  company?: string;
  role?: string;
  teamSize?: string;
  message?: string;
}

export async function createLead(input: LeadInput): Promise<{ id: string }> {
  await ensureReady();
  const id = makeId("lead");
  await sql`INSERT INTO leads (id, name, email, company, role, team_size, message)
    VALUES (${id}, ${input.name}, ${input.email}, ${input.company ?? null}, ${input.role ?? null}, ${input.teamSize ?? null}, ${input.message ?? null})`;
  return { id };
}

// ---------------------------------------------------------------------------
// Decision engine (status transitions + audit generation) — server-side
// ---------------------------------------------------------------------------
function resolveStatuses(
  decisionType: DecisionType,
  approvedLimit: number | null,
): { app: ApplicationStatus; rec: RecommendationStatus } {
  switch (decisionType) {
    case "approved_as_recommended":
      return { app: "approved", rec: "accepted" };
    case "approved_with_edited_limit":
      return { app: "approved", rec: "edited" };
    case "declined":
      return { app: "declined", rec: "declined" };
    case "overrode_recommendation":
      return { app: (approvedLimit ?? 0) > 0 ? "approved" : "declined", rec: "overridden" };
    case "escalated":
      return { app: "escalated", rec: "escalated" };
    case "requested_more_information":
      return { app: "missing_information", rec: "more_info_requested" };
  }
}

const decisionTypeLabel: Record<DecisionType, string> = {
  approved_as_recommended: "Approved as recommended",
  approved_with_edited_limit: "Approved with edited limit",
  declined: "Declined",
  overrode_recommendation: "Overrode AI recommendation",
  escalated: "Escalated",
  requested_more_information: "Requested more information",
};

const statusLabel: Record<ApplicationStatus, string> = {
  needs_review: "Needs review",
  recommendation_ready: "AI recommendation ready",
  missing_information: "Missing information",
  escalated: "Escalated",
  approved: "Approved",
  declined: "Declined",
};

function buildAuditForDecision(
  applicationId: string,
  input: DecisionInput,
  app: ApplicationStatus,
  decidedAt: string,
): AuditEvent[] {
  const events: AuditEvent[] = [];
  const usesEditedLimit =
    input.approvedLimit != null &&
    (input.decisionType === "approved_with_edited_limit" ||
      input.decisionType === "overrode_recommendation");

  events.push({
    id: makeId("aud"),
    applicationId,
    timestamp: decidedAt,
    actor: input.reviewer,
    actorType: "credit_manager",
    action: usesEditedLimit
      ? `Credit Manager set approved limit to ${currency(input.approvedLimit)}`
      : `Credit Manager selected: ${decisionTypeLabel[input.decisionType]}`,
  });

  events.push({
    id: makeId("aud"),
    applicationId,
    timestamp: decidedAt,
    actor: input.reviewer,
    actorType: "credit_manager",
    action: "Decision submitted",
    note: input.note || undefined,
    statusChange: statusLabel[app],
  });

  return events;
}

export function matchedPolicyRules(
  app: CustomerApplication,
  signals: RiskSignal[],
  sources: SourceContext[],
  allRules: PolicyRule[],
): PolicyRule[] {
  const matches = new Set<string>();
  if (app.requestedCreditLimit > app.currentCreditLimit * 2) matches.add("POL-01");
  if (signals.some((s) => /past-due/i.test(s.label) && /30|21/.test(s.value) && s.severity === "risk"))
    matches.add("POL-02");
  if (app.requestedCreditLimit >= 500_000) matches.add("POL-03");
  if (
    sources.some(
      (s) => s.sourceType === "trade_reference" && /pending|partially|missing|mixed/i.test(s.status),
    ) ||
    app.status === "missing_information"
  )
    matches.add("POL-04");
  if (app.aiRiskLevel === "medium" || app.aiRiskLevel === "medium_high") matches.add("POL-05");
  if (app.aiRiskLevel === "high") matches.add("POL-06");
  return allRules.filter((r) => matches.has(r.id));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapDecision(row: any): HumanDecision {
  return {
    applicationId: row.application_id,
    decisionType: row.decision_type,
    approvedLimit: row.approved_limit,
    reasonCode: row.reason_code,
    note: row.note ?? "",
    reviewer: row.reviewer,
    decidedAt: row.decided_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function currency(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function clockLabel(): string {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}
