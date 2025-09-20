// src/presentation/organisms/table/DataTable.tsx
import React from "react";
import type { TableProps } from "@/types/components/table";
import TableRoot from "@/presentation/atoms/table/TableRoot";
import TableHeader from "@/presentation/molecules/table/TableHeader";
import TableBody from "@/presentation/molecules/table/TableBody";
import useSort from "../hooks/useSort";

export default function DataTable<T extends object>({
  columns,
  data,
  contextMenuOptions,
  showRowSeparators = false,
  columnWidths,
  className = "",
}: TableProps<T>) {
  const { sortedData, sortColumn, sortDirection, onSort } = useSort<T>(data, columns);

  return (
    <TableRoot className={className}>
      <TableHeader
        columns={columns}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={onSort}
        columnWidths={columnWidths}
      />
      <TableBody
        columns={columns}
        data={sortedData}
        contextMenuOptions={contextMenuOptions}
        showRowSeparators={showRowSeparators}
        columnWidths={columnWidths}
      />
    </TableRoot>
  );
}
