import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendJson } from "../_lib/db";
import { listApplications } from "../_lib/repo";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" });
    const applications = await listApplications();
    return sendJson(res, 200, { applications });
  } catch (e) {
    console.error("[applications]", e);
    return sendJson(res, 500, { error: "Failed to load applications" });
  }
}
