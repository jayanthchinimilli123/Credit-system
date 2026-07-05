import { cn } from "@/lib/utils";
import { percent } from "@/lib/format";

interface Props {
  value: number; // 0-100
  size?: "sm" | "md";
  showLabel?: boolean;
}

// Confidence is deliberately paired with a value + qualitative label so it is
// never read as a standalone "score" (human-in-the-loop principle).
function band(value: number): { label: string; bar: string; text: string } {
  if (value >= 85) return { label: "High confidence", bar: "bg-emerald-500", text: "text-emerald-700" };
  if (value >= 70) return { label: "Moderate confidence", bar: "bg-amber-500", text: "text-amber-700" };
  return { label: "Low confidence", bar: "bg-slate-400", text: "text-slate-600" };
}

export function ConfidenceIndicator({ value, size = "md", showLabel = true }: Props) {
  const b = band(value);
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between">
        <span className={cn("font-semibold text-slate-900", size === "sm" ? "text-sm" : "text-lg")}>
          {percent(value)}
        </span>
        {showLabel && (
          <span className={cn("text-xs font-medium", b.text)}>{b.label}</span>
        )}
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="AI confidence"
      >
        <div
          className={cn("h-full rounded-full transition-all", b.bar)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
