import React from "react"

import { useSort } from "@/presentation";
import type { TableProps } from "@/types";

import { TableBody, TableHeader } from ".";
import TableRoot from "./TableRoot";

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
