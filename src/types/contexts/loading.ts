

export type SkeletonType =
  | "contactsTable"
  | "genericTable"
  | "list"
  | "form"
  | "leadsTable";

export interface SkeletonOptions {
  rows?: number | undefined;
  showSections?: boolean | undefined;
  overlay?: boolean | undefined;
}

export interface LoadingContextValue {
  isLoading: boolean;
  skeletonType: SkeletonType | null;
  options: SkeletonOptions;
  showLoading: (type?: SkeletonType, options?: SkeletonOptions) => void;
  hideLoading: () => void;
  setSkeleton: (type: SkeletonType, options?: SkeletonOptions) => void;
}
