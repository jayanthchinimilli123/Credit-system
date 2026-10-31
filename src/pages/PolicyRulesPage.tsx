import { useEffect, useState } from "react";
import { Info, AlertCircle, RefreshCw } from "lucide-react";
import type { PolicyRule } from "@/types";
import { AppShell } from "@/components/AppShell";
import { PolicyRuleCard } from "@/components/PolicyRuleCard";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/LoadingState";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

export function PolicyRulesPage() {
  const [rules, setRules] = useState<PolicyRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setRules(await api.listPolicyRules());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load policy rules.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

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

        {loading ? (
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon={AlertCircle}
            title="Couldn't load policy rules"
            description={error}
            action={
              <Button size="sm" onClick={() => void load()}>
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {rules.map((rule) => (
              <PolicyRuleCard key={rule.id} rule={rule} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
