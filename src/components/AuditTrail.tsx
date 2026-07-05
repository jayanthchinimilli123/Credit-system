import { Bot, User, Cog, ShieldCheck, Users } from "lucide-react";
import type { ActorType, AuditEvent } from "@/types";
import { actorLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";

const actorIcon: Record<ActorType, typeof Bot> = {
  ai_agent: Bot,
  credit_manager: User,
  credit_analyst: Users,
  system: Cog,
  compliance_reviewer: ShieldCheck,
};

const actorTone: Record<ActorType, string> = {
  ai_agent: "bg-brand-50 text-brand-600 ring-brand-200",
  credit_manager: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  credit_analyst: "bg-sky-50 text-sky-600 ring-sky-200",
  system: "bg-slate-100 text-slate-500 ring-slate-200",
  compliance_reviewer: "bg-violet-50 text-violet-600 ring-violet-200",
};

export function AuditTrail({
  events,
  dense = false,
}: {
  events: AuditEvent[];
  dense?: boolean;
}) {
  return (
    <ol className="relative space-y-0">
      {events.map((e, i) => {
        const Icon = actorIcon[e.actorType];
        const last = i === events.length - 1;
        return (
          <li key={e.id} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && (
              <span
                className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-slate-200"
                aria-hidden
              />
            )}
            <span
              className={cn(
                "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1",
                actorTone[e.actorType],
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="text-sm font-medium text-slate-800">{e.actor}</span>
                <span className="text-[11px] text-slate-400">
                  {actorLabel[e.actorType]}
                </span>
                <span className="text-[11px] text-slate-300">·</span>
                <span className="text-[11px] text-slate-400">{e.timestamp}</span>
              </div>
              <p className={cn("text-slate-600", dense ? "text-xs" : "text-sm", "mt-0.5")}>
                {e.action}
              </p>
              {e.note && (
                <p className="mt-1.5 rounded-md bg-slate-50 px-2.5 py-1.5 text-xs italic text-slate-600">
                  “{e.note}”
                </p>
              )}
              {e.statusChange && (
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  Status → {e.statusChange}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
