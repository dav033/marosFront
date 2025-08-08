import React from "react";
import Table from "@components/common/table/Table";
import { useLeadContextMenu } from "src/hooks/useLeadContextMenu";
import type { Column } from "src/types/types";
import type { Lead } from "src/types/types";

interface LeadSectionProps {
  title: string;
  data: Lead[];
  columns: Column<Lead>[];
  onEditLead?: (lead: Lead) => void;
  onDeleteLead?: (leadId: number) => void;
}

export default function LeadSection({
  title,
  data,
  columns,
  onEditLead,
  onDeleteLead,
}: LeadSectionProps) {
  const { getLeadContextOptions } = useLeadContextMenu({
    onEdit: onEditLead,
    onDelete: onDeleteLead,
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
