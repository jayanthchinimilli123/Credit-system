import { FileSearch } from "lucide-react";
import type { SourceContext } from "@/types";
import { SourceCard } from "./SourceCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";

export function SourceContextPanel({ sources }: { sources: SourceContext[] }) {
  return (
    <Card>
      <CardHeader className="flex-col items-start gap-1">
        <div className="flex items-center gap-2">
          <FileSearch className="h-4 w-4 text-slate-400" />
          <CardTitle>Source Context</CardTitle>
        </div>
        <CardDescription>Where did AI get this recommendation from?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {sources.map((s) => (
          <SourceCard key={s.id} source={s} />
        ))}
      </CardContent>
    </Card>
  );
}
