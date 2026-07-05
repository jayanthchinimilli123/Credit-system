import type { PolicyRule } from "@/types";

export const policyRules: PolicyRule[] = [
  {
    id: "POL-01",
    title: "Large limit increases require Credit Manager approval",
    description: "Any credit limit increase above 2x the current limit requires Credit Manager approval.",
    category: "Approval threshold",
    requiresRole: "Credit Manager",
    active: true,
  },
  {
    id: "POL-02",
    title: "Past-due accounts require manual review",
    description: "Any customer with invoices 30+ days past due requires manual review before a decision.",
    category: "Risk control",
    requiresRole: "Credit Manager",
    active: true,
  },
  {
    id: "POL-03",
    title: "High-value limits require senior approval",
    description: "Any requested limit above $500,000 requires senior approval.",
    category: "Approval threshold",
    requiresRole: "Senior Credit Officer",
    active: true,
  },
  {
    id: "POL-04",
    title: "Missing trade references block auto-approval",
    description: "Applications without complete trade references cannot be auto-approved.",
    category: "Documentation",
    requiresRole: "Credit Analyst",
    active: true,
  },
  {
    id: "POL-05",
    title: "Medium-risk applications require human confirmation",
    description: "Medium-risk applications always require human confirmation before approval.",
    category: "Human-in-the-loop",
    requiresRole: "Credit Manager",
    active: true,
  },
  {
    id: "POL-06",
    title: "High-risk applications cannot be auto-approved",
    description: "High-risk applications can never be auto-approved and must be reviewed by a human.",
    category: "Human-in-the-loop",
    requiresRole: "Credit Manager",
    active: true,
  },
];
