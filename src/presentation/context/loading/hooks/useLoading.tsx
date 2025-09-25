import { useContext } from "react";
import { LoadingActionsContext, LoadingStateContext } from "../LoadingContext";

export default function useLoading() {
  const state = useContext(LoadingStateContext);
  const actions = useContext(LoadingActionsContext);

  if (!state || !actions) {
    throw new Error("useLoadingState must be used within a LoadingProvider");
  }

  // Log ligero para cada consumo del hook

  return { ...state, ...actions };
}
