// src/components/table/TableBody.tsx
import React, { memo } from 'react';
import type { Column } from '../../types/types.ts';
import TableRow from './TableRow';

interface Props<T> {
  columns: Column<T>[];
  data: T[];
}

function TableBodyInner<T>({ columns, data }: Props<T>) {
  return (
    <tbody className="bg-[#000000] divide-y divide-[#273F4F]">
      {data.map((row, idx) => (
        <TableRow key={idx} row={row} columns={columns} />
      ))}
    </tbody>
  );
}

export default memo(TableBodyInner) as typeof TableBodyInner;
