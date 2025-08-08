import React from "react";
import type { InteractiveTableProps } from "src/features/leads/types";
import InnerTable from "./InnerTable";
import { LoadingProvider } from "src/contexts/LoadingContext";
import { SkeletonRenderer } from "@components/common/SkeletonRenderer";

export default function InteractiveTable(props: InteractiveTableProps) {
  return (
    <LoadingProvider>
      <SkeletonRenderer />
      <InnerTable {...props} />
    </LoadingProvider>
  );
}
