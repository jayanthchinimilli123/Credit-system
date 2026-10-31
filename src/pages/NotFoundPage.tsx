import { Compass } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { LinkButton } from "@/components/ui/LinkButton";

export function NotFoundPage() {
  return (
    <AppShell>
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="This route doesn't exist in the CreditFlow AI prototype."
        action={
          <LinkButton to="/app" size="sm">
            Go to Applications Queue
          </LinkButton>
        }
      />
    </AppShell>
  );
}
