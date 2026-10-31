import { Search, Bell, Menu, Sparkles } from "lucide-react";
import { CURRENT_USER } from "@/data/currentUser";
import { Button } from "./ui/Button";

export function Topbar({
  children,
  onMenuClick,
  onRequestDemo,
}: {
  children?: React.ReactNode;
  onMenuClick?: () => void;
  onRequestDemo?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenuClick}
        className="focus-ring -ml-1 rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">{children}</div>

      <div className="hidden items-center md:flex">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            aria-label="Search customers and ERP IDs"
            placeholder="Search customers, ERP IDs…"
            className="focus-ring h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:border-brand-500 focus-visible:bg-white"
          />
        </div>
      </div>

      {onRequestDemo && (
        <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={onRequestDemo}>
          <Sparkles className="h-3.5 w-3.5 text-brand-500" />
          Request demo
        </Button>
      )}

      <button
        className="focus-ring relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
      </button>

      <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3 sm:pl-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
          {CURRENT_USER.initials}
        </div>
        <div className="hidden leading-tight sm:block">
          <div className="text-sm font-medium text-slate-900">{CURRENT_USER.name}</div>
          <div className="text-[11px] text-slate-400">{CURRENT_USER.role}</div>
        </div>
      </div>
    </header>
  );
}
