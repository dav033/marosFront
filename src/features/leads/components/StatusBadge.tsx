import React from "react";
import { Icon } from "@iconify/react";
import { LeadStatus } from "src/types/enums";
import type { StatusBadgeProps } from "../types";

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (status == null || status === "null" || status === undefined) {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full whitespace-normal break-words bg-theme-gray text-theme-light">
        <Icon icon="material-symbols:help-outline" className="mr-1 p-0 m-0" />
        Undetermined
      </span>
    );
  }

  const baseClasses = [
    "inline-flex",
    "items-center",
    "px-2",
    "py-1",
    "text-xs",
    "font-medium",
    "rounded-full",
    "whitespace-normal",
    "break-words",
    "text-center",
  ].join(" ");

  let colorClasses: string;
  switch (status) {
    case LeadStatus.DONE:
      colorClasses = "bg-green-600 text-theme-light";
      break;
    case LeadStatus.LOST:
      colorClasses = "bg-red-600 text-theme-light";
      break;
    case LeadStatus.IN_PROGRESS:
      colorClasses = "bg-yellow-500 text-theme-gray";
      break;
    default:
      colorClasses = "bg-theme-gray text-theme-light";
  }

  return (
    <span className={`${baseClasses} ${colorClasses}`}>
      <Icon icon="material-symbols:check-circle" className="mr-1 p-0 m-0" />
      {status}
    </span>
  );
}
