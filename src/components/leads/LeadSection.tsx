// src/components/interactive/LeadSection.tsx
import React from "react";
import Table from "../table/Table";
import type { Column } from "src/types/types";
import type { Lead } from "src/types/types";

interface LeadSectionProps {
  title: string;
  data: Lead[];
  columns: Column<Lead>[];
}

export default function LeadSection({
  title,
  data,
  columns,
}: LeadSectionProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">
        {title} ({data.length})
      </h2>
      <Table columns={columns} data={data} />
    </div>
  );
}
