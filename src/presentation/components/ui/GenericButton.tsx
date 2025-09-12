import React from "react";
import type { GenericButtonProps } from "@/types";

export const GenericButton: React.FC<GenericButtonProps> = ({
  className = "",
  children,
  type = "button",
  ...props
}) => (
  <button
    type={type}
    className={`inline-flex items-center cursor-pointer justify-center px-4 py-2 bg-theme-primary text-white font-medium rounded-2xl shadow hover:bg-theme-primary/80 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);
