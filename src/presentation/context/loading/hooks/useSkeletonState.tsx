// src/presentation/context/loading/hooks/useSkeletonState.tsx

import { useMemo } from "react";
import { type LoadingState, useLoadingState } from "../LoadingContext";


export default function useSkeletonState(): Pick<LoadingState, "skeletonType" | "options"> {
  const state = useLoadingState();
  const { skeletonType, options } = state;
  return useMemo(() => ({ skeletonType, options }), [skeletonType, options]);
}
