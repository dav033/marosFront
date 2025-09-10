import React from "react";
import Table from "@components/common/table/Table";
import { useLeadContextMenu } from "src/hooks/useLeadContextMenu";
import type { Lead } from "@/types";
import type { LeadSectionProps } from "../../../types/components/leads-contacts";

export default function LeadSection({
  title,
  data,
  columns,
  onEditLead,
  onDeleteLead,
}: LeadSectionProps) {
  const { getLeadContextOptions } = useLeadContextMenu({
    onEdit: onEditLead ? (lead: unknown) => onEditLead(lead as Lead) : undefined,
    onDelete: onDeleteLead ? (lead: unknown) => {
      const typedLead = lead as Lead;
      if (typedLead?.id != null) {
        onDeleteLead(typedLead);
      } else {
        console.error("Cannot delete lead: invalid or missing ID", lead);
      }
    } : undefined,
  });

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">
        {title} ({data.length})
      </h2>
      <Table
        columns={columns}
        data={data}
        contextMenuOptions={getLeadContextOptions}
      />
    </div>
  );
}
