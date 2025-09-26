import { Icon } from "@iconify/react";
import React from "react";

export type BadgeColor = "gray" | "primary" | "success" | "warning" | "danger";
export type BadgeVariant = "solid" | "soft" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    label?: React.ReactNode;
    variant?: BadgeVariant;
    color?: BadgeColor;
    size?: BadgeSize;
    rounded?: "full" | "sm";
    leftIcon?: string;
    uppercase?: boolean;
    disabled?: boolean;
    className?: string;
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-4 py-2 text-base",
};

const roundedClasses = {
  full: "rounded-full",
  sm: "rounded-sm",
};

function makeColorClasses(variant: BadgeVariant, color: BadgeColor) {
  switch (variant) {
    case "outline": {
      switch (color) {
        case "primary":
          return "border border-theme-primary text-theme-primary bg-transparent";
        case "success":
          return "border border-green-600 text-green-600 bg-transparent";
        case "warning":
          return "border border-yellow-500 text-yellow-500 bg-transparent";
        case "danger":
          return "border border-red-600 text-red-600 bg-transparent";
        default:
          return "border border-theme-gray text-theme-light bg-transparent";
      }
    }
    case "soft": {
      switch (color) {
        case "primary":
          return "bg-theme-primary/15 text-theme-primary";
        case "success":
          return "bg-green-600/15 text-green-500";
        case "warning":
          return "bg-yellow-500/20 text-yellow-400";
        case "danger":
          return "bg-red-600/15 text-red-400";
        default:
          return "bg-theme-gray/20 text-theme-light/90";
      }
    }
    default: {
      switch (color) {
        case "primary":
          return "bg-theme-primary text-theme-light";
        case "success":
          return "bg-green-600 text-theme-light";
        case "warning":
          return "bg-yellow-600 text-theme-light";
        case "danger":
          return "bg-red-600 text-theme-light";
        default:
          return "bg-theme-gray text-theme-light";
      }
    }
  }
}

const base = [
  "inline-flex items-center whitespace-normal break-words",
  "font-medium select-none",
  "gap-1",
].join(" ");

const iconCls = "w-4 h-4 shrink-0";

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      label,
      children,
      variant = "solid",
      color = "gray",
      size = "md",
      rounded = "full",
      leftIcon,
      uppercase = false,
      disabled = false,
      className = "",
      ...rest
    },
    ref
  ) => {
    const colorClasses = makeColorClasses(variant, color);
    const cn = [
      base,
      sizeClasses[size],
      roundedClasses[rounded],
      colorClasses,
      disabled ? "opacity-60 cursor-not-allowed" : "",
      uppercase ? "uppercase" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span
        aria-disabled={disabled || undefined}
        ref={ref}
        className={cn}
        {...rest}
      >
        {leftIcon && <Icon icon={leftIcon} className={iconCls} />}
        {children ?? label}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;

/*
Uso sugerido:
  <Badge label="In Progress" color="warning" />
  <Badge label="Done" color="success" />
  <Badge label="N/A" color="gray" rounded="sm" uppercase />
  <Badge variant="outline" color="primary" leftIcon="material-symbols:info-outline" >Info</Badge>
*/
