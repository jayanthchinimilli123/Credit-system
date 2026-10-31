import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CustomerApplication } from "@/types";
import { api } from "@/lib/api";

// ---------------------------------------------------------------------------
// App-wide store: the list of applications (database-backed via /api), used by
// the queue and the sidebar counts. Single-application detail is fetched by
// the useApplicationBundle hook.
// ---------------------------------------------------------------------------
interface AppStoreValue {
  applications: CustomerApplication[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  /** Replace one application in the list (e.g. after a decision updates it). */
  applyApplication: (app: CustomerApplication) => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<CustomerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setApplications(await api.listApplications());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const applyApplication = useCallback((app: CustomerApplication) => {
    setApplications((prev) => prev.map((a) => (a.id === app.id ? app : a)));
  }, []);

  const value = useMemo<AppStoreValue>(
    () => ({ applications, loading, error, reload, applyApplication }),
    [applications, loading, error, reload, applyApplication],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within an AppStoreProvider");
  return ctx;
}
