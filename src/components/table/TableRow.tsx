// src/components/table/TableRow.tsx

import React, { memo } from 'react';
import type { Column } from 'src/types/types';
import TableCell from './tableCell.tsx';

interface Props<T> {
  row: T;
  columns: Column<T>[];
}

function TableRow<T>({ row, columns }: Props<T>) {
  return (
    <tr className="hover:bg-[#FE7743]/10">
      {columns.map(col => {
        const value = col.accessor(row);

        if (col.cellRenderer) {
          return (
            <td key={col.id} className="p-2">
              {col.cellRenderer(value, row)}
            </td>
          );
        }

        return (
          <TableCell
            key={col.id}
            value={value}
            type={col.type}
          />
        );
      })}
    </tr>
  );
}

export default memo(TableRow) as typeof TableRow;
