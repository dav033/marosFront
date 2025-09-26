import cn from "classnames";
import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "link";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center cursor-pointer rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-theme-primary disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-theme-primary text-white hover:bg-theme-primary/80",
  secondary: "bg-theme-gray text-white hover:bg-theme-gray-alt",
  ghost: "bg-transparent text-theme-light hover:bg-theme-gray-subtle",
  danger: "bg-red-600 text-white hover:bg-red-600/80",
  link: "bg-transparent text-theme-primary hover:underline rounded-none px-0",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-2.5",
};

export default function Button({
  className,
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
    </button>
  );
}
