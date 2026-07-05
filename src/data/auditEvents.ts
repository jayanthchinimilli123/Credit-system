import type { AuditEvent } from "@/types";

// Seed audit trail. Human decisions append to this at runtime (via the store).
export const auditEvents: AuditEvent[] = [
  // ---- APP-1042 · Northstar Medical Supplies ----------------------------
  {
    id: "AUD-1042-01",
    applicationId: "APP-1042",
    timestamp: "Today, 9:12 AM",
    actor: "CreditFlow AI",
    actorType: "ai_agent",
    action: "AI analyzed credit application",
  },
  {
    id: "AUD-1042-02",
    applicationId: "APP-1042",
    timestamp: "Today, 9:13 AM",
    actor: "CreditFlow AI",
    actorType: "ai_agent",
    action: "AI recommended approval with adjusted limit of $175,000",
    statusChange: "AI recommendation ready",
  },
  {
    id: "AUD-1042-03",
    applicationId: "APP-1042",
    timestamp: "Today, 9:15 AM",
    actor: "System",
    actorType: "system",
    action: "Application routed to Credit Manager for human review",
    statusChange: "Needs review",
  },

  // ---- APP-1043 · Apex Industrial Parts ---------------------------------
  {
    id: "AUD-1043-01",
    applicationId: "APP-1043",
    timestamp: "Today, 8:40 AM",
    actor: "CreditFlow AI",
    actorType: "ai_agent",
    action: "AI analyzed credit application",
  },
  {
    id: "AUD-1043-02",
    applicationId: "APP-1043",
    timestamp: "Today, 8:41 AM",
    actor: "CreditFlow AI",
    actorType: "ai_agent",
    action: "AI recommended escalation with interim limit of $400,000",
    statusChange: "Escalated",
  },
  {
    id: "AUD-1043-03",
    applicationId: "APP-1043",
    timestamp: "Today, 8:45 AM",
    actor: "System",
    actorType: "system",
    action: "Policy rule matched: requested limit reaches senior-approval threshold",
  },

  // ---- APP-1044 · BlueWave Retail Group ---------------------------------
  {
    id: "AUD-1044-01",
    applicationId: "APP-1044",
    timestamp: "Today, 8:04 AM",
    actor: "CreditFlow AI",
    actorType: "ai_agent",
    action: "AI analyzed credit application",
  },
  {
    id: "AUD-1044-02",
    applicationId: "APP-1044",
    timestamp: "Today, 8:05 AM",
    actor: "CreditFlow AI",
    actorType: "ai_agent",
    action: "AI recommended approval of the requested $75,000 limit",
    statusChange: "AI recommendation ready",
  },

  // ---- APP-1045 · Horizon BuildCo ---------------------------------------
  {
    id: "AUD-1045-01",
    applicationId: "APP-1045",
    timestamp: "Yesterday, 4:50 PM",
    actor: "CreditFlow AI",
    actorType: "ai_agent",
    action: "AI analyzed credit application",
  },
  {
    id: "AUD-1045-02",
    applicationId: "APP-1045",
    timestamp: "Yesterday, 4:52 PM",
    actor: "CreditFlow AI",
    actorType: "ai_agent",
    action: "AI requested additional documents before forming a recommendation",
    statusChange: "Missing information",
  },

  // ---- APP-1046 · Summit Electronics ------------------------------------
  {
    id: "AUD-1046-01",
    applicationId: "APP-1046",
    timestamp: "Today, 7:35 AM",
    actor: "CreditFlow AI",
    actorType: "ai_agent",
    action: "AI analyzed credit application",
  },
  {
    id: "AUD-1046-02",
    applicationId: "APP-1046",
    timestamp: "Today, 7:36 AM",
    actor: "CreditFlow AI",
    actorType: "ai_agent",
    action: "AI recommended declining or reducing the limit to $100,000",
    statusChange: "Needs review",
  },
];

export function getAuditEvents(applicationId: string): AuditEvent[] {
  return auditEvents.filter((e) => e.applicationId === applicationId);
}
