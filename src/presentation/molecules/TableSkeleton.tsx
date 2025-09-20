// src/presentation/molecules/TableSkeleton.tsx
import React from "react";
import CardRowSkeleton from "./CardRowSkeleton";
import SectionHeaderSkeleton from "./SectionHeaderSkeleton";


export type TableSkeletonProps = {
  /** Cantidad de filas (cuando no hay secciones) */
  rows?: number;
  /** Muestra secciones (Pending/In Progress/...) */
  showSections?: boolean;
  /** Títulos de secciones (si no se proveen, se usa un set por defecto) */
  sectionTitles?: string[];
  className?: string;
};

/* -------------------- componente principal -------------------- */

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

  // Header superior (título + CTA fantasma)
  const Header = () => (
    <SectionHeaderSkeleton
      // si quieres tamaños específicos, puedes pasarlos:
      // titleH={32} subtitleH={16} ctaH={40}
      // titleW="w-48" subtitleW="w-32" ctaW="w-32"
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
