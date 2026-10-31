import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendJson } from "../../_lib/db";
import { getBundle } from "../../_lib/repo";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" });
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    if (!id) return sendJson(res, 400, { error: "Missing application id" });

    const bundle = await getBundle(id);
    if (!bundle) return sendJson(res, 404, { error: "Application not found" });
    return sendJson(res, 200, bundle);
  } catch (e) {
    console.error("[application:id]", e);
    return sendJson(res, 500, { error: "Failed to load application" });
  }
}
