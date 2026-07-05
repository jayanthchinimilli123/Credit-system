import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type {
  ApplicationStatus,
  AuditEvent,
  CustomerApplication,
  DecisionType,
  HumanDecision,
  Recommendation,
  RecommendationStatus,
} from "@/types";
import { applications as baseApplications } from "@/data/applications";
import { recommendations as baseRecommendations } from "@/data/recommendations";
import { auditEvents as baseAudit } from "@/data/auditEvents";
import { actorLabel, decisionTypeLabel } from "@/lib/labels";
import { currency, makeId, nowClockLabel } from "@/lib/format";
import { CURRENT_USER } from "@/data/currentUser";

// ---------------------------------------------------------------------------
// The store overlays human-decision outcomes on top of the immutable mock data
// so the base fixtures stay pristine and the overlay stays serializable.
// ---------------------------------------------------------------------------

interface Overlay {
  appStatus: Record<string, ApplicationStatus>;
  appFinalLimit: Record<string, number | null>;
  recStatus: Record<string, RecommendationStatus>;
  auditExtra: Record<string, AuditEvent[]>;
  decisions: Record<string, HumanDecision>;
}

const emptyOverlay: Overlay = {
  appStatus: {},
  appFinalLimit: {},
  recStatus: {},
  auditExtra: {},
  decisions: {},
};

const STORAGE_KEY = "creditflow.overlay.v1";

type Action =
  | { type: "SUBMIT_DECISION"; decision: HumanDecision }
  | { type: "RESET" }
  | { type: "HYDRATE"; overlay: Overlay };

// Map a human decision to the resulting application + recommendation status.
function resolveStatuses(decision: HumanDecision): {
  app: ApplicationStatus;
  rec: RecommendationStatus;
} {
  switch (decision.decisionType) {
    case "approved_as_recommended":
      return { app: "approved", rec: "accepted" };
    case "approved_with_edited_limit":
      return { app: "approved", rec: "edited" };
    case "declined":
      return { app: "declined", rec: "declined" };
    case "overrode_recommendation":
      // An override can go either way; a positive approved limit means approve.
      return {
        app: (decision.approvedLimit ?? 0) > 0 ? "approved" : "declined",
        rec: "overridden",
      };
    case "escalated":
      return { app: "escalated", rec: "escalated" };
    case "requested_more_information":
      return { app: "missing_information", rec: "more_info_requested" };
  }
}

function buildAuditForDecision(decision: HumanDecision): AuditEvent[] {
  const { app } = resolveStatuses(decision);
  const events: AuditEvent[] = [];
  const clock = nowClockLabel();

  events.push({
    id: makeId("aud"),
    applicationId: decision.applicationId,
    timestamp: `Today, ${clock}`,
    actor: decision.reviewer,
    actorType: "credit_manager",
    action:
      decision.approvedLimit != null &&
      (decision.decisionType === "approved_with_edited_limit" ||
        decision.decisionType === "overrode_recommendation")
        ? `Credit Manager set approved limit to ${currency(decision.approvedLimit)}`
        : `Credit Manager selected: ${decisionTypeLabel[decision.decisionType]}`,
  });

  events.push({
    id: makeId("aud"),
    applicationId: decision.applicationId,
    timestamp: `Today, ${clock}`,
    actor: decision.reviewer,
    actorType: "credit_manager",
    action: "Decision submitted",
    note: decision.note || undefined,
    statusChange: humanReadableStatus(app),
  });

  return events;
}

function humanReadableStatus(status: ApplicationStatus): string {
  const map: Record<ApplicationStatus, string> = {
    needs_review: "Needs review",
    recommendation_ready: "AI recommendation ready",
    missing_information: "Missing information",
    escalated: "Escalated",
    approved: "Approved",
    declined: "Declined",
  };
  return map[status];
}

