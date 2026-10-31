import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  ArrowUpCircle,
  FileQuestion,
  Copy,
  Check,
  ScrollText,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import type { CustomerApplication, HumanDecision, Recommendation } from "@/types";
import { decisionTypeLabel, reasonCodeLabel } from "@/lib/labels";
import { currency } from "@/lib/format";
import { Button } from "./ui/Button";
import { LinkButton } from "./ui/LinkButton";
import { cn } from "@/lib/utils";

interface Props {
  app: CustomerApplication;
  recommendation: Recommendation;
  decision: HumanDecision;
}

function outcomeVisual(app: CustomerApplication) {
  switch (app.status) {
    case "approved":
      return { Icon: CheckCircle2, ring: "bg-emerald-100 text-emerald-600", label: "Approved" };
    case "declined":
      return { Icon: XCircle, ring: "bg-rose-100 text-rose-600", label: "Declined" };
    case "escalated":
      return { Icon: ArrowUpCircle, ring: "bg-violet-100 text-violet-600", label: "Escalated" };
    default:
      return { Icon: FileQuestion, ring: "bg-slate-100 text-slate-500", label: "Pending information" };
  }
}

function nextStep(app: CustomerApplication): string {
  switch (app.status) {
    case "approved":
      return "Notify Sales · Sync approved limit to ERP";
    case "declined":
      return "Notify Sales · Record declination reason";
    case "escalated":
      return "Awaiting senior reviewer approval";
    default:
      return "Awaiting requested documents from customer";
  }
}

export function DecisionOutcomeBanner({ app, recommendation, decision }: Props) {
  const [copied, setCopied] = useState(false);
  const v = outcomeVisual(app);

  const summary = [
    `CreditFlow AI Decision Summary`,
    `Customer: ${app.customerName} (${app.erpAccountId})`,
    `Decision: ${decisionTypeLabel[decision.decisionType]}`,
    `Final approved limit: ${currency(decision.approvedLimit)}`,
    `AI recommended limit: ${currency(recommendation.suggestedLimit)}`,
    `Reviewer: ${decision.reviewer}`,
    `Reason: ${reasonCodeLabel[decision.reasonCode]}`,
    `Status: ${v.label}`,
    decision.note ? `Note: ${decision.note}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
      <div className="flex items-start gap-4 border-b border-slate-100 p-5">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-full", v.ring)}>
          <v.Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-slate-900">
            Decision: {decisionTypeLabel[decision.decisionType]}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Recorded by {decision.reviewer} · {decision.decidedAt}
          </p>
        </div>
      </div>

      <div className="grid gap-px bg-slate-100 sm:grid-cols-3">
        <Cell label="Final approved limit" value={currency(decision.approvedLimit)} emphasis />
        <Cell label="AI recommended limit" value={currency(recommendation.suggestedLimit)} />
        <Cell label="Reason" value={reasonCodeLabel[decision.reasonCode]} />
      </div>

      {decision.note && (
        <div className="border-t border-slate-100 px-5 py-3.5">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">Decision note</div>
          <p className="mt-1 text-sm italic text-slate-600">“{decision.note}”</p>
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 text-sm">
        <RefreshCw className="h-4 w-4 text-slate-400" />
        <span className="text-slate-500">Next step:</span>
        <span className="font-medium text-slate-700">{nextStep(app)}</span>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-slate-100 px-5 py-4">
        <LinkButton to="/app" variant="outline" size="sm">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to queue
        </LinkButton>
        <LinkButton to={`/app/applications/${app.id}/audit`} variant="outline" size="sm">
          <ScrollText className="h-3.5 w-3.5" />
          View audit trail
        </LinkButton>
        <Button variant="outline" size="sm" onClick={copy}>
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy decision summary"}
        </Button>
        <Button variant="subtle" size="sm" disabled title="Placeholder: no real ERP in this prototype">
          <RefreshCw className="h-3.5 w-3.5" />
          Sync to ERP
        </Button>
      </div>
    </div>
  );
}

function Cell({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="bg-white px-5 py-3.5">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      <div
        className={cn(
          "mt-1 text-base font-semibold",
          emphasis ? "text-emerald-700" : "text-slate-900",
        )}
      >
        {value}
      </div>
    </div>
  );
}
