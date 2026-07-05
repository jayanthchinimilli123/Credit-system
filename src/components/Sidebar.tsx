import { NavLink } from "react-router-dom";
import {
  ClipboardList,
  ScrollText,
  ShieldCheck,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/AppStore";

const nav = [
  { to: "/", label: "Applications Queue", icon: ClipboardList, end: true },
  { to: "/policy-rules", label: "Policy Rules", icon: ShieldCheck, end: false },
];

export function Sidebar() {
  const { applications } = useAppStore();
  const pending = applications.filter(
    (a) => a.status === "needs_review" || a.status === "recommendation_ready",
  ).length;

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <LayoutGrid className="h-4.5 w-4.5" strokeWidth={2.2} />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-slate-900">CreditFlow AI</div>
          <div className="text-[11px] text-slate-400">Credit Risk Review</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Workspace
        </p>
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )
            }
          >
            <span className="flex items-center gap-2.5">
              <item.icon className="h-4 w-4" />
              {item.label}
            </span>
            {item.to === "/" && pending > 0 && (
              <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {pending}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <div className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-3">
          <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p className="text-[11px] leading-relaxed text-slate-500">
            AI assists the credit decision. The credit manager stays in control of
            the final call.
          </p>
        </div>
      </div>
    </aside>
  );
}
