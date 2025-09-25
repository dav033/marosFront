// src/presentation/molecules/leads/LeadTableColumns.tsx
import React from "react";

import type { Lead } from "@/features/leads/domain/models/Lead";
import ProjectTypeBadge from "@/presentation/molecules/ProjectTypeBadge";
import StatusBadge from "@/presentation/molecules/StatusBadge";
import type { Column } from "@/types/components/table";
import { formatDate } from "@/utils/dateHelpers";

export const leadTableColumns: Column<Lead>[] = [
  {
    key: "name",
    id: "name",
    header: "Name",
    label: "Name",
    accessor: (lead) => lead.name,
    type: "text",
  },
  {
    key: "leadNumber",
    id: "leadNumber",
    header: "Lead #",
    label: "Lead #",
    accessor: (lead) => lead.leadNumber,
    type: "text",
  },
  {
    key: "startDate",
    id: "startDate",
    header: "Start Date",
    label: "Start Date",
    accessor: (lead) => formatDate(lead.startDate, { format: "medium" }),
    type: "text",
  },
  {
    key: "location",
    id: "location",
    header: "Location",
    label: "Location",
    accessor: (lead) => lead.location ?? "—",
    type: "text",
  },
  {
    key: "status",
    id: "status",
    header: "Status",
    label: "Status",
    accessor: (lead) => lead.status ?? "",
    type: "text",
    cellRenderer: (value, lead) => {
      if (!lead.status) return <span>—</span>;
      
      // Aplicar el mismo mapeo que en buildSections para consistencia
      const statusMapping: Record<string, string> = {
        "TO_DO": "Pending",
        "NEW": "Pending", // Ambos se mapean a Pending
        "IN_PROGRESS": "In Progress", 
        "DONE": "Completed",
        "LOST": "Lost",
        "UNDETERMINED": "Undetermined"
      };
      
      const backendStatus = String(value);
      const displayStatus = statusMapping[backendStatus] || backendStatus;
      
      return (
        <div className="flex justify-center">
          <StatusBadge status={displayStatus} />
        </div>
      );
    },
  },
  {
    key: "projectType",
    id: "projectType",
    header: "Project Type",
    label: "Project Type",
    accessor: (lead) => lead.projectType?.name ?? "N/A",
    type: "text",
    cellRenderer: (_value, lead) => (
      <ProjectTypeBadge
        projectType={{
          name: lead.projectType?.name ?? "N/A",
          color: lead.projectType?.color ?? "#BDBDBD",
        }}
      />
    ),
  },
  {
    key: "contact",
    id: "contact",
    header: "Contact Name",
    label: "Contact Name",
    accessor: (lead) => lead.contact?.name ?? "N/A",
    type: "text",
  },
];
