// ---------------------------------------------------------------------------
// CreditFlow AI — domain model
// All shapes are frontend-only mock contracts (no backend / real scoring).
// ---------------------------------------------------------------------------

export type ApplicationStatus =
  | "needs_review"
  | "recommendation_ready"
  | "missing_information"
  | "escalated"
  | "approved"
  | "declined";

export type RiskLevel = "low" | "medium" | "medium_high" | "high" | "unknown";

export type Priority = "low" | "normal" | "high" | "urgent";

export type RecommendationType =
  | "approve"
  | "approve_with_adjusted_limit"
  | "escalate"
  | "request_more_documents"
  | "decline";

export type RecommendationStatus =
  | "pending_review"
  | "accepted"
  | "edited"
  | "declined"
  | "overridden"
  | "escalated"
  | "more_info_requested";

export type ActorType =
  | "ai_agent"
  | "credit_manager"
  | "credit_analyst"
  | "system"
  | "compliance_reviewer";

export type RiskCategory =
  | "payment_behavior"
  | "credit_exposure"
  | "business_profile"
  | "external_references"
  | "policy_rules";

export type SignalStatus =
  | "positive"
  | "watch"
  | "negative"
  | "confirmed"
  | "pending"
  | "mostly_positive";

export type SourceType =
  | "erp_payment_history"
  | "invoice_aging"
  | "trade_reference"
  | "credit_policy"
  | "sales_context"
  | "financial_document";

export type SourceStrength = "strong" | "medium" | "weak" | "conflicting";

export type DecisionType =
  | "approved_as_recommended"
  | "approved_with_edited_limit"
  | "declined"
  | "overrode_recommendation"
  | "escalated"
  | "requested_more_information";

export type ReasonCode =
  | "strong_payment_history"
  | "limit_too_high"
  | "missing_documents"
  | "high_past_due_balance"
  | "policy_exception"
  | "strategic_account"
  | "manual_override"
  | "senior_approval_required";

export interface CustomerApplication {
  id: string;
  customerName: string;
  industry: string;
  region: string;
  erpAccountId: string;
  requestedCreditLimit: number;
  currentCreditLimit: number;
  suggestedCreditLimit: number | null;
  status: ApplicationStatus;
  priority: Priority;
  assignedReviewer: string;
  daysPending: number;
  aiRiskLevel: RiskLevel;
  aiConfidence: number; // 0-100
  aiRecommendation: string; // short human label
  summary: string;
  lastUpdated: string; // ISO-ish label
  companyAge: string;
  customerSince: string;
  openBalance: number;
  outstandingInvoices: number;
}

export interface RiskSignal {
  id: string;
  applicationId: string;
  category: RiskCategory;
  label: string;
  value: string;
  status: SignalStatus;
  explanation: string;
  severity: "info" | "watch" | "risk";
}

export interface SourceContext {
  id: string;
  applicationId: string;
  sourceName: string;
  sourceType: SourceType;
  summary: string;
  strength: SourceStrength;
  status: string;
  timestamp: string;
}

export interface Recommendation {
  id: string;
  applicationId: string;
  recommendationType: RecommendationType;
  requestedLimit: number;
  suggestedLimit: number | null;
  confidence: number; // 0-100
  riskLevel: RiskLevel;
  reasoning: string;
  supportingSignals: string[];
  riskIfApproved: string[];
  riskIfDeclined: string[];
  requiredReviewerRole: string;
  status: RecommendationStatus;
}

export interface AuditEvent {
  id: string;
  applicationId: string;
  timestamp: string;
  actor: string;
  actorType: ActorType;
  action: string;
  note?: string;
  statusChange?: string;
}

export interface PolicyRule {
  id: string;
  title: string;
  description: string;
  category: string;
  requiresRole: string;
  active: boolean;
}

// The recorded outcome of a human decision (drives status + audit updates).
export interface HumanDecision {
  applicationId: string;
  decisionType: DecisionType;
  approvedLimit: number | null;
  reasonCode: ReasonCode;
  note: string;
  reviewer: string;
  decidedAt: string;
}
