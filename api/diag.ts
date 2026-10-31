import type { VercelRequest, VercelResponse } from "@vercel/node";

// Dynamically import each suspect module in isolation so a load-time failure is
// reported as JSON instead of crashing the function. Pinpoints the bad import.
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const results: Record<string, string> = {};

  async function tryImport(label: string, fn: () => Promise<unknown>) {
    try {
      await fn();
      results[label] = "ok";
    } catch (e) {
      results[label] = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    }
  }

  await tryImport("neon-pkg", () => import("@neondatabase/serverless"));
  await tryImport("seed-data", () => import("./_lib/seed-data"));
  await tryImport("db", () => import("./_lib/db"));
  await tryImport("repo", () => import("./_lib/repo"));

  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify({ ok: true, results }, null, 2));
}
