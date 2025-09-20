// src/presentation/organisms/leads/LeadSection.tsx
import React from "react";
import DataTable from "@/presentation/organisms/DataTable";
import type { Column } from "@/types/components/table";
import type { Lead } from "@/features/leads/domain/models/Lead";
import { useLeadContextMenu } from "@/hooks/useLeadContextMenu";
import type { ContextMenuOption as CMOption } from "@/types/hooks/context-menu";

export type LeadSectionProps = {
  title: string;
  data: Lead[];
  columns: Column<Lead>[];
  onEditLead?: (lead: Lead) => void;
  onDeleteLead?: (lead: Lead) => void;
  className?: string;
};

// Adaptador → convierte opciones provenientes de la UI (que usan id: string | number)
// al tipo canónico de la app (id: string) definido en src/types/hooks/context-menu
function toCMOption(option: any): CMOption {
  return {
    id: String(option?.id ?? ""),
    label: String(option?.label ?? ""),
    icon: option?.icon,
    separator: Boolean(option?.separator),
    disabled: Boolean(option?.disabled),
    danger: Boolean(option?.danger),
    action:
      typeof option?.action === "function"
        ? (option.action as () => void)
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
  const { getLeadContextOptions } = useLeadContextMenu<Lead>({
    onEdit: onEditLead,
    onDelete: onDeleteLead,
  });

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
        contextMenuOptions={(row) => getLeadContextOptions(row).map(toCMOption)}
        showRowSeparators
      />
    </section>
  );
}
