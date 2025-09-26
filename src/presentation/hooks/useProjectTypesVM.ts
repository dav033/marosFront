import * as React from "react";

import type { LeadsAppContext } from "@/features/leads/application";
import { listProjectTypes } from "@/features/leads/application/usecases/queries/listProjectTypes";
import type { ProjectType } from "@/features/leads/domain/models/ProjectType";
import type { ProjectTypesVM } from "@/features/projectType/vm/types";
import { getErrorMessage } from "@/utils/errors";


export function useProjectTypesVM(ctx: LeadsAppContext): ProjectTypesVM {
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
