import { useContext } from "react";

import { type LoadingState,LoadingStateContext } from "../LoadingContext.tsx";

export default function useLoadingState(): LoadingState {
  const ctx = useContext(LoadingStateContext);
  if (!ctx) throw new Error("useLoadingState must be used within a LoadingProvider");
  return ctx;
}
