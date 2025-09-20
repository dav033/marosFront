// src/presentation/context/loading/hooks/useSkeletonState.ts
import { useMemo } from "react";
import useLoadingState from "./useLoadingState";

export default function useSkeletonState(): { skeletonType: typeof state.skeletonType; options: typeof state.options } {
  const state = useLoadingState();
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  state; // TS helper para inferir tipos sin importar los concretos
  const { skeletonType, options } = state;
  return useMemo(() => ({ skeletonType, options }), [skeletonType, options]);
}
