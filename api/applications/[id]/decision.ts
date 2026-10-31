import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { DecisionType, ReasonCode } from "../../../src/types";
import { sendJson } from "../../_lib/db.js";
import { submitDecision } from "../../_lib/repo.js";

const DECISION_TYPES: DecisionType[] = [
  "approved_as_recommended",
  "approved_with_edited_limit",
  "declined",
  "overrode_recommendation",
  "escalated",
  "requested_more_information",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    if (!id) return sendJson(res, 400, { error: "Missing application id" });

    const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) ?? {};
    const decisionType = body.decisionType as DecisionType;
    if (!DECISION_TYPES.includes(decisionType))
      return sendJson(res, 400, { error: "Invalid decisionType" });

    const requiresNote =
      decisionType === "overrode_recommendation" || decisionType === "declined";
    if (requiresNote && (!body.note || String(body.note).trim().length < 3))
      return sendJson(res, 400, { error: "A decision note is required for this action" });

    const approvedLimit =
      body.approvedLimit === null || body.approvedLimit === undefined
        ? null
        : Number(body.approvedLimit);
    if (approvedLimit !== null && (Number.isNaN(approvedLimit) || approvedLimit < 0))
      return sendJson(res, 400, { error: "Invalid approvedLimit" });

    const bundle = await submitDecision(id, {
      decisionType,
      approvedLimit,
      reasonCode: (body.reasonCode as ReasonCode) ?? "manual_override",
      note: body.note ? String(body.note).trim() : "",
      reviewer: body.reviewer ? String(body.reviewer) : "Credit Manager",
    });

    if (!bundle) return sendJson(res, 404, { error: "Application not found" });
    return sendJson(res, 200, bundle);
  } catch (e) {
    console.error("[decision]", e);
    return sendJson(res, 500, { error: "Failed to submit decision" });
  }
}
