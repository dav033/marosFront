import type { ProjectType } from "@/types";
import React from "react";

interface Props {
  projectType: ProjectType | null;
}

export default function ProjectTypeBadge({ projectType }: Props) {
  if (!projectType) {
    return (
      <span
        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-sm whitespace-normal break-words uppercase w-full justify-center"
        style={{ backgroundColor: "#BDBDBD", color: "#FFFFFF" }}
      >
        N/A
      </span>
    );
  }

  const { name, color } = projectType;
  const bgColor = color || "#BDBDBD";
  return (
    <span
      className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-sm whitespace-normal break-words uppercase w-full justify-center"
      style={{ backgroundColor: bgColor, color: "#FFFFFF" }}
    >
      {name}
    </span>
  );
}
