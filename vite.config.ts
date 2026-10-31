import { defineConfig, loadEnv, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";

// ---------------------------------------------------------------------------
// Dev-only plugin: run the real /api serverless handlers under `vite dev`.
// Vite normally serves the raw .ts source for /api requests; this intercepts
// them, loads the actual handler, and invokes it with a Vercel-like req/res.
// Needs DATABASE_URL in .env.local (your Neon connection string).
// This plugin is a no-op in production builds.
// ---------------------------------------------------------------------------
function devApiPlugin(): PluginOption {
  function resolveHandler(pathname: string): { file: string; id?: string } | null {
    const parts = pathname.replace(/^\/api\/?/, "").replace(/\/$/, "").split("/").filter(Boolean);
    if (parts[0] === "health") return { file: "/api/health.ts" };
    if (parts[0] === "policy-rules") return { file: "/api/policy-rules.ts" };
    if (parts[0] === "leads") return { file: "/api/leads.ts" };
    if (parts[0] === "applications") {
      if (parts.length === 1) return { file: "/api/applications/index.ts" };
      if (parts.length === 2) return { file: "/api/applications/[id]/index.ts", id: parts[1] };
      if (parts.length === 3 && parts[2] === "decision")
        return { file: "/api/applications/[id]/decision.ts", id: parts[1] };
    }
    return null;
  }

  return {
    name: "creditflow-dev-api",
    // Make DATABASE_URL (and friends) from .env.local visible to the handlers.
    config(_config, { mode }) {
      const env = loadEnv(mode, process.cwd(), "");
      for (const key of ["DATABASE_URL", "POSTGRES_URL", "POSTGRES_PRISMA_URL"]) {
        if (env[key] && !process.env[key]) process.env[key] = env[key];
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const url = req.url || "";
        if (!url.startsWith("/api/") && url !== "/api") return next();

        const pathname = new URL(url, "http://localhost").pathname;
        const route = resolveHandler(pathname);
        if (!route) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Not found" }));
          return;
        }

        // Collect the request body.
        let body: unknown = {};
        if (req.method === "POST" || req.method === "PUT") {
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const raw = Buffer.concat(chunks).toString();
          try {
            body = raw ? JSON.parse(raw) : {};
          } catch {
            body = {};
          }
        }

        const query: Record<string, string> = {};
        new URL(url, "http://localhost").searchParams.forEach((v, k) => (query[k] = v));
        if (route.id) query.id = route.id;

        const reqShim = { method: req.method, headers: req.headers, query, body };
        const resShim = {
          _status: 200,
          setHeader: (k: string, v: string) => res.setHeader(k, v),
          status(code: number) {
            this._status = code;
            return this;
          },
          send(payload: unknown) {
            res.statusCode = this._status;
            res.end(typeof payload === "string" ? payload : JSON.stringify(payload));
          },
          json(payload: unknown) {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = this._status;
            res.end(JSON.stringify(payload));
          },
          end(payload?: unknown) {
            res.statusCode = this._status;
            res.end(payload as string | undefined);
          },
        };

        try {
          const mod = await server.ssrLoadModule(route.file);
          await mod.default(reqShim, resShim);
        } catch (e) {
          server.config.logger.error(`[dev-api] ${route.file}: ${(e as Error).message}`);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error:
                "Dev API error. Is DATABASE_URL set in .env.local? " +
                (e as Error).message,
            }),
          );
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), devApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
