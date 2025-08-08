import React from "react";
import { useLoading } from "src/contexts/LoadingContext";
import { ContactsTableSkeleton } from "@components/contacts/ContactsTableSkeleton";
import { TableSkeleton } from "@components/common/TableSkeleton";

export const SkeletonRenderer: React.FC = () => {
  const { isLoading, skeletonType, options } = useLoading();

  if (!isLoading || !skeletonType) return null;

  // Optional overlay for blocking UI
  const content = (() => {
    switch (skeletonType) {
      case "contactsTable":
        return <ContactsTableSkeleton rows={options.rows ?? 15} />;
      case "genericTable":
      case "leadsTable":
        return (
          <TableSkeleton
            rows={options.rows ?? 8}
            showSections={options.showSections ?? true}
          />
        );
      case "list":
        return (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: options.rows ?? 8 }).map((_, i) => (
              <div
                key={i}
                className="h-6 bg-gray-200 dark:bg-gray-700 rounded"
              />
            ))}
          </div>
        );
      case "form":
        return (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: options.rows ?? 6 }).map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 dark:bg-gray-700 rounded"
              />
            ))}
          </div>
        );
      default:
        return (
          <TableSkeleton
            rows={options.rows ?? 8}
            showSections={options.showSections ?? false}
          />
        );
    }
  })();

  if (options.overlay) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center p-6 overflow-auto">
        <div className="max-w-6xl w-full">{content}</div>
      </div>
    );
  }

  return <>{content}</>;
};
