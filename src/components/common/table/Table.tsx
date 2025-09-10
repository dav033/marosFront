// src/components/table/Table.tsx
import React from "react";
import type { Column, TableProps, ContextMenuOption } from "@/types";
import useSort from "../../../hooks/useSortResult";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

export default function Table<T extends object>({
  columns,
  data,
  contextMenuOptions,
  showRowSeparators = false,
  columnWidths,
}: TableProps<T>) {
  const { sortedData, sortColumn, sortDirection, onSort } = useSort(
    data,
    columns
  );

  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-theme-dark text-theme-light">
      <table className="w-full table-fixed custom-table text-theme-light">
        <TableHeader
          columns={columns}
          sortColumn={sortColumn || undefined}
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
      </table>
    </div>
  );
}
