import { AppShell } from "@/components/AppShell";
import { ApplicationsQueue } from "@/components/ApplicationsQueue";
import { useAppStore } from "@/store/AppStore";

export function QueuePage() {
  const { applications } = useAppStore();

  return (
    <AppShell
      header={
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Applications Queue</h1>
          <p className="text-sm text-slate-500">
            Customer credit applications awaiting your review.
          </p>
        </div>
      }
    >
      <ApplicationsQueue apps={applications} />
    </AppShell>
  );
}
