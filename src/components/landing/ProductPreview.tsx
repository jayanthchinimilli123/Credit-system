import { Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

// A self-contained "screenshot" of the product, built with HTML/CSS (no external
// image assets). Used as the hero visual on the landing page.
export function ProductPreview() {
  const rows = [
    { name: "Northstar Medical", risk: "Medium", riskTone: "bg-amber-50 text-amber-700", status: "Needs review", statusTone: "bg-amber-50 text-amber-700", amount: "$250,000" },
    { name: "Apex Industrial", risk: "Med-High", riskTone: "bg-orange-50 text-orange-700", status: "Escalated", statusTone: "bg-violet-50 text-violet-700", amount: "$500,000" },
    { name: "BlueWave Retail", risk: "Low", riskTone: "bg-emerald-50 text-emerald-700", status: "Ready", statusTone: "bg-brand-50 text-brand-700", amount: "$75,000" },
    { name: "Summit Electronics", risk: "High", riskTone: "bg-rose-50 text-rose-700", status: "Needs review", statusTone: "bg-amber-50 text-amber-700", amount: "$350,000" },
  ];

  return (
    <div className="relative">
      {/* Browser window frame */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel ring-1 ring-slate-900/5">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-rose-300" />
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          <span className="h-3 w-3 rounded-full bg-emerald-300" />
          <div className="ml-3 flex h-6 flex-1 items-center rounded-md bg-white px-3 text-[11px] text-slate-400 ring-1 ring-slate-200">
            creditflow.ai/app
          </div>
        </div>

        <div className="flex">
          {/* Mini sidebar */}
          <div className="hidden w-32 shrink-0 border-r border-slate-100 p-3 sm:block">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded bg-brand-600" />
              <div className="h-2 w-14 rounded bg-slate-200" />
            </div>
            <div className="mt-5 space-y-1.5">
              <div className="flex items-center gap-1.5 rounded-md bg-brand-50 px-2 py-1.5">
                <div className="h-2.5 w-2.5 rounded bg-brand-300" />
                <div className="h-2 w-12 rounded bg-brand-200" />
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5">
                <div className="h-2.5 w-2.5 rounded bg-slate-200" />
                <div className="h-2 w-10 rounded bg-slate-100" />
              </div>
            </div>
          </div>

          {/* Queue */}
          <div className="min-w-0 flex-1 p-4">
            <div className="mb-3">
              <div className="text-sm font-semibold text-slate-900">Applications Queue</div>
              <div className="text-[11px] text-slate-400">Awaiting your review</div>
            </div>
            <div className="space-y-2">
              {rows.map((r) => (
                <div
                  key={r.name}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-xs font-medium text-slate-800">{r.name}</div>
                    <div className="text-[10px] text-slate-400">{r.amount}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${r.riskTone}`}>
                      {r.risk}
                    </span>
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${r.statusTone}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI recommendation card */}
      <div className="absolute -bottom-5 right-0 w-56 rounded-xl border border-brand-200/70 bg-white p-4 shadow-modal sm:-right-5 sm:w-64">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className="text-xs font-semibold text-slate-900">AI Recommendation</div>
        </div>
        <div className="mt-3 text-[11px] uppercase tracking-wide text-slate-400">Suggested</div>
        <div className="text-sm font-semibold text-slate-900">Approve with adjusted limit</div>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Confidence</span>
          <span className="font-semibold text-emerald-600">84%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: "84%" }} />
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          92% invoices paid on time
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
          <ShieldCheck className="h-3 w-3 text-brand-500" />
          Human approval required
        </div>
      </div>
    </div>
  );
}
