// src/presentation/molecules/skeletons/ListSkeleton.tsx
import React from "react";

export type ListSkeletonProps = {
  rows?: number;
};

/** Skeleton tipo lista (misma UI del origen) */
export function ListSkeleton({ rows = 8 }: ListSkeletonProps) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
      ))}
    </div>
  );
}

export default ListSkeleton;
