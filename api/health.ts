import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ensureReady, sendJson, sql } from "./_lib/db";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    await ensureReady();
    const rows = (await sql`SELECT count(*)::int AS count FROM applications`) as {
      count: number;
    }[];
    return sendJson(res, 200, {
      ok: true,
      database: "connected",
      applications: rows[0]?.count ?? 0,
    });
  } catch (e) {
    console.error("[health]", e);
    return sendJson(res, 500, {
      ok: false,
      database: "error",
      message: e instanceof Error ? e.message : "unknown",
    });
  }
}
