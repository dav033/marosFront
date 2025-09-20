import * as React from "react";
import classNames from "classnames";

export type DividerProps = {
  label?: string;
  className?: string;
};

export default function Divider({ label, className }: DividerProps) {
  return (
    <div className={classNames("flex items-center gap-3 my-4", className)}>
      <div className="h-px w-full bg-gray-200" />
      {label ? <span className="text-xs text-gray-500 whitespace-nowrap">{label}</span> : null}
      {label ? <div className="h-px w-full bg-gray-200" /> : null}
    </div>
  );
}
