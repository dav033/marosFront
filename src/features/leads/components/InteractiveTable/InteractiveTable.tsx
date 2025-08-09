import React from "react";
import InnerTable from "./InnerTable";
import { LoadingProvider } from "src/contexts/LoadingContext";
import { SkeletonRenderer } from "@components/common/SkeletonRenderer";
import type { InteractiveTableProps } from "@/types";

export default function InteractiveTable(props: InteractiveTableProps) {
  return (
    <LoadingProvider>
      <SkeletonRenderer />
      <InnerTable {...props} />
    </LoadingProvider>
  );
}
