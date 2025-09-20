// src/presentation/molecules/skeletons/FormSkeleton.tsx
import React from "react";

export type FormSkeletonProps = {
  rows?: number;
};

/** Skeleton tipo formulario (misma UI del origen) */
export function FormSkeleton({ rows = 6 }: FormSkeletonProps) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
      ))}
    </div>
  );
}

export default FormSkeleton;
