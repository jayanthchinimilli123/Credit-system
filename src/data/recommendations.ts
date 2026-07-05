import type { Recommendation } from "@/types";

export const recommendations: Recommendation[] = [
  {
    id: "REC-1042",
    applicationId: "APP-1042",
    recommendationType: "approve_with_adjusted_limit",
    requestedLimit: 250_000,
    suggestedLimit: 175_000,
    confidence: 84,
    riskLevel: "medium",
    reasoning:
      "The customer has strong payment history over the last 12 months, but recent invoice aging and increased order volume create moderate exposure risk. AI recommends approving the application with a reduced limit until two additional payment cycles are completed.",
    supportingSignals: [
      "92% of invoices paid on time in the last 12 months",
      "Average days sales outstanding increased from 34 to 47 days",
      "Requested limit is 2.5x higher than current approved limit",
      "Two trade references are positive",
      "One recent invoice is 21 days past due",
    ],
    riskIfApproved: [
      "Higher exposure if the payment delay trend continues",
      "Limit increase may exceed internal policy threshold",
    ],
    riskIfDeclined: [
      "Sales team may lose a high-value customer opportunity",
      "Customer has mostly positive historical behavior",
    ],
    requiredReviewerRole: "Credit Manager",
    status: "pending_review",
  },
  {
    id: "REC-1043",
    applicationId: "APP-1043",
    recommendationType: "escalate",
    requestedLimit: 500_000,
    suggestedLimit: 400_000,
    confidence: 76,
    riskLevel: "medium_high",
    reasoning:
      "Requested exposure crosses the $500,000 senior-approval threshold and coincides with two delayed payments this quarter. AI recommends escalating to a senior reviewer with a capped interim limit of $400,000.",
    supportingSignals: [
      "Requested limit reaches the $500,000 senior-approval threshold",
      "Two payments delayed beyond terms in the last quarter",
      "23-year operating history with stable order volume",
      "Open balance is elevated at $268,900",
    ],
    riskIfApproved: [
      "Concentration risk from a single large account",
      "Recent payment delays may indicate cash-flow pressure",
    ],
    riskIfDeclined: [
      "Long-standing strategic manufacturing account",
      "Historically reliable before this quarter",
    ],
    requiredReviewerRole: "Senior Credit Officer",
    status: "escalated",
  },
  {
    id: "REC-1044",
    applicationId: "APP-1044",
    recommendationType: "approve",
    requestedLimit: 75_000,
    suggestedLimit: 75_000,
    confidence: 91,
    riskLevel: "low",
    reasoning:
      "A modest limit increase for a long-standing customer with consistently on-time payments and low outstanding exposure. AI recommends approving the requested limit in full.",
    supportingSignals: [
      "98% on-time payment rate across 9-year relationship",
      "Low open balance relative to requested limit",
      "No disputes or past-due invoices on record",
    ],
    riskIfApproved: ["Minimal — exposure remains well within policy"],
    riskIfDeclined: ["Unnecessary friction for a reliable, growing account"],
    requiredReviewerRole: "Credit Manager",
    status: "pending_review",
  },
  {
    id: "REC-1045",
    applicationId: "APP-1045",
    recommendationType: "request_more_documents",
    requestedLimit: 200_000,
    suggestedLimit: null,
    confidence: 58,
    riskLevel: "unknown",
    reasoning:
      "The customer's financial statement is incomplete and one trade reference is still pending, so AI cannot form a confident risk view. AI recommends requesting the missing documents before any decision is made.",
    supportingSignals: [
      "Financial statement missing the most recent quarter",
      "One of three trade references still pending",
      "Short 4-year credit relationship",
    ],
    riskIfApproved: ["Decision would be based on incomplete information"],
    riskIfDeclined: ["Customer may be creditworthy once documents are received"],
    requiredReviewerRole: "Credit Manager",
    status: "more_info_requested",
  },
  {
    id: "REC-1046",
    applicationId: "APP-1046",
    recommendationType: "decline",
    requestedLimit: 350_000,
    suggestedLimit: 100_000,
    confidence: 88,
    riskLevel: "high",
    reasoning:
      "The customer carries a high past-due balance and shows a worsening payment trend across two quarters. AI recommends declining the increase, or reducing the limit significantly to $100,000 while exposure is worked down.",
    supportingSignals: [
      "$214,700 open balance with 14 outstanding invoices",
      "On-time payment rate fell from 81% to 63% over two quarters",
      "Requested limit is 2.3x the current approved limit",
      "Three invoices are more than 30 days past due",
    ],
    riskIfApproved: [
      "Significant loss exposure if payment trend continues",
      "Requested limit far exceeds demonstrated repayment capacity",
    ],
    riskIfDeclined: ["Possible loss of order volume from an active account"],
    requiredReviewerRole: "Credit Manager",
    status: "pending_review",
  },
];

export function getRecommendation(applicationId: string): Recommendation | undefined {
  return recommendations.find((r) => r.applicationId === applicationId);
}
