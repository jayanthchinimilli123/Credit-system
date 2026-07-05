import { Badge } from "@/components/ui/Badge";
import { riskLabel, riskTone, priorityLabel, priorityTone } from "@/lib/labels";
import type { Priority, RiskLevel } from "@/types";

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  return <Badge tone={riskTone[level]}>{riskLabel[level]} risk</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === "low" || priority === "normal") {
    return <span className="text-xs text-slate-500">{priorityLabel[priority]}</span>;
  }
  return (
    <Badge tone={priorityTone[priority]} dot>
      {priorityLabel[priority]}
    </Badge>
  );
}
