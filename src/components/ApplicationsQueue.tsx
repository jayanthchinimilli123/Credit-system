import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, FileWarning } from "lucide-react";
import type { ApplicationStatus, CustomerApplication } from "@/types";
import { statusLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { ApplicationTable } from "./ApplicationTable";
import { ApplicationCard } from "./ApplicationCard";
import { EmptyState } from "./EmptyState";

type Filter = "all" | ApplicationStatus;

// Priority weighting so the most urgent, oldest reviews float to the top.
const priorityWeight: Record<CustomerApplication["priority"], number> = {
  urgent: 3,
  high: 2,
  normal: 1,
  low: 0,
};

const filterOrder: Filter[] = [
  "all",
  "needs_review",
  "recommendation_ready",
  "escalated",
  "missing_information",
  "approved",
  "declined",
];

export function ApplicationsQueue({ apps }: { apps: CustomerApplication[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: apps.length };
    for (const a of apps) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [apps]);

  const stats = useMemo(
    () => ({
      needsReview: apps.filter((a) => a.status === "needs_review").length,
      escalated: apps.filter((a) => a.status === "escalated").length,
      missing: apps.filter((a) => a.status === "missing_information").length,
      decided: apps.filter((a) => a.status === "approved" || a.status === "declined")
        .length,
    }),
    [apps],
  );

  const visible = useMemo(() => {
    const list = filter === "all" ? apps : apps.filter((a) => a.status === filter);
    return [...list].sort(
      (a, b) =>
        priorityWeight[b.priority] - priorityWeight[a.priority] ||
        b.daysPending - a.daysPending,
    );
  }, [apps, filter]);

  return (
    <div className="space-y-5">
      {/* Summary strip - deliberately minimal, not a dashboard */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatChip
          icon={Clock3}
          label="Needs review"
          value={stats.needsReview}
          tone="text-amber-600 bg-amber-50"
        />
        <StatChip
          icon={AlertTriangle}
          label="Escalated"
          value={stats.escalated}
          tone="text-violet-600 bg-violet-50"
        />
        <StatChip
          icon={FileWarning}
          label="Missing info"
          value={stats.missing}
          tone="text-slate-600 bg-slate-100"
        />
        <StatChip
          icon={CheckCircle2}
          label="Decided"
          value={stats.decided}
          tone="text-emerald-600 bg-emerald-50"
        />
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3">
        {filterOrder.map((f) => {
          const count = counts[f] ?? 0;
          if (f !== "all" && count === 0) return null;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "focus-ring rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                filter === f
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {f === "all" ? "All applications" : statusLabel[f]}
              <span
                className={cn(
                  "ml-1.5 rounded px-1.5 py-0.5 text-[11px] font-semibold",
                  filter === f ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No applications in this view"
          description="Try a different status filter to see more of the review queue."
        />
      ) : (
        <>
          <ApplicationTable apps={visible} />
          <div className="grid gap-3 lg:hidden">
            {visible.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Clock3;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-card">
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", tone)}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <div className="text-xl font-semibold leading-none text-slate-900">{value}</div>
        <div className="mt-1 text-xs text-slate-500">{label}</div>
      </div>
    </div>
  );
}
