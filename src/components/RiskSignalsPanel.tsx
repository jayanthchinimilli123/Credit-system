import { useMemo } from "react";
import { Activity } from "lucide-react";
import type { RiskCategory, RiskSignal, SignalStatus } from "@/types";
import { riskCategoryLabel, signalStatusLabel, signalStatusTone } from "@/lib/labels";
import { Badge } from "./ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { cn } from "@/lib/utils";

const categoryOrder: RiskCategory[] = [
  "payment_behavior",
  "credit_exposure",
  "business_profile",
  "external_references",
];

const severityBar: Record<RiskSignal["severity"], string> = {
  info: "bg-emerald-400",
  watch: "bg-amber-400",
  risk: "bg-rose-400",
};

export function RiskSignalsPanel({ signals }: { signals: RiskSignal[] }) {
  const grouped = useMemo(() => {
    const map = new Map<RiskCategory, RiskSignal[]>();
    for (const s of signals) {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return map;
  }, [signals]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-slate-400" />
          <CardTitle>Risk Signals</CardTitle>
        </div>
        <span className="text-xs text-slate-400">{signals.length} signals</span>
      </CardHeader>
      <CardContent className="space-y-5">
        {categoryOrder.map((cat) => {
          const items = grouped.get(cat);
          if (!items || items.length === 0) return null;
          return (
            <div key={cat}>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {riskCategoryLabel[cat]}
              </div>
              <div className="space-y-2">
                {items.map((s) => (
                  <SignalRow key={s.id} signal={s} />
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function SignalRow({ signal }: { signal: RiskSignal }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:border-slate-200">
      <span
        className={cn("mt-1 h-8 w-1 shrink-0 rounded-full", severityBar[signal.severity])}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-800">{signal.label}</span>
          <Badge tone={signalStatusTone[signal.status as SignalStatus]}>
            {signalStatusLabel[signal.status as SignalStatus]}
          </Badge>
        </div>
        <div className="mt-0.5 text-sm font-semibold text-slate-900">{signal.value}</div>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{signal.explanation}</p>
      </div>
    </div>
  );
}
