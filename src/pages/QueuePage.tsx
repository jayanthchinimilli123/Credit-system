import { AlertCircle, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ApplicationsQueue } from "@/components/ApplicationsQueue";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/Button";
import { QueueSkeleton } from "@/components/LoadingState";
import { useAppStore } from "@/store/AppStore";

export function QueuePage() {
  const { applications, loading, error, reload } = useAppStore();

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
      {loading ? (
        <QueueSkeleton />
      ) : error ? (
        <EmptyState
          icon={AlertCircle}
          title="Couldn't load applications"
          description={error}
          action={
            <Button size="sm" onClick={() => void reload()}>
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          }
        />
      ) : (
        <ApplicationsQueue apps={applications} />
      )}
    </AppShell>
  );
}
