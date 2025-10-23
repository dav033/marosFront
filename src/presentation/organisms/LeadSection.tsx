import type { ReactNode } from "react";
import React from "react";

import { useLeadContextMenu } from "@/hooks";
import type { Lead } from "@/leads";
import type { Column } from "@/types";

import DataTable from "./DataTable";

export type LeadSectionProps = {
  title: string;
  data: Lead[];
  columns: Column<Lead>[];
  onEditLead?: (lead: Lead) => void;
  onDeleteLead?: (lead: Lead) => void;
  className?: string;
};
function toCMOption(option: unknown): any {
  const o = (option as Record<string, unknown>) ?? {};
  return {
    id: String(o["id"] ?? ""),
    label: String(o["label"] ?? ""),
    icon: o["icon"] as ReactNode,
    separator: Boolean(o["separator"]),
    disabled: Boolean(o["disabled"]),
    danger: Boolean(o["danger"]),
    action:
      typeof o["action"] === "function"
        ? (o["action"] as () => void)
        : () => {},
  };
}

export default function LeadSection({
  title,
  data,
  columns,
  onEditLead,
  onDeleteLead,
  className = "",
}: LeadSectionProps) {
  const leadMenuOpts: Parameters<typeof useLeadContextMenu<Lead>>[0] = {};
  if (onEditLead) leadMenuOpts.onEdit = onEditLead;
  if (onDeleteLead) leadMenuOpts.onDelete = onDeleteLead;

  const { getLeadContextOptions } = useLeadContextMenu<Lead>(leadMenuOpts);

  return (
    <section className={`space-y-2 ${className}`}>
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {title} <span className="text-gray-500">({data.length})</span>
        </h2>
      </header>

      <DataTable<Lead>
        columns={columns}
        data={data}
        contextMenuOptions={(row: Lead) =>
          getLeadContextOptions(row).map(toCMOption)
        }
        showRowSeparators
      />
    </section>
  );
}
