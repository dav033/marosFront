import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type SkeletonType =
  | "contactsTable"
  | "genericTable"
  | "list"
  | "form"
  | "leadsTable";

export interface SkeletonOptions {
  rows?: number;
  showSections?: boolean;
  overlay?: boolean;
}

interface LoadingContextValue {
  isLoading: boolean;
  skeletonType: SkeletonType | null;
  options: SkeletonOptions;
  showLoading: (type?: SkeletonType, options?: SkeletonOptions) => void;
  hideLoading: () => void;
  setSkeleton: (type: SkeletonType, options?: SkeletonOptions) => void;
}

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

export const LoadingProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [skeletonType, setSkeletonType] = useState<SkeletonType | null>(null);
  const [options, setOptions] = useState<SkeletonOptions>({ rows: 8, showSections: false, overlay: false });

  // Refcount to support nested/concurrent loading states
  const loadingCountRef = useRef(0);

  const setSkeleton = useCallback((type: SkeletonType, opts?: SkeletonOptions) => {
    setSkeletonType(type);
    setOptions(prev => ({ ...prev, ...(opts || {}) }));
  }, []);

  const showLoading = useCallback((type?: SkeletonType, opts?: SkeletonOptions) => {
    loadingCountRef.current += 1;
    if (type) {
      setSkeleton(type, opts);
    }
    setIsLoading(true);
  }, [setSkeleton]);

  const hideLoading = useCallback(() => {
    loadingCountRef.current = Math.max(0, loadingCountRef.current - 1);
    if (loadingCountRef.current === 0) {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<LoadingContextValue>(() => ({
    isLoading,
    skeletonType,
    options,
    showLoading,
    hideLoading,
    setSkeleton,
  }), [isLoading, skeletonType, options, showLoading, hideLoading, setSkeleton]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within a LoadingProvider");
  return ctx;
};
