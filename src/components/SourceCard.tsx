import {
  Database,
  FileClock,
  Handshake,
  Scale,
  Briefcase,
  FileText,
  ChevronRight,
} from "lucide-react";
import type { SourceContext, SourceType } from "@/types";
import { sourceTypeLabel, strengthLabel, strengthTone } from "@/lib/labels";
import { Badge } from "./ui/Badge";

const sourceIcon: Record<SourceType, typeof Database> = {
  erp_payment_history: Database,
  invoice_aging: FileClock,
  trade_reference: Handshake,
  credit_policy: Scale,
  sales_context: Briefcase,
  financial_document: FileText,
};

export function SourceCard({ source }: { source: SourceContext }) {
  const Icon = sourceIcon[source.sourceType];
  return (
    <button
      type="button"
      className="focus-ring group w-full rounded-lg border border-slate-100 p-3 text-left transition-colors hover:border-slate-200 hover:bg-slate-50/60"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-slate-800">{source.sourceName}</span>
            <Badge tone={strengthTone[source.strength]}>{strengthLabel[source.strength]}</Badge>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">{source.summary}</p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              {source.status} · {sourceTypeLabel[source.sourceType]}
            </span>
            <span className="flex items-center gap-0.5">
              {source.timestamp}
              <ChevronRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
