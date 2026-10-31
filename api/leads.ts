import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendJson } from "./_lib/db.js";
import { createLead } from "./_lib/repo.js";

// Minimal email sanity check (not RFC-perfect - just guards obvious junk).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });

    const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) ?? {};
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();

    if (name.length < 2) return sendJson(res, 400, { error: "Please enter your name." });
    if (!EMAIL_RE.test(email))
      return sendJson(res, 400, { error: "Please enter a valid email address." });

    const { id } = await createLead({
      name,
      email,
      company: body.company ? String(body.company).trim() : undefined,
      role: body.role ? String(body.role).trim() : undefined,
      teamSize: body.teamSize ? String(body.teamSize).trim() : undefined,
      message: body.message ? String(body.message).trim() : undefined,
    });

    return sendJson(res, 201, { ok: true, id });
  } catch (e) {
    console.error("[leads]", e);
    return sendJson(res, 500, { error: "Failed to submit. Please try again." });
  }
}
