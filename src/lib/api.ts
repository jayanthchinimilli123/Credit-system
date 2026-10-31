import type {
  AuditEvent,
  CustomerApplication,
  DecisionType,
  HumanDecision,
  PolicyRule,
  ReasonCode,
  Recommendation,
  RiskSignal,
  SourceContext,
} from "@/types";

export interface ApplicationBundle {
  application: CustomerApplication;
  recommendation: Recommendation | null;
  signals: RiskSignal[];
  sources: SourceContext[];
  audit: AuditEvent[];
  policies: PolicyRule[];
  decision: HumanDecision | null;
}

export interface DecisionPayload {
  decisionType: DecisionType;
  approvedLimit: number | null;
  reasonCode: ReasonCode;
  note: string;
  reviewer: string;
}

export interface LeadPayload {
  name: string;
  email: string;
  company?: string;
  role?: string;
  teamSize?: string;
  message?: string;
}

/** Thrown on non-2xx responses, carrying the server's error message if present. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new ApiError("Network error. Could not reach the server.", 0);
  }

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    const msg =
      data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : `Request failed (${res.status})`;
    throw new ApiError(msg, res.status);
  }
  return data as T;
}

export const api = {
  listApplications: () =>
    request<{ applications: CustomerApplication[] }>("/api/applications").then(
      (r) => r.applications,
    ),

  getBundle: (id: string) =>
    request<ApplicationBundle>(`/api/applications/${encodeURIComponent(id)}`),

  submitDecision: (id: string, payload: DecisionPayload) =>
    request<ApplicationBundle>(`/api/applications/${encodeURIComponent(id)}/decision`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  listPolicyRules: () =>
    request<{ rules: PolicyRule[] }>("/api/policy-rules").then((r) => r.rules),

  submitLead: (payload: LeadPayload) =>
    request<{ ok: boolean; id: string }>("/api/leads", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
