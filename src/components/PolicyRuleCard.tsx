import { ShieldCheck } from "lucide-react";
import type { PolicyRule } from "@/types";
import { Badge } from "./ui/Badge";

export function PolicyRuleCard({ rule }: { rule: PolicyRule }) {
  return (
    <div className="flex items-start gap-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <ShieldCheck className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">{rule.title}</h3>
          <Badge tone="bg-slate-100 text-slate-600 ring-slate-500/20">{rule.category}</Badge>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{rule.description}</p>
        <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-400">
          <span
            className={`inline-flex h-1.5 w-1.5 rounded-full ${
              rule.active ? "bg-emerald-500" : "bg-slate-300"
            }`}
          />
          {rule.active ? "Active" : "Inactive"}
          <span className="text-slate-300">·</span>
          Requires {rule.requiresRole}
        </div>
      </div>
    </div>
  );
}
