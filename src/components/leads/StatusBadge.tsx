// src/components/leads/StatusBadge.tsx

import React from "react";
import { Icon } from "@iconify/react";
import { LeadStatus } from "src/types/enums";

interface Props {
  status: LeadStatus | string;
}

export default function StatusBadge({ status }: Props) {
  if (status == null || status === "null") return null;

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
  ].join(" ");

  let colorClasses: string;
  switch (status) {
    case LeadStatus.DONE:
      colorClasses = "bg-[#66BB6A] text-white";    // Verde 400
      break;
    case LeadStatus.LOST:
      colorClasses = "bg-[#E53935] text-white";    // Rojo 600
      break;
    case LeadStatus.IN_PROGRESS:
      // Morado 400 para “in progress”
      colorClasses = "bg-[#AB47BC] text-white";
      break;
    case LeadStatus.TO_DO:
      colorClasses = "bg-[#42A5F5] text-white";    // Azul 400
      break;
    default:
      colorClasses = "bg-[#BDBDBD] text-white";    // Gris 400
  }

  const iconName = (() => {
    switch (status) {
      case LeadStatus.DONE:
        return "material-symbols:done";
      case LeadStatus.IN_PROGRESS:
        return "material-symbols:arrow-upload-progress-rounded";
      case LeadStatus.LOST:
        return "material-symbols:arrow-upload-progress-rounded";
      case LeadStatus.TO_DO:
        return "material-symbols:event-list-outline-sharp";
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
