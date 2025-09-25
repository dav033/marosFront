import cn from "classnames";
import React from "react";

export type SkeletonBlockProps = {
  /** Alto en px (por defecto 16) */
  h?: number;
  /** Clases extra: usa aquí w-*, grid/flex utils, etc. */
  className?: string;
  /** Radio del borde */
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  /** Accesibilidad opcional */
  "aria-label"?: string;
};

const roundedMap: Record<NonNullable<SkeletonBlockProps["rounded"]>, string> = {
  none: "rounded-none",
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export default function SkeletonBlock({
  h = 16,
  className = "",
  rounded = "md",
  ...rest
}: SkeletonBlockProps) {
  return (
    <div
      aria-hidden="true"
      {...rest}
      className={cn(
        // Gradiente neutro (modo claro/oscuro)
        "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600",
        roundedMap[rounded],
        className
      )}
      style={{ height: h }}
    />
  );
}
