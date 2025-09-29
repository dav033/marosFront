import cn from "classnames";
import React, { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftAddon?: React.ReactNode; 
  rightAddon?: React.ReactNode; 
  hint?: string;
}

export default forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, leftAddon, rightAddon, hint, id, ...props },
  ref
) {
  const inputId = id || props.name;
  const hasAddons = leftAddon || rightAddon;
  if (!hasAddons) {
    return (
      <label className="w-full text-sm text-theme-light">
        {label && <span className="mb-1 inline-block">{label}</span>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "block w-full bg-theme-dark text-theme-light placeholder-gray-400 border-[0.75px] rounded-xl focus:outline-none px-3 py-2",
            error ? "border-red-500" : "border-theme-gray",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <span className="mt-1 block text-xs text-gray-400">{hint}</span>
        )}
        {error && (
          <span className="mt-1 block text-xs text-red-400">{error}</span>
        )}
      </label>
    );
  }
  return (
    <label className="w-full text-sm text-theme-light">
      {label && <span className="mb-1 inline-block">{label}</span>}
      <div className="relative w-full">
        {leftAddon && (
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {leftAddon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "block w-full bg-theme-dark text-theme-light placeholder-gray-400 border-[0.75px] rounded-xl focus:outline-none py-2",
            leftAddon ? "pl-10" : "pl-3",
            rightAddon ? "pr-10" : "pr-3",
            error ? "border-red-500" : "border-theme-gray",
            className
          )}
          {...props}
        />
        {rightAddon && (
          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            {rightAddon}
          </span>
        )}
      </div>
      {hint && !error && (
        <span className="mt-1 block text-xs text-gray-400">{hint}</span>
      )}
      {error && (
        <span className="mt-1 block text-xs text-red-400">{error}</span>
      )}
    </label>
  );
});
