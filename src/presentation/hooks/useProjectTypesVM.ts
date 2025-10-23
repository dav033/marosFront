import * as React from "react";

import type { LeadsAppContext, ProjectType } from "@/leads";
import { listProjectTypes } from "@/leads";
import { getErrorMessage } from "@/utils";


export function useProjectTypesVM(ctx: LeadsAppContext): {
  projectTypes: ProjectType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [projectTypes, setProjectTypes] = React.useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await listProjectTypes(ctx);
      setProjectTypes(items ?? []);
      setError(null);
    } catch (e: unknown) {
      const msg = getErrorMessage(e) || "Unexpected error";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [ctx]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      await load();
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, [load]);

  return { projectTypes, isLoading, error, refetch: load };
}
