import React from "react";
import type { Column } from "@/types";
import StatusBadge from "@components/ui/StatusBadge";
import ProjectTypeBadge from "@components/ui/ProjectTypeBadge";
import { formatDate } from "@utils/dateHelpers";
import type { Lead } from "@/types";

export const leadTableColumns: Column<Lead>[] = [
  {
    key: "name",
    label: "Name",
    id: "name",
    header: "Name",
    accessor: (lead) => lead.name,
    type: "string",
  },
  {
    key: "leadNumber",
    label: "Lead #",
    id: "leadNumber",
    header: "Lead #",
    accessor: (lead) => lead.leadNumber,
    type: "string",
  },
  {
    key: "startDate",
    label: "Start Date",
    id: "startDate",
    header: "Start Date",
    accessor: (lead) => formatDate(lead.startDate, { format: "medium" }),
    type: "string",
  },
  {
    key: "location",
    label: "Location",
    id: "location",
    header: "Location",
    accessor: (lead) => lead.location ?? "—",
    type: "string",
  },
  {
    key: "status",
    label: "Status",
    id: "status",
    header: "Status",
    accessor: (lead) => lead.status ?? "",
    type: "string",
    cellRenderer: (value, lead) => {
      // For Undetermined items (status is null/undefined), render nothing
      if (!lead.status) return null;
      return <StatusBadge status={String(value)} />;
    },
  },
  {
    key: "projectType",
    label: "Project Type",
    id: "projectType",
    header: "Project Type",
    accessor: (lead) => lead.projectType?.name || "N/A",
    type: "string",
    cellRenderer: (_value, lead) => (
      <ProjectTypeBadge projectType={lead.projectType} />
    ),
  },
  {
    key: "contact",
    label: "Contact Name",
    id: "contact",
    header: "Contact Name",
    accessor: (lead) => lead.contact?.name || "N/A",
    type: "string",
  },
];