function reducer(state: Overlay, action: Action): Overlay {
  switch (action.type) {
    case "HYDRATE":
      return action.overlay;
    case "RESET":
      return emptyOverlay;
    case "SUBMIT_DECISION": {
      const d = action.decision;
      const { app, rec } = resolveStatuses(d);
      const prior = state.auditExtra[d.applicationId] ?? [];
      return {
        appStatus: { ...state.appStatus, [d.applicationId]: app },
        appFinalLimit: { ...state.appFinalLimit, [d.applicationId]: d.approvedLimit },
        recStatus: { ...state.recStatus, [d.applicationId]: rec },
        auditExtra: {
          ...state.auditExtra,
          [d.applicationId]: [...prior, ...buildAuditForDecision(d)],
        },
        decisions: { ...state.decisions, [d.applicationId]: d },
      };
    }
    default:
      return state;
  }
}

export interface SubmitDecisionInput {
  applicationId: string;
  decisionType: DecisionType;
  approvedLimit: number | null;
  reasonCode: HumanDecision["reasonCode"];
  note: string;
}

interface AppStoreValue {
  applications: CustomerApplication[];
  getApplication: (id: string) => CustomerApplication | undefined;
  getRecommendation: (applicationId: string) => Recommendation | undefined;
  getAudit: (applicationId: string) => AuditEvent[];
  getDecision: (applicationId: string) => HumanDecision | undefined;
  getFinalLimit: (applicationId: string) => number | null | undefined;
  submitDecision: (input: SubmitDecisionInput) => HumanDecision;
  reset: () => void;
  decidedCount: number;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

function loadOverlay(): Overlay {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyOverlay;
    return { ...emptyOverlay, ...(JSON.parse(raw) as Overlay) };
  } catch {
    return emptyOverlay;
  }
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [overlay, dispatch] = useReducer(reducer, emptyOverlay);

  // Hydrate from localStorage once on mount (client-only prototype persistence).
  useEffect(() => {
    dispatch({ type: "HYDRATE", overlay: loadOverlay() });
  }, []);

  // Persist overlay whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overlay));
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [overlay]);

  const applications = useMemo<CustomerApplication[]>(
    () =>
      baseApplications.map((a) => {
        const status = overlay.appStatus[a.id] ?? a.status;
        const finalLimit = overlay.appFinalLimit[a.id];
        return {
          ...a,
          status,
          // Reflect a decided limit in the suggested-limit surface for the queue.
          suggestedCreditLimit:
            finalLimit !== undefined ? finalLimit : a.suggestedCreditLimit,
        };
      }),
    [overlay],
  );

  const getApplication = useCallback(
    (id: string) => applications.find((a) => a.id === id),
    [applications],
  );

  const getRecommendation = useCallback(
    (applicationId: string): Recommendation | undefined => {
      const base = baseRecommendations.find((r) => r.applicationId === applicationId);
      if (!base) return undefined;
      const status = overlay.recStatus[applicationId];
      return status ? { ...base, status } : base;
    },
    [overlay],
  );

  const getAudit = useCallback(
    (applicationId: string): AuditEvent[] => {
      const base = baseAudit.filter((e) => e.applicationId === applicationId);
      const extra = overlay.auditExtra[applicationId] ?? [];
      return [...base, ...extra];
    },
    [overlay],
  );

  const getDecision = useCallback(
    (applicationId: string) => overlay.decisions[applicationId],
    [overlay],
  );

  const getFinalLimit = useCallback(
    (applicationId: string) => overlay.appFinalLimit[applicationId],
    [overlay],
  );

  const submitDecision = useCallback((input: SubmitDecisionInput): HumanDecision => {
    const decision: HumanDecision = {
      applicationId: input.applicationId,
      decisionType: input.decisionType,
      approvedLimit: input.approvedLimit,
      reasonCode: input.reasonCode,
      note: input.note,
      reviewer: CURRENT_USER.name,
      decidedAt: `Today, ${nowClockLabel()}`,
    };
    dispatch({ type: "SUBMIT_DECISION", decision });
    return decision;
  }, []);

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const value = useMemo<AppStoreValue>(
    () => ({
      applications,
      getApplication,
      getRecommendation,
      getAudit,
      getDecision,
      getFinalLimit,
      submitDecision,
      reset,
      decidedCount: Object.keys(overlay.decisions).length,
    }),
    [
      applications,
      getApplication,
      getRecommendation,
      getAudit,
      getDecision,
      getFinalLimit,
      submitDecision,
      reset,
      overlay.decisions,
    ],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within an AppStoreProvider");
  return ctx;
}

// Re-export for convenience where actor labels are rendered.
export { actorLabel };
