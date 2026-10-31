import { useCallback, useEffect, useState } from "react";
import { api, type ApplicationBundle } from "@/lib/api";

interface State {
  bundle: ApplicationBundle | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  setBundle: (b: ApplicationBundle) => void;
}

/** Fetch a single application's full bundle (application + recommendation +
 *  signals + sources + audit + matched policies + decision) from the API. */
export function useApplicationBundle(id: string): State {
  const [bundle, setBundle] = useState<ApplicationBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setBundle(await api.getBundle(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load application.");
      setBundle(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { bundle, loading, error, reload, setBundle };
}
