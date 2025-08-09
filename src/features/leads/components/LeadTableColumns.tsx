import React from "react";
import type { Column } from "src/types/types";
import StatusBadge from "@components/ui/StatusBadge";
import ProjectTypeBadge from "@components/ui/ProjectTypeBadge";
import { formatDate } from "@utils/dateHelpers";
import type { Lead } from "@/types";

export const leadTableColumns: Column<Lead>[] = [
  {
    id: "name",
    header: "Name",
    accessor: (lead) => lead.name,
    type: "string",
  },
  {
    id: "leadNumber",
    header: "Lead #",
    accessor: (lead) => lead.leadNumber,
    type: "string",
  },
  {
    id: "startDate",
    header: "Start Date",
    accessor: (lead) => formatDate(lead.startDate, { format: "medium" }),
    type: "string",
  },
  {
    id: "location",
    header: "Location",
    accessor: (lead) => lead.location ?? "—",
    type: "string",
  },
  {
    id: "status",
    header: "Status",
    accessor: (lead) => lead.status ?? "",
    type: "string",
    cellRenderer: (value) => <StatusBadge status={String(value)} />,
  },
  {
    id: "projectType",
    header: "Project Type",
    accessor: (lead) => lead.projectType?.name || "N/A",
    type: "string",
    cellRenderer: (_value, lead) => (
      <ProjectTypeBadge projectType={lead.projectType} />
    ),
  },
  {
    id: "contact",
    header: "Contact Name",
    accessor: (lead) => lead.contact?.name || "N/A",
    type: "string",
  },
];
