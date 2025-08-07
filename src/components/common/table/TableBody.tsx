// src/components/table/TableBody.tsx
import React, { memo } from 'react';
import type { Column } from '../../../types/types.ts';
import type { ContextMenuOption } from '@components/common/ContextMenu';
import TableRow from './TableRow.tsx';

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  contextMenuOptions?: (row: T) => ContextMenuOption[];
  showRowSeparators?: boolean;
  columnWidths?: string[];
}

function TableBodyInner<T>({ columns, data, contextMenuOptions, showRowSeparators = false, columnWidths }: Props<T>) {
  return (
    <tbody className="bg-theme-dark">
      {data.map((row, idx) => (
        <React.Fragment key={idx}>
          <TableRow 
            row={row} 
            columns={columns} 
            contextMenuOptions={contextMenuOptions}
            columnWidths={columnWidths}
          />
          {showRowSeparators && idx < data.length - 1 && (
            <tr>
              <td colSpan={columns.length} className="px-0 py-0">
                <div className="border-b border-gray-600 mx-3"></div>
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </tbody>
  );
}

export default memo(TableBodyInner) as typeof TableBodyInner;
