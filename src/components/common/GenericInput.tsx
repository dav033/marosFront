import React from "react";
import { Icon } from "@iconify/react";

export interface GenericInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  icon?: string;
}

export const GenericInput: React.FC<GenericInputProps> = ({
  className = "",
  type = "text",
  icon,
  ...props
}) => {
  const hasIcon = Boolean(icon);
  const paddingLeft = hasIcon ? "pl-10" : "pl-3";

  // Extract margin and display/visibility classes from className to apply to container
  const containerClasses = className.match(/(^|\s)(m[trblxy]?-\w+|hidden|block|inline|inline-block|flex|grid|table|display-none)/g)?.join(' ') || '';
  const inputClasses = className.replace(/(^|\s)(m[trblxy]?-\w+|hidden|block|inline|inline-block|flex|grid|table|display-none)/g, '').trim();

  // Base classes for the input
  const baseClasses = [
    "flex",
    "h-10",
    "w-full", 
    "rounded-xl",
    "bg-black",
    "border-[0.75px]",
    "border-theme-gray",
    "text-theme-light",
    "placeholder:text-gray-400",
    paddingLeft,
    "pr-3",
    "py-2",
    "text-sm",
    "outline-none",
    "focus:outline-none",
    "ring-0",
    "focus:ring-0",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
    "mb-1"
  ].join(' ');

  return (
    <div className={`relative w-full mb-0.5 ${containerClasses}`}>
      {hasIcon && (
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Icon icon={icon!} className="text-gray-400" />
        </span>
      )}
      <input
        type={type}
        className={`${baseClasses} ${inputClasses}`}
        {...props}
      />
    </div>
  );
};
