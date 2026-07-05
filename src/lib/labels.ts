import type {
  ActorType,
  ApplicationStatus,
  DecisionType,
  Priority,
  ReasonCode,
  RecommendationStatus,
  RecommendationType,
  RiskCategory,
  RiskLevel,
  SignalStatus,
  SourceStrength,
  SourceType,
} from "@/types";

// ---------------------------------------------------------------------------
// Human-readable labels
// ---------------------------------------------------------------------------

export const statusLabel: Record<ApplicationStatus, string> = {
  needs_review: "Needs review",
  recommendation_ready: "AI recommendation ready",
  missing_information: "Missing information",
  escalated: "Escalated",
  approved: "Approved",
  declined: "Declined",
};

export const riskLabel: Record<RiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  medium_high: "Medium-High",
  high: "High",
  unknown: "Unknown",
};

export const priorityLabel: Record<Priority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export const recommendationTypeLabel: Record<RecommendationType, string> = {
  approve: "Approve",
  approve_with_adjusted_limit: "Approve with adjusted limit",
  escalate: "Escalate for senior approval",
  request_more_documents: "Request more documents",
  decline: "Decline or reduce significantly",
};

export const recommendationStatusLabel: Record<RecommendationStatus, string> = {
  pending_review: "Pending review",
  accepted: "Accepted",
  edited: "Approved with edited limit",
  declined: "Declined",
  overridden: "Overridden",
  escalated: "Escalated",
  more_info_requested: "More info requested",
};

export const actorLabel: Record<ActorType, string> = {
  ai_agent: "AI Agent",
  credit_manager: "Credit Manager",
  credit_analyst: "Credit Analyst",
  system: "System",
  compliance_reviewer: "Compliance Reviewer",
};

export const riskCategoryLabel: Record<RiskCategory, string> = {
  payment_behavior: "Payment Behavior",
  credit_exposure: "Credit Exposure",
  business_profile: "Business Profile",
  external_references: "External / Reference Signals",
  policy_rules: "Policy Rules",
};

export const sourceTypeLabel: Record<SourceType, string> = {
  erp_payment_history: "ERP Payment History",
  invoice_aging: "Invoice Aging",
  trade_reference: "Trade Reference",
  credit_policy: "Credit Policy",
  sales_context: "Sales Context",
  financial_document: "Financial Document",
};

export const strengthLabel: Record<SourceStrength, string> = {
  strong: "Strong",
  medium: "Medium",
  weak: "Weak",
  conflicting: "Conflicting",
};

export const signalStatusLabel: Record<SignalStatus, string> = {
  positive: "Positive",
  watch: "Watch",
  negative: "Negative",
  confirmed: "Confirmed",
  pending: "Pending",
  mostly_positive: "Mostly positive",
};

export const decisionTypeLabel: Record<DecisionType, string> = {
  approved_as_recommended: "Approved as recommended",
  approved_with_edited_limit: "Approved with edited limit",
  declined: "Declined",
  overrode_recommendation: "Overrode AI recommendation",
  escalated: "Escalated",
  requested_more_information: "Requested more information",
};

export const reasonCodeLabel: Record<ReasonCode, string> = {
  strong_payment_history: "Strong payment history",
  limit_too_high: "Limit too high",
  missing_documents: "Missing documents",
  high_past_due_balance: "High past-due balance",
  policy_exception: "Policy exception",
  strategic_account: "Strategic account",
  manual_override: "Manual override",
  senior_approval_required: "Senior approval required",
};

// ---------------------------------------------------------------------------
// Badge color tokens (calm, enterprise palette — soft fills, no neon)
// ---------------------------------------------------------------------------

type Tone = string;

export const statusTone: Record<ApplicationStatus, Tone> = {
  needs_review: "bg-amber-50 text-amber-700 ring-amber-600/20",
  recommendation_ready: "bg-brand-50 text-brand-700 ring-brand-600/20",
  missing_information: "bg-slate-100 text-slate-600 ring-slate-500/20",
  escalated: "bg-violet-50 text-violet-700 ring-violet-600/20",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  declined: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export const riskTone: Record<RiskLevel, Tone> = {
  low: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
  medium_high: "bg-orange-50 text-orange-700 ring-orange-600/20",
  high: "bg-rose-50 text-rose-700 ring-rose-600/20",
  unknown: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export const priorityTone: Record<Priority, Tone> = {
  low: "bg-slate-100 text-slate-600 ring-slate-500/20",
  normal: "bg-slate-100 text-slate-600 ring-slate-500/20",
  high: "bg-orange-50 text-orange-700 ring-orange-600/20",
  urgent: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export const signalStatusTone: Record<SignalStatus, Tone> = {
  positive: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  mostly_positive: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  watch: "bg-amber-50 text-amber-700 ring-amber-600/20",
  pending: "bg-slate-100 text-slate-600 ring-slate-500/20",
  negative: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export const strengthTone: Record<SourceStrength, Tone> = {
  strong: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
  weak: "bg-slate-100 text-slate-600 ring-slate-500/20",
  conflicting: "bg-rose-50 text-rose-700 ring-rose-600/20",
};
