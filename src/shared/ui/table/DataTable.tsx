import React from "react"
import TableRoot from "./TableRoot";
import type { TableProps } from "@/types";
import { useSort } from "@/presentation";
import { TableBody, TableHeader } from ".";

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
