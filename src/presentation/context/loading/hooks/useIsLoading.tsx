// src/presentation/context/loading/hooks/useIsLoading.ts
import { useMemo } from "react";
import useLoadingState from "./useLoadingState";

export default function useIsLoading(): boolean {
  const { isLoading } = useLoadingState();
  return useMemo(() => isLoading, [isLoading]);
}
