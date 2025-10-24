import React from "react";

import type { ProjectWithLeadView } from "@/project";
import type { Column } from "@/types";
import { DataTable } from "@/shared";

type Props = {
  projects: ProjectWithLeadView[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function ProjectPickerTable({ projects, selectedId, onSelect }: Props) {
  const columns = React.useMemo<Column<ProjectWithLeadView>[]>(() => {
    return [
      {
        id: "select",
        key: "id" as keyof ProjectWithLeadView,
        label: "",
        width: "40px",
        cellRenderer: (_value, item) => (
          <input
            type="radio"
            name="projectPicker"
            aria-label={`select project ${item.id}`}
            checked={selectedId === item.id}
            onChange={() => onSelect(item.id)}
          />
        ),
      },
      {
        key: "leadNumber" as keyof ProjectWithLeadView,
        label: "Lead #",
        width: "120px",
        type: "string",
        accessor: (p) => p.leadNumber ?? "",
      },
      {
        key: "projectName" as keyof ProjectWithLeadView,
        label: "Project name",
        accessor: (p) => p.projectName ?? "",
      },
      {
        key: "location" as keyof ProjectWithLeadView,
        label: "Location",
        accessor: (p) => p.location ?? p.leadName ?? "",
      },
      {
        key: "contactName" as keyof ProjectWithLeadView,
        label: "Contact name",
        accessor: (p) => p.contactName ?? "",
      },
      {
        key: "customerName" as keyof ProjectWithLeadView,
        label: "Client name",
        accessor: (p) => p.customerName ?? "",
      },
    ];
  }, [onSelect, selectedId]);

  return (
    <div className="rounded-2xl border border-theme-gray-subtle">
      <DataTable<ProjectWithLeadView>
        columns={columns}
        data={projects}
        showRowSeparators
        className="rounded-2xl"
      />
    </div>
  );
}
