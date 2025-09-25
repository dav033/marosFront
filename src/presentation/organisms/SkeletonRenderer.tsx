import React from "react";

import ContactsTableSkeleton from "../molecules/ContactsTableSkeleton";
import FormSkeleton from "../molecules/FormSkeleton";
import ListSkeleton from "../molecules/ListSkeleton";
import TableSkeleton from "../molecules/TableSkeleton";
import useLoading from "../context/loading/hooks/useLoading";

type SkeletonType =
  | "contactsTable"
  | "genericTable"
  | "leadsTable"
  | "list"
  | "form"
  | string;
type SkeletonOptions = {
  rows?: number;
  showSections?: boolean;
  overlay?: boolean;
};

const SkeletonRenderer: React.FC = () => {
  const { isLoading, skeletonType, options } = useLoading() as {
    isLoading: boolean;
    skeletonType?: SkeletonType | null;
    options: SkeletonOptions;
  };

  if (!isLoading) {
    return null;
  }
  if (!skeletonType) {
    return null;
  }

  let content: React.ReactNode;
  switch (skeletonType) {
    case "contactsTable":
      content = (
        <ContactsTableSkeleton
          rows={options?.rows ?? 15}
          data-testid="sk-contacts"
        />
      );
      break;
    case "genericTable":
    case "leadsTable":
      content = (
        <TableSkeleton
          rows={options?.rows ?? 8}
          showSections={options?.showSections ?? true}
          data-testid="sk-table"
        />
      );
      break;
    case "list":
      content = (
        <ListSkeleton rows={options?.rows ?? 8} data-testid="sk-list" />
      );
      break;
    case "form":
      content = (
        <FormSkeleton rows={options?.rows ?? 6} data-testid="sk-form" />
      );
      break;
    default:
      content = (
        <TableSkeleton rows={options?.rows ?? 8} data-testid="sk-default" />
      );
  }

  if (options?.overlay) {
    return (
      <div
        data-testid="sk-overlay"
        className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-[1px] flex items-start justify-center p-6 overflow-auto"
      >
        <div className="max-w-6xl w-full">{content}</div>
      </div>
    );
  }

  return <div data-testid="sk-inline">{content}</div>;
};

export default SkeletonRenderer;
