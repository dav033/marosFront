import React from "react";
import { Icon } from "@iconify/react";
import { LeadStatus } from "src/types/enums";

interface Props {
  status: LeadStatus | string | null | undefined;
}

export default function StatusBadge({ status }: Props) {
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
      colorClasses = "bg-yellow-600 text-theme-light";
      break;
    case LeadStatus.TO_DO:
      colorClasses = "bg-blue-600 text-theme-light";
      break;
    case LeadStatus.UNDETERMINED:
      colorClasses = "bg-theme-gray text-theme-light";
      break;
    default:
      colorClasses = "bg-theme-gray-alt text-theme-light";
  }

  const iconName = (() => {
    switch (status) {
      case LeadStatus.DONE:
        return "material-symbols:done";
      case LeadStatus.IN_PROGRESS:
        return "material-symbols:arrow-upload-progress-rounded";
      case LeadStatus.LOST:
        return "material-symbols:close";
      case LeadStatus.TO_DO:
        return "material-symbols:event-list-outline-sharp";
      case LeadStatus.UNDETERMINED:
        return "material-symbols:help-outline";
      default:
        return null;
    }
  })();

  return (
    <span className={`${baseClasses} ${colorClasses}`}>
      {iconName && <Icon icon={iconName} className="mr-1 p-0 m-0" />}
      {String(status).replace(/_/g, " ")}
    </span>
  );
}