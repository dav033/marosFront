// src/components/leads/ProjectTypeBadge.tsx

import React from "react";
import type { ProjectType } from "src/types/types";

interface Props {
  projectType: ProjectType;
}

export default function ProjectTypeBadge({ projectType }: Props) {
  const { name, color } = projectType;
  // color viene de la base, puede ser null o vacío
  const bgColor = color || "#BDBDBD";
  // texto blanco siempre, ajusta si necesitas contraste dinámico
  return (
    <span
      className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-sm whitespace-normal break-words uppercase w-full justify-center"
      style={{ backgroundColor: bgColor, color: "#FFFFFF" }}
    >
      {name}
    </span>
  );
}
