import type { VercelRequest, VercelResponse } from "@vercel/node";

// Zero-dependency diagnostic: if this works but /api/health doesn't, the issue
// is the DB import or connection. Reports DB-related env var NAMES only.
export default function handler(_req: VercelRequest, res: VercelResponse) {
  const dbEnvKeys = Object.keys(process.env)
    .filter((k) => /postgres|database|neon|^pg/i.test(k))
    .sort();
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(
    JSON.stringify({
      ok: true,
      ping: "pong",
      node: process.version,
      dbEnvKeys,
    }),
  );
}
