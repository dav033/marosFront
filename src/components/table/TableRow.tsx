// src/components/table/TableRow.tsx
import React, { memo } from 'react';
import type { Column } from '../../types/types.ts';
import TableCell from './tableCell.tsx';

interface Props<T> {
  row: T;
  columns: Column<T>[];
}

function TableRow<T>({ row, columns }: Props<T>) {
  return (
    <tr className="hover:bg-[#FE7743]/10">
      {columns.map(col => (
        <TableCell
          key={col.id}
          value={col.accessor(row)}
          type={col.type}
        />
      ))}
    </tr>
  );
}

export default memo(TableRow) as typeof TableRow;
