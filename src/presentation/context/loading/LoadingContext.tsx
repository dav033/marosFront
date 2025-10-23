import { useIsFetching } from "@tanstack/react-query";
import React from "react";

type LoadingState = {
  isLoading: boolean;
};

const LoadingCtx = React.createContext<LoadingState>({ isLoading: false });

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const isLoading = useIsFetching() > 0;
  const value = React.useMemo(() => ({ isLoading }), [isLoading]);
  return <LoadingCtx.Provider value={value}>{children}</LoadingCtx.Provider>;
}

export function useLoading(): LoadingState {
  return React.useContext(LoadingCtx);
}
