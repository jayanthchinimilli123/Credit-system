import { ArrowRight, Building2, Clock } from "lucide-react";
import type { CustomerApplication } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { RiskLevelBadge, PriorityBadge } from "./RiskLevelBadge";
import { currency } from "@/lib/format";
import { LinkButton } from "./ui/LinkButton";

// Card variant of a queue row — used on narrow viewports.
export function ApplicationCard({ app }: { app: CustomerApplication }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-slate-900">
              {app.customerName}
            </span>
            <PriorityBadge priority={app.priority} />
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
            <Building2 className="h-3.5 w-3.5" />
            {app.industry}
          </div>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-[11px] text-slate-400">Requested</div>
          <div className="font-medium text-slate-900">
            {currency(app.requestedCreditLimit)}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-slate-400">Current</div>
          <div className="font-medium text-slate-700">
            {currency(app.currentCreditLimit)}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <RiskLevelBadge level={app.aiRiskLevel} />
        <span className="truncate text-xs text-slate-500">AI: {app.aiRecommendation}</span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="h-3.5 w-3.5" />
          {app.daysPending}d pending
        </span>
        <LinkButton to={`/applications/${app.id}`} size="sm">
          Review
          <ArrowRight className="h-3.5 w-3.5" />
        </LinkButton>
      </div>
    </div>
  );
}
