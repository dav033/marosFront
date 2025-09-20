import React, {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  useContext,
  useEffect,
} from "react";
import type { SkeletonOptions } from "@/types/contexts/loading";

export type SkeletonType = "contactsTable" | "genericTable" | "leadsTable" | "list" | "form" | string;

export type LoadingState = {
  isLoading: boolean;
  skeletonType: SkeletonType | null;
  options: SkeletonOptions;
};

export type LoadingActions = {
  showLoading: (type?: SkeletonType, opts?: SkeletonOptions) => void;
  hideLoading: () => void;
  setSkeleton: (type: SkeletonType, opts?: SkeletonOptions) => void;
  resetSkeleton: () => void;
  withLoading: <T>(
    task: () => Promise<T>,
    cfg?: { type?: SkeletonType; opts?: SkeletonOptions }
  ) => Promise<T>;
};

export const LoadingStateContext = createContext<LoadingState | null>(null);
export const LoadingActionsContext = createContext<LoadingActions | null>(null);

const DEFAULT_OPTIONS: Required<SkeletonOptions> = {
  rows: 8,
  showSections: false,
  overlay: false,
};

function shallowEqualOptions(a: SkeletonOptions, b: SkeletonOptions) {
  return (
    a.rows === b.rows &&
    a.showSections === b.showSections &&
    a.overlay === b.overlay
  );
}

export const LoadingProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [skeletonType, setSkeletonType] = useState<SkeletonType | null>(null);
  const [options, setOptions] = useState<SkeletonOptions>(DEFAULT_OPTIONS);
  const loadingCountRef = useRef(0);

  useEffect(() => {
    console.log("[LoadingProvider] MOUNT");
    return () => console.log("[LoadingProvider] UNMOUNT");
  }, []);

  const setSkeleton = useCallback(
    (type: SkeletonType, opts?: SkeletonOptions) => {
      console.log("[LoadingProvider.setSkeleton] type:", type, "opts:", opts);
      setSkeletonType((prev) => (prev !== type ? type : prev));
      if (opts) {
        const next = {
          rows: opts.rows ?? options.rows,
          showSections: opts.showSections ?? options.showSections,
          overlay: opts.overlay ?? options.overlay,
        };
        if (!shallowEqualOptions(options, next)) setOptions(next);
      }
    },
    [options]
  );

  const resetSkeleton = useCallback(() => {
    console.log("[LoadingProvider.resetSkeleton]");
    setSkeletonType(null);
    setOptions((prev) =>
      shallowEqualOptions(prev, DEFAULT_OPTIONS) ? prev : DEFAULT_OPTIONS
    );
  }, []);

  const showLoading = useCallback(
    (type?: SkeletonType, opts?: SkeletonOptions) => {
      loadingCountRef.current += 1;
      if (loadingCountRef.current === 1) {
        setIsLoading(true);
      }
      if (type) setSkeleton(type, opts);
      else if (opts) {
        const next = {
          rows: opts.rows ?? options.rows,
          showSections: opts.showSections ?? options.showSections,
          overlay: opts.overlay ?? options.overlay,
        };
        if (!shallowEqualOptions(options, next)) setOptions(next);
      }
      console.log(
        "[LoadingProvider.showLoading] count=",
        loadingCountRef.current,
        "isLoading=",
        true,
        "type=",
        type ?? skeletonType,
        "opts=",
        opts ?? options
      );
    },
    [setSkeleton, options, skeletonType]
  );

  const hideLoading = useCallback(() => {
    loadingCountRef.current = Math.max(0, loadingCountRef.current - 1);
    const nextLoading = loadingCountRef.current > 0;
    if (!nextLoading) setIsLoading(false);
    console.log(
      "[LoadingProvider.hideLoading] count=",
      loadingCountRef.current,
      "isLoading=",
      nextLoading
    );
  }, []);

  const withLoading = useCallback(
    async <T,>(task: () => Promise<T>, cfg?: { type?: SkeletonType; opts?: SkeletonOptions }) => {
      console.log("[LoadingProvider.withLoading] START cfg=", cfg);
      try {
        showLoading(cfg?.type, cfg?.opts);
        const res = await task();
        console.log("[LoadingProvider.withLoading] DONE");
        return res;
      } catch (e) {
        console.log("[LoadingProvider.withLoading] ERROR", e);
        throw e;
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading]
  );

  useEffect(() => {
    console.log("[LoadingProvider.state] isLoading=", isLoading, "type=", skeletonType, "opts=", options);
  }, [isLoading, skeletonType, options]);

  const stateValue = useMemo<LoadingState>(
    () => ({ isLoading, skeletonType, options }),
    [isLoading, skeletonType, options]
  );

  const actionsValue = useMemo<LoadingActions>(
    () => ({ showLoading, hideLoading, setSkeleton, resetSkeleton, withLoading }),
    [showLoading, hideLoading, setSkeleton, resetSkeleton, withLoading]
  );

  return (
    <LoadingStateContext.Provider value={stateValue}>
      <LoadingActionsContext.Provider value={actionsValue}>
        {children}
      </LoadingActionsContext.Provider>
    </LoadingStateContext.Provider>
  );
};

// Hooks de acceso
export function useLoadingState(): LoadingState {
  const ctx = useContext(LoadingStateContext);
  if (!ctx) {
    console.log("[useLoadingState] SIN PROVIDER");
    throw new Error("useLoadingState must be used within a LoadingProvider");
  }
  return ctx;
}
export function useLoadingActions(): LoadingActions {
  const ctx = useContext(LoadingActionsContext);
  if (!ctx) {
    console.log("[useLoadingActions] SIN PROVIDER");
    throw new Error("useLoadingActions must be used within a LoadingProvider");
  }
  return ctx;
}
