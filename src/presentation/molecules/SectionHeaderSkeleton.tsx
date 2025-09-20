// src/presentation/molecules/SectionHeaderSkeleton.tsx
import React from "react";
import SkeletonBlock from "@/presentation/atoms/SkeletonBlock";

export type SectionHeaderSkeletonProps = {
  /** Alto/width del bloque izquierdo */
  leftHeight?: number;
  leftWidthClass?: string; // Tailwind width (w-*)
  /** Alto/width del bloque derecho (acción) */
  rightHeight?: number;
  rightWidthClass?: string; // Tailwind width (w-*)
  /** Mostrar la “acción” a la derecha */
  showRight?: boolean;
  /** Clases extra para el wrapper y el contenedor interno */
  className?: string;
  containerClassName?: string;
  /** Desactivar el pulso */
  pulse?: boolean;
};

export default function SectionHeaderSkeleton({
  leftHeight = 24,
  leftWidthClass = "w-32",
  rightHeight = 16,
  rightWidthClass = "w-16",
  showRight = true,
  className = "",
  containerClassName = "bg-gray-50 dark:bg-gray-900 p-3 rounded-lg",
  pulse = true,
}: SectionHeaderSkeletonProps) {
  return (
    <div className={`${pulse ? "animate-pulse" : ""} ${className}`}>
      <div className={`flex items-center justify-between ${containerClassName}`}>
        <SkeletonBlock h={leftHeight} className={leftWidthClass} />
        {showRight && (
          <SkeletonBlock h={rightHeight} className={rightWidthClass} />
        )}
      </div>
    </div>
  );
}
