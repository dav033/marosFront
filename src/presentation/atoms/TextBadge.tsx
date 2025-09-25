import classNames from "classnames";
import * as React from "react";

export type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info";

const variants: Record<BadgeVariant, string> = {
  neutral: "bg-gray-100 text-gray-700 border-gray-200",
  success: "bg-emerald-100 text-emerald-700 border-emerald-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  danger:  "bg-rose-100 text-rose-700 border-rose-200",
  info:    "bg-sky-100 text-sky-700 border-sky-200",
};

export type TextBadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  title?: string;
};

export default function TextBadge({
  children,
  variant = "neutral",
  className,
  title,
}: TextBadgeProps) {
  return (
    <span
      title={title}
      className={classNames(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
