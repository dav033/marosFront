import React from "react";

interface TableSkeletonProps {
  rows?: number;
  showSections?: boolean;
}

const SkeletonRow = () => (
  <div className="animate-pulse">
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 space-y-3 border border-gray-100 dark:border-gray-700">
      <div className="flex space-x-4">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/4"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/3"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/5"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/6"></div>
      </div>
      <div className="flex space-x-4">
        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-2/5"></div>
        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/4"></div>
      </div>
      <div className="flex justify-end space-x-2 mt-3">
        <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
        <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded"></div>
      </div>
    </div>
  </div>
);

const SkeletonSection = ({ title }: { title: string }) => (
  <div className="space-y-4">
    {/* Section Header */}
    <div className="animate-pulse">
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-32"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-16"></div>
      </div>
    </div>

    {/* Section Content */}
    <div className="space-y-3 pl-2">
      {[...Array(2)].map((_, index) => (
        <SkeletonRow key={`${title}-skeleton-${index}`} />
      ))}
    </div>
  </div>
);

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 6,
  showSections = true,
}) => {
  if (showSections) {
    const sections = [
      "Pending",
      "In Progress",
      "Completed",
      "Undetermined",
      "Lost",
    ];

    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-48"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-32"></div>
            </div>
            <div className="h-10 bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-600 rounded w-32"></div>
          </div>
        </div>

        {/* Sections Skeleton */}
        <div className="space-y-6">
          {sections.map((title, index) => (
            <SkeletonSection key={`section-${index}`} title={title} />
          ))}
        </div>
      </div>
    );
  }

  // Simple table skeleton without sections
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-48"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-32"></div>
          </div>
          <div className="h-10 bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-600 rounded w-32"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="space-y-4">
        {[...Array(rows)].map((_, index) => (
          <SkeletonRow key={`row-${index}`} />
        ))}
      </div>
    </div>
  );
};
