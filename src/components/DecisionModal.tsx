import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import type {
  CustomerApplication,
  DecisionType,
  ReasonCode,
  Recommendation,
} from "@/types";
import { decisionTypeLabel, reasonCodeLabel } from "@/lib/labels";
import { currency } from "@/lib/format";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { FieldGroup, Input, Select, Textarea } from "./ui/Field";
import { Badge } from "./ui/Badge";

export interface DecisionFormResult {
  decisionType: DecisionType;
  approvedLimit: number | null;
  reasonCode: ReasonCode;
  note: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  app: CustomerApplication;
  recommendation: Recommendation;
  presetDecision: DecisionType;
  onSubmit: (result: DecisionFormResult) => Promise<void>;
}

const reasonCodes: ReasonCode[] = [
  "strong_payment_history",
  "limit_too_high",
  "missing_documents",
  "high_past_due_balance",
  "policy_exception",
  "strategic_account",
  "manual_override",
  "senior_approval_required",
];

function usesLimit(d: DecisionType): boolean {
  return (
    d === "approved_as_recommended" ||
    d === "approved_with_edited_limit" ||
    d === "overrode_recommendation" ||
    d === "escalated"
  );
}

function isLimitEditable(d: DecisionType): boolean {
  return d === "approved_with_edited_limit" || d === "overrode_recommendation";
}

function defaultReason(d: DecisionType): ReasonCode {
  switch (d) {
    case "approved_as_recommended":
      return "strong_payment_history";
    case "approved_with_edited_limit":
      return "limit_too_high";
    case "declined":
      return "high_past_due_balance";
    case "overrode_recommendation":
      return "manual_override";
    case "escalated":
      return "senior_approval_required";
    case "requested_more_information":
      return "missing_documents";
  }
}

export function DecisionModal({
  open,
  onClose,
  app,
  recommendation,
  presetDecision,
  onSubmit,
}: Props) {
  const [decisionType, setDecisionType] = useState<DecisionType>(presetDecision);
  const [approvedLimit, setApprovedLimit] = useState<string>("");
  const [reasonCode, setReasonCode] = useState<ReasonCode>(defaultReason(presetDecision));
  const [note, setNote] = useState("");
  const [confirmOverride, setConfirmOverride] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setDecisionType(presetDecision);
    setReasonCode(defaultReason(presetDecision));
    setNote("");
    setConfirmOverride(false);
    setSubmitError(null);
    setSubmitting(false);
    const seed =
      presetDecision === "declined" || presetDecision === "requested_more_information"
        ? null
        : (recommendation.suggestedLimit ?? recommendation.requestedLimit);
    setApprovedLimit(seed != null ? String(seed) : "");
  }, [open, presetDecision, recommendation]);

  const isOverride = decisionType === "overrode_recommendation";
  const requiresNote = isOverride || decisionType === "declined";
  const limitNumber = approvedLimit ? Number(approvedLimit.replace(/[^0-9.]/g, "")) : null;

  const errors = useMemo(() => {
    const e: string[] = [];
    if (usesLimit(decisionType) && isLimitEditable(decisionType)) {
      if (limitNumber == null || Number.isNaN(limitNumber) || limitNumber <= 0)
        e.push("Enter a valid approved limit.");
    }
    if (requiresNote && note.trim().length < 3)
      e.push("A decision note is required for this action.");
    if (isOverride && !confirmOverride)
      e.push("Confirm that you are overriding the AI recommendation.");
    return e;
  }, [decisionType, limitNumber, requiresNote, note, isOverride, confirmOverride]);

  const canSubmit = errors.length === 0 && !submitting;

  async function handleSubmit() {
    if (errors.length > 0 || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit({
        decisionType,
        approvedLimit: usesLimit(decisionType) ? limitNumber : null,
        reasonCode,
        note: note.trim(),
      });
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Failed to submit decision.");
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={submitting ? () => {} : onClose}
      title="Human decision"
      description={`Review and confirm your decision for ${app.customerName}.`}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Submitting…" : "Confirm decision"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <FieldGroup label="Decision type" htmlFor="decisionType">
          <Select
            id="decisionType"
            value={decisionType}
            disabled={submitting}
            onChange={(e) => {
              const next = e.target.value as DecisionType;
              setDecisionType(next);
              setReasonCode(defaultReason(next));
            }}
          >
            {(Object.keys(decisionTypeLabel) as DecisionType[]).map((d) => (
              <option key={d} value={d}>
                {decisionTypeLabel[d]}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3.5">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              AI suggested limit
            </div>
            <div className="mt-0.5 text-sm font-semibold text-slate-700">
              {currency(recommendation.suggestedLimit)}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
              Requested limit
            </div>
            <div className="mt-0.5 text-sm font-semibold text-slate-700">
              {currency(recommendation.requestedLimit)}
            </div>
          </div>
        </div>

        {usesLimit(decisionType) && (
          <FieldGroup
            label={isLimitEditable(decisionType) ? "Your approved limit" : "Approved limit"}
            htmlFor="approvedLimit"
            hint={
              isLimitEditable(decisionType)
                ? "Adjust the credit limit you are approving."
                : "Matches the AI-suggested limit."
            }
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                $
              </span>
              <Input
                id="approvedLimit"
                inputMode="numeric"
                className="pl-6"
                value={approvedLimit}
                disabled={!isLimitEditable(decisionType) || submitting}
                onChange={(e) => setApprovedLimit(e.target.value)}
              />
            </div>
          </FieldGroup>
        )}

        <FieldGroup label="Reason code" htmlFor="reasonCode">
          <Select
            id="reasonCode"
            value={reasonCode}
            disabled={submitting}
            onChange={(e) => setReasonCode(e.target.value as ReasonCode)}
          >
            {reasonCodes.map((r) => (
              <option key={r} value={r}>
                {reasonCodeLabel[r]}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup
          label={`Decision note${requiresNote ? " (required)" : " (optional)"}`}
          htmlFor="note"
        >
          <Textarea
            id="note"
            placeholder="Add context for audit and compliance…"
            value={note}
            disabled={submitting}
            onChange={(e) => setNote(e.target.value)}
          />
        </FieldGroup>

        {isOverride && (
          <label className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/70 p-3.5">
            <input
              type="checkbox"
              className="focus-ring mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600"
              checked={confirmOverride}
              disabled={submitting}
              onChange={(e) => setConfirmOverride(e.target.checked)}
            />
            <span className="text-sm text-amber-800">
              I confirm I am overriding the AI recommendation and take responsibility for
              this credit decision.
            </span>
          </label>
        )}

        {(errors.length > 0 || submitError) && (
          <div
            className="flex items-start gap-2 rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700"
            role="alert"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <ul className="space-y-0.5">
              {submitError && <li>{submitError}</li>}
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Badge tone="bg-slate-100 text-slate-500 ring-slate-500/20">Audit</Badge>
          This decision will be saved to the database and logged to the audit trail with
          your name and timestamp.
        </div>
      </div>
    </Modal>
  );
}
