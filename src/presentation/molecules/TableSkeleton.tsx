import React from "react";

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
  const sections =
    sectionTitles && sectionTitles.length > 0
      ? sectionTitles
      : ["Pending", "In Progress", "Completed", "Undetermined", "Lost"];
  const Header = () => (
    <SectionHeaderSkeleton
    />
  );

  const SkeletonSection: React.FC<{ titleKey: string }> = ({ titleKey }) => (
    <div className="space-y-4">
      <SectionHeaderSkeleton />
      <div className="space-y-3 pl-2">
        {[...Array(2)].map((_, i) => (
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
        {[...Array(rows)].map((_, i) => (
          <CardRowSkeleton key={`row-${i}`} />
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
