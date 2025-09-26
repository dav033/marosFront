import { useContext } from "react";

import { type LoadingActions,LoadingActionsContext } from "../LoadingContext.tsx";

export default function useLoadingActions(): LoadingActions {
  const ctx = useContext(LoadingActionsContext);
  if (!ctx) throw new Error("useLoadingActions must be used within a LoadingProvider");
  return ctx;
}
