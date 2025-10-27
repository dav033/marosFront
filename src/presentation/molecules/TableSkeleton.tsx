import React from "react";

import { DEFAULT_STATUS_ORDER, STATUS_LABELS } from "@/leads";

import CardRowSkeleton from "./CardRowSkeleton";
import SectionHeaderSkeleton from "./SectionHeaderSkeleton";

export type TableSkeletonProps = {
  rows?: number;
  showSections?: boolean;
  sectionTitles?: string[];
  className?: string;
};

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 6,
  showSections = true,
  sectionTitles,
  className = "",
}) => {
  const defaultTitles = DEFAULT_STATUS_ORDER.map((k) => STATUS_LABELS[k] ?? String(k));
  const sections = sectionTitles && sectionTitles.length > 0 ? sectionTitles : defaultTitles;

  const Header = () => <SectionHeaderSkeleton />;

  const SkeletonSection: React.FC<{ titleKey: string }> = ({ titleKey }) => (
    <div className="space-y-4">
      <SectionHeaderSkeleton />
      <div className="space-y-3 pl-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <CardRowSkeleton key={`${titleKey}-row-${i}`} />
        ))}
      </div>
    </div>
  );

  if (showSections) {
    return (
      <div className={`space-y-8 ${className}`}>
        <Header />
        <div className="space-y-6">
          {sections.map((t, i) => (
            <SkeletonSection key={`section-${i}`} titleKey={t} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <Header />
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <CardRowSkeleton key={`row-${i}`} />
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
