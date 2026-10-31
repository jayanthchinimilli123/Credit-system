import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendJson } from "./_lib/db";
import { listPolicyRules } from "./_lib/repo";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" });
    const rules = await listPolicyRules();
    return sendJson(res, 200, { rules });
  } catch (e) {
    console.error("[policy-rules]", e);
    return sendJson(res, 500, { error: "Failed to load policy rules" });
  }
}
