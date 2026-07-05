import { Building2 } from "lucide-react";
import type { CustomerApplication } from "@/types";
import { currency } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

export function CustomerOverview({ app }: { app: CustomerApplication }) {
  const rows: { label: string; value: string }[] = [
    { label: "Industry", value: app.industry },
    { label: "Region", value: app.region },
    { label: "ERP account ID", value: app.erpAccountId },
    { label: "Company age", value: app.companyAge },
    { label: "Customer since", value: app.customerSince },
    { label: "Assigned reviewer", value: app.assignedReviewer },
    { label: "Open balance", value: currency(app.openBalance) },
    { label: "Outstanding invoices", value: String(app.outstandingInvoices) },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-slate-400" />
          <CardTitle>Customer Overview</CardTitle>
        </div>
        <span className="text-xs text-slate-400">{app.id}</span>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          {rows.map((r) => (
            <div key={r.label}>
              <dt className="text-[11px] uppercase tracking-wide text-slate-400">
                {r.label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-800">{r.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 rounded-lg bg-slate-50 px-3.5 py-2.5 text-sm leading-relaxed text-slate-600">
          {app.summary}
        </p>
      </CardContent>
    </Card>
  );
}
