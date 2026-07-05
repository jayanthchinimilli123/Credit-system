import { Building2, MapPin, Hash } from "lucide-react";
import type { CustomerApplication } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { RiskLevelBadge } from "./RiskLevelBadge";
import { currency, limitMultiple } from "@/lib/format";

export function ClientProfileHeader({
  app,
  finalLimit,
}: {
  app: CustomerApplication;
  finalLimit?: number | null;
}) {
  const decided = app.status === "approved" || app.status === "declined";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-semibold text-slate-900">{app.customerName}</h1>
            <StatusBadge status={app.status} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-slate-400" />
              {app.industry}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-400" />
              {app.region}
            </span>
            <span className="flex items-center gap-1.5">
              <Hash className="h-4 w-4 text-slate-400" />
              {app.erpAccountId}
            </span>
          </div>
        </div>
        <div className="shrink-0">
          <RiskLevelBadge level={app.aiRiskLevel} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-100 bg-slate-100 sm:grid-cols-4">
        <Metric label="Requested limit" value={currency(app.requestedCreditLimit)} />
        <Metric label="Current limit" value={currency(app.currentCreditLimit)} />
        <Metric
          label={decided ? "Approved limit" : "AI suggested limit"}
          value={currency(decided ? finalLimit ?? null : app.suggestedCreditLimit)}
          emphasis={decided ? "positive" : "brand"}
        />
        <Metric
          label="Increase requested"
          value={limitMultiple(app.requestedCreditLimit, app.currentCreditLimit)}
        />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: "brand" | "positive";
}) {
  const valueColor =
    emphasis === "brand"
      ? "text-brand-700"
      : emphasis === "positive"
        ? "text-emerald-700"
        : "text-slate-900";
  return (
    <div className="bg-white px-4 py-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`mt-1 text-lg font-semibold ${valueColor}`}>{value}</div>
    </div>
  );
}
