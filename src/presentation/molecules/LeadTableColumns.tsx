/* eslint-env browser */
import React from "react";

import type { Lead } from "@/leads";
import { ProjectTypeBadge, StatusBadge } from "@/presentation";
import type { Column } from "@/types";
import { formatDate } from "@/utils";

export const leadTableColumns: Column<Lead>[] = [
  {
    key: "name",
    id: "name",
    header: "Name",
    label: "Name",
    accessor: (lead) => lead.name, // ← muestra exclusivamente el nombre del LEAD
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
    accessor: (lead) => lead.startDate, // ISO para ordenar bien
    type: "text",
    cellRenderer: (v) => formatDate(String(v), { format: "medium" }),
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
      const statusMapping: Record<string, string> = {
        TO_DO: "Pending",
        NEW: "Pending",
        IN_PROGRESS: "In Progress",
        DONE: "Completed",
        LOST: "Lost",
        UNDETERMINED: "Undetermined",
      };
      const backendStatus = String(value);
      const displayStatus = statusMapping[backendStatus] || backendStatus;
      return (
        <div className="flex justify-center">
          <StatusBadge status={displayStatus} size="md" />
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
    accessor: (lead) => lead.contact?.name ?? "—",
    type: "text",
  },
];
