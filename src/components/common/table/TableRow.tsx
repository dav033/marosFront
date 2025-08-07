// src/components/table/TableRow.tsx

import React, { memo } from 'react';
import type { Column } from 'src/types/types';
import { ContextMenu, type ContextMenuOption } from '@components/common/ContextMenu';
import { useContextMenu } from '@components/common/ContextMenu';
import TableCell from './tableCell.tsx';

interface Props<T> {
  row: T;
  columns: Column<T>[];
  contextMenuOptions?: (row: T) => ContextMenuOption[];
  columnWidths?: string[];
}

function TableRow<T>({ row, columns, contextMenuOptions, columnWidths }: Props<T>) {
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();
  
  const getColumnWidth = (index: number) => {
    if (columnWidths && columnWidths[index]) {
      return columnWidths[index];
    }
    
    // Default widths for leads table (7 columns)
    const defaultWidths = [
      'w-1/5',    // NAME (20%)
      'w-[10%]',  // LEAD # (10%)
      'w-[12%]',  // START DATE (12%)
      'w-1/5',    // LOCATION (20%)
      'w-[12%]',  // STATUS (12%)
      'w-[15%]',  // PROJECT TYPE (15%)
      'w-[11%]'   // CONTACT NAME (11%)
    ];
    return defaultWidths[index] || 'w-auto';
  };

  return (
    <>
      <tr 
        className="hover:bg-theme-primary/10 h-auto"
        onContextMenu={contextMenuOptions ? showContextMenu : undefined}
      >
        {columns.map((col, index) => {
          const value = col.accessor(row);

          if (col.cellRenderer) {
            return (
              <td 
                key={col.id} 
                className={`px-3 py-3 text-sm text-theme-light whitespace-normal break-words ${getColumnWidth(index)}`}
              >
                <div className="whitespace-normal break-words">
                  {col.cellRenderer(value, row)}
                </div>
              </td>
            );
          }

          return (
            <TableCell
              key={col.id}
              value={value}
              type={col.type}
              className={getColumnWidth(index)}
            />
          );
        })}
      </tr>
      
      {contextMenuOptions && (
        <ContextMenu
          options={contextMenuOptions(row)}
          isVisible={contextMenu.isVisible}
          position={contextMenu.position}
          onClose={hideContextMenu}
        />
      )}
    </>
  );
}

export default memo(TableRow) as typeof TableRow;
