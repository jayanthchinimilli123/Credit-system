import type { VercelRequest, VercelResponse } from "@vercel/node";
import { dbEnvPresence, ensureReady, sendJson, sql } from "./_lib/db.js";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const env = dbEnvPresence();
  try {
    await ensureReady();
    const rows = (await sql`SELECT count(*)::int AS count FROM applications`) as {
      count: number;
    }[];
    return sendJson(res, 200, {
      ok: true,
      database: "connected",
      applications: rows[0]?.count ?? 0,
      env,
    });
  } catch (e) {
    console.error("[health]", e);
    return sendJson(res, 500, {
      ok: false,
      database: "error",
      message: e instanceof Error ? e.message : "unknown",
      env,
    });
  }
}
