// src/components/table/Table.tsx
import React from 'react';
import type { Column } from '../../types/types.ts';
import useSort from '../../hooks/useSortResult.tsx';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export default function Table<T extends object>({
  columns,
  data
}: TableProps<T>) {
  const { sortedData, sortColumn, sortDirection, onSort } = useSort(data, columns);

  return (
    // Agregamos text-[#EFEEEA] al contenedor para propagar el color
    <div className="overflow-x-auto shadow-md rounded-lg bg-[#000000] !text-[#EFEEEA] !table-aut ">
      {/* También lo añadimos al <table> para asegurar herencia */}
      <table className="min-w-full divide-y divide-[#273F4F] text-[#EFEEEA]">
        <TableHeader
          columns={columns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
        />
        <TableBody columns={columns} data={sortedData} />
      </table>
    </div>
  );
}
