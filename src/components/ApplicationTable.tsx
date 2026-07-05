import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { CustomerApplication } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { RiskLevelBadge, PriorityBadge } from "./RiskLevelBadge";
import { currency, limitMultiple } from "@/lib/format";
import { LinkButton } from "./ui/LinkButton";

// Dense, scannable review table (desktop). Whole row is clickable.
export function ApplicationTable({ apps }: { apps: CustomerApplication[] }) {
  const navigate = useNavigate();

  return (
    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card lg:block">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-xs font-medium text-slate-500">
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Requested</th>
            <th className="px-4 py-3 font-medium">Current</th>
            <th className="px-4 py-3 font-medium">AI risk</th>
            <th className="px-4 py-3 font-medium">AI recommendation</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Pending</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {apps.map((app) => (
            <tr
              key={app.id}
              onClick={() => navigate(`/applications/${app.id}`)}
              className="group cursor-pointer transition-colors hover:bg-slate-50/70"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">{app.customerName}</div>
                <div className="text-xs text-slate-500">
                  {app.industry} · {app.erpAccountId}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">
                  {currency(app.requestedCreditLimit)}
                </div>
                <div className="text-xs text-slate-400">
                  {limitMultiple(app.requestedCreditLimit, app.currentCreditLimit)} current
                </div>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {currency(app.currentCreditLimit)}
              </td>
              <td className="px-4 py-3">
                <RiskLevelBadge level={app.aiRiskLevel} />
              </td>
              <td className="max-w-[220px] px-4 py-3">
                <div className="truncate text-slate-700">{app.aiRecommendation}</div>
                {app.suggestedCreditLimit != null && (
                  <div className="text-xs text-slate-400">
                    Suggested {currency(app.suggestedCreditLimit)}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-4 py-3 text-slate-600">{app.daysPending}d</td>
              <td className="px-4 py-3">
                <PriorityBadge priority={app.priority} />
              </td>
              <td className="px-4 py-3 text-right">
                <LinkButton
                  to={`/applications/${app.id}`}
                  size="sm"
                  variant="outline"
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Review
                  <ArrowRight className="h-3.5 w-3.5" />
                </LinkButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
