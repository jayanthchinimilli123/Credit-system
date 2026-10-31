import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Gauge,
  ScrollText,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import type { DecisionType } from "@/types";
import { AppShell } from "@/components/AppShell";
import { ClientProfileHeader } from "@/components/ClientProfileHeader";
import { CustomerOverview } from "@/components/CustomerOverview";
import { AIRecommendationCard } from "@/components/AIRecommendationCard";
import { RiskSignalsPanel } from "@/components/RiskSignalsPanel";
import { SourceContextPanel } from "@/components/SourceContextPanel";
import { ConfidenceIndicator } from "@/components/ConfidenceIndicator";
import { DecisionModal, type DecisionFormResult } from "@/components/DecisionModal";
import { DecisionOutcomeBanner } from "@/components/DecisionOutcomeBanner";
import { AuditTrail } from "@/components/AuditTrail";
import { EmptyState } from "@/components/EmptyState";
import { ProfileSkeleton } from "@/components/LoadingState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { Badge } from "@/components/ui/Badge";
import { useApplicationBundle } from "@/hooks/useApplicationBundle";
import { useAppStore } from "@/store/AppStore";
import { api } from "@/lib/api";
import { CURRENT_USER } from "@/data/currentUser";

export function ProfilePage() {
  const { id = "" } = useParams();
  const { bundle, loading, error, reload, setBundle } = useApplicationBundle(id);
  const { applyApplication } = useAppStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [preset, setPreset] = useState<DecisionType>("approved_as_recommended");

  if (loading) {
    return (
      <AppShell header={<BackHeader title="Loading…" subtitle={id} />}>
        <ProfileSkeleton />
      </AppShell>
    );
  }

  if (error || !bundle || !bundle.recommendation) {
    return (
      <AppShell header={<BackHeader title="Application" subtitle={id} />}>
        <EmptyState
          icon={AlertCircle}
          title={error ? "Couldn't load this application" : "Application not found"}
          description={error ?? `We couldn't find an application with id "${id}".`}
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

  const { application: app, recommendation, signals, sources, audit, policies, decision } =
    bundle;
  const decided = app.status === "approved" || app.status === "declined";

  function openDecision(decisionType: DecisionType) {
    setPreset(decisionType);
    setModalOpen(true);
  }

  async function handleSubmit(result: DecisionFormResult) {
    const updated = await api.submitDecision(id, {
      ...result,
      reviewer: CURRENT_USER.name,
    });
    setBundle(updated);
    applyApplication(updated.application);
    setModalOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const missingItems = sources.filter((s) => /missing|pending|partially/i.test(s.status));

  return (
    <AppShell
      header={<BackHeader title={app.customerName} subtitle={`Client credit profile · ${app.id}`} />}
    >
      <div className="space-y-5">
        <ClientProfileHeader app={app} finalLimit={decision?.approvedLimit ?? null} />

        {decided && decision && (
          <DecisionOutcomeBanner app={app} recommendation={recommendation} decision={decision} />
        )}

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <CustomerOverview app={app} />
            <AIRecommendationCard
              recommendation={recommendation}
              decided={decided}
              onSelectAction={openDecision}
            />
            <RiskSignalsPanel signals={signals} />

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ScrollText className="h-4 w-4 text-slate-400" />
                  <CardTitle>Recent Activity</CardTitle>
                </div>
                <Link
                  to={`/app/applications/${app.id}/audit`}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  View full audit trail →
                </Link>
              </CardHeader>
              <CardContent>
                <AuditTrail events={audit.slice(-4)} dense />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-5 lg:sticky lg:top-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-slate-400" />
                    <CardTitle>AI Confidence</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ConfidenceIndicator value={recommendation.confidence} />
                  <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                    Confidence reflects data completeness and signal agreement. It is paired
                    with reasoning and always requires human review.
                  </div>
                </CardContent>
              </Card>

              <SourceContextPanel sources={sources} />

              {missingItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <CardTitle>Missing Information</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {missingItems.map((m) => (
                      <div key={m.id} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                        <span>
                          <span className="font-medium text-slate-800">{m.sourceName}:</span>{" "}
                          {m.summary}
                        </span>
                      </div>
                    ))}
                    <p className="mt-1 rounded-md bg-amber-50 px-2.5 py-1.5 text-xs text-amber-700">
                      Missing information blocks final approval under policy.
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                    <CardTitle>Policy Rule Matches</CardTitle>
                  </div>
                  <Badge tone="bg-slate-100 text-slate-600 ring-slate-500/20">
                    {policies.length}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {policies.length === 0 ? (
                    <p className="text-sm text-slate-500">No special policy rules triggered.</p>
                  ) : (
                    policies.map((p) => (
                      <div key={p.id} className="flex items-start gap-2 text-sm">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                        <div>
                          <div className="font-medium text-slate-800">{p.title}</div>
                          <div className="text-xs text-slate-500">Requires {p.requiresRole}</div>
                        </div>
                      </div>
                    ))
                  )}
                  <Link
                    to="/app/policy-rules"
                    className="mt-1 inline-block text-xs font-medium text-brand-600 hover:text-brand-700"
                  >
                    View all policy rules →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <DecisionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        app={app}
        recommendation={recommendation}
        presetDecision={preset}
        onSubmit={handleSubmit}
      />
    </AppShell>
  );
}

function BackHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <Link
        to="/app"
        className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        aria-label="Back to queue"
      >
        <ArrowLeft className="h-4.5 w-4.5" />
      </Link>
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}
