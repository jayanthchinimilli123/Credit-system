import { Link, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle, ScrollText } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AuditTrail } from "@/components/AuditTrail";
import { EmptyState } from "@/components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppStore } from "@/store/AppStore";

export function AuditPage() {
  const { id = "" } = useParams();
  const { getApplication, getAudit } = useAppStore();
  const app = getApplication(id);
  const events = getAudit(id);

  if (!app) {
    return (
      <AppShell>
        <EmptyState
          icon={AlertCircle}
          title="Application not found"
          action={
            <LinkButton to="/" size="sm">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to queue
            </LinkButton>
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell
      header={
        <div className="flex items-center gap-3">
          <Link
            to={`/applications/${app.id}`}
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Back to profile"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Audit Trail</h1>
            <p className="text-sm text-slate-500">
              {app.customerName} · {app.id}
            </p>
          </div>
        </div>
      }
    >
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
            <span className="text-xs text-slate-400">{events.length} events</span>
          </CardHeader>
          <CardContent>
            <AuditTrail events={events} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
