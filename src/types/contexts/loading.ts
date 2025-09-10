/**
 * Loading Context types
 */

import type { ReactNode } from "react";

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

export interface LoadingContextValue {
  isLoading: boolean;
  skeletonType: SkeletonType | null;
  options: SkeletonOptions;
  showLoading: (type?: SkeletonType, options?: SkeletonOptions) => void;
  hideLoading: () => void;
  setSkeleton: (type: SkeletonType, options?: SkeletonOptions) => void;
}
