import { Info } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PolicyRuleCard } from "@/components/PolicyRuleCard";
import { policyRules } from "@/data/policyRules";

export function PolicyRulesPage() {
  return (
    <AppShell
      header={
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Policy Rules</h1>
          <p className="text-sm text-slate-500">
            The business rules that decide when applications need human review.
          </p>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-xl border border-brand-200/70 bg-brand-50/50 px-5 py-4">
          <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600" />
          <p className="text-sm leading-relaxed text-slate-700">
            CreditFlow AI is not just “AI says yes or no.” Every recommendation is checked
            against these credit policy rules, which determine approval thresholds,
            escalation, and when a human reviewer must step in.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {policyRules.map((rule) => (
            <PolicyRuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
