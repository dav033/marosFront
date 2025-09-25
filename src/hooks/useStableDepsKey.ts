import { useMemo } from "react";

import { stableKey } from "../utils/cacheHelpers";

export function useStableDepsKey(params: unknown[], deps?: unknown[]) {
  const base = deps ?? params;
  return useMemo(() => stableKey(base), [base]);
}
