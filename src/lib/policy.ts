import type { CustomerApplication, PolicyRule, RiskSignal, SourceContext } from "@/types";
import { policyRules } from "@/data/policyRules";

// Derive which policy rules an application triggers (drives "why this needs
// human review" — the product is not just "AI says yes/no").
export function matchedPolicyRules(
  app: CustomerApplication,
  signals: RiskSignal[],
  sources: SourceContext[],
): PolicyRule[] {
  const matches = new Set<string>();

  if (app.requestedCreditLimit > app.currentCreditLimit * 2) matches.add("POL-01");

  const hasPastDue30 = signals.some(
    (s) => /past-due/i.test(s.label) && /30|21/.test(s.value) && s.severity === "risk",
  );
  if (hasPastDue30) matches.add("POL-02");

  if (app.requestedCreditLimit >= 500_000) matches.add("POL-03");

  const missingRefs = sources.some(
    (s) =>
      s.sourceType === "trade_reference" &&
      /pending|partially|missing|mixed/i.test(s.status),
  );
  if (missingRefs || app.status === "missing_information") matches.add("POL-04");

  if (app.aiRiskLevel === "medium" || app.aiRiskLevel === "medium_high")
    matches.add("POL-05");

  if (app.aiRiskLevel === "high") matches.add("POL-06");

  return policyRules.filter((r) => matches.has(r.id));
}
