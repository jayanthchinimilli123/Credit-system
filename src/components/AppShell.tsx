import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { Sidebar, SidebarContent } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Modal } from "./ui/Modal";
import { LeadForm } from "./LeadForm";

interface Props {
  header?: ReactNode;
  children: ReactNode;
}

export function AppShell({ header, children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);

  // Close the mobile drawer on Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <a
        href="#main-content"
        className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-700 focus:shadow-panel"
      >
        Skip to main content
      </a>

      <Sidebar />

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-fade-in"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <div
            className="absolute left-0 top-0 h-full w-64 border-r border-slate-200 shadow-panel animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <button
              onClick={() => setDrawerOpen(false)}
              className="focus-ring absolute right-2 top-4 rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setDrawerOpen(true)} onRequestDemo={() => setLeadOpen(true)}>
          {header}
        </Topbar>
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">{children}</div>
        </main>
      </div>

      <Modal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        title="Request a demo"
        description="Tell us about your team and we'll be in touch."
        size="lg"
      >
        <LeadForm />
      </Modal>
    </div>
  );
}
