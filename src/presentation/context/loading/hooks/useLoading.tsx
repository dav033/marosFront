import { useContext } from "react";
import {
  LoadingStateContext,
  LoadingActionsContext,
} from "@/presentation/context/loading/LoadingContext";

export default function useLoading() {
  const state = useContext(LoadingStateContext);
  const actions = useContext(LoadingActionsContext);

  if (!state || !actions) {
    console.log("[useLoading] Contexto NO disponible", { hasState: !!state, hasActions: !!actions });
    throw new Error("useLoadingState must be used within a LoadingProvider");
  }

  // Log ligero para cada consumo del hook
  console.log("[useLoading] Hook OK ->", {
    isLoading: state.isLoading,
    skeletonType: state.skeletonType,
    options: state.options,
  });

  return { ...state, ...actions };
}
