// src/components/table/Table.tsx
import React from 'react';
import type { Column } from '../../../types/types.ts';
import type { ContextMenuOption } from '@components/common/ContextMenu';
import useSort from '../../../hooks/useSortResult.tsx';
import TableHeader from './TableHeader.tsx';
import TableBody from './TableBody.tsx';

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  contextMenuOptions?: (row: T) => ContextMenuOption[];
  showRowSeparators?: boolean;
  columnWidths?: string[];
}

export default function Table<T extends object>({
  columns,
  data,
  contextMenuOptions,
  showRowSeparators = false,
  columnWidths
}: TableProps<T>) {
  const { sortedData, sortColumn, sortDirection, onSort } = useSort(data, columns);

  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-theme-dark text-theme-light">
      <table className="w-full table-fixed custom-table text-theme-light">
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
      </table>
    </div>
  );
}
