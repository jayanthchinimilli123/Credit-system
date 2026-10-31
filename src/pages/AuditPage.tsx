import { Link, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle, ScrollText, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AuditTrail } from "@/components/AuditTrail";
import { EmptyState } from "@/components/EmptyState";
import { ProfileSkeleton } from "@/components/LoadingState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusBadge } from "@/components/StatusBadge";
import { useApplicationBundle } from "@/hooks/useApplicationBundle";

export function AuditPage() {
  const { id = "" } = useParams();
  const { bundle, loading, error, reload } = useApplicationBundle(id);

  const header = (
    <div className="flex items-center gap-3">
      <Link
        to={`/app/applications/${id}`}
        className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        aria-label="Back to profile"
      >
        <ArrowLeft className="h-4.5 w-4.5" />
      </Link>
      <div>
        <h1 className="text-lg font-semibold text-slate-900">Audit Trail</h1>
        <p className="text-sm text-slate-500">{bundle?.application.customerName ?? id}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AppShell header={header}>
        <ProfileSkeleton />
      </AppShell>
    );
  }

  if (error || !bundle) {
    return (
      <AppShell header={header}>
        <EmptyState
          icon={AlertCircle}
          title={error ? "Couldn't load the audit trail" : "Application not found"}
          description={error ?? undefined}
          action={
            <div className="flex gap-2">
              {error && (
                <Button size="sm" onClick={() => void reload()}>
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retry
                </Button>
              )}
              <LinkButton to="/app" size="sm" variant={error ? "outline" : "primary"}>
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to queue
              </LinkButton>
            </div>
          }
        />
      </AppShell>
    );
  }

  const { application: app, audit } = bundle;

  return (
    <AppShell header={header}>
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-card">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <ScrollText className="h-4 w-4 text-slate-400" />
            Every AI and human action is recorded for compliance.
          </div>
          <StatusBadge status={app.status} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Decision history</CardTitle>
            <span className="text-xs text-slate-400">{audit.length} events</span>
          </CardHeader>
          <CardContent>
            <AuditTrail events={audit} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
