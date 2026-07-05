import { Badge } from "@/components/ui/Badge";
import { statusLabel, statusTone } from "@/lib/labels";
import type { ApplicationStatus } from "@/types";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge tone={statusTone[status]} dot>
      {statusLabel[status]}
    </Badge>
  );
}
