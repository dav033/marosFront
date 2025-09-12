// src/components/table/TableRow.tsx

import React, { memo } from "react";
import type { TableRowProps } from "../../../types/components/table";
import {
  ContextMenu,
} from "@components/common/ContextMenu";
import { useContextMenu } from "@components/common/ContextMenu";

function TableRow<T>({
  row,
  columns,
  contextMenuOptions,
}: TableRowProps<T>) {
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  // No longer needed: getColumnWidth

  // CSS Grid: set gridTemplateColumns from columns
  const gridTemplateColumns = columns
    .map(col => col.width ? col.width : 'minmax(120px,1fr)')
    .join(' ');

  return (
    <>
      <tr
        className="hover:bg-theme-primary/10 h-auto"
        onContextMenu={contextMenuOptions ? showContextMenu : undefined}
      >
        <td colSpan={columns.length} style={{ padding: 0, border: 'none' }}>
          <div
            className="w-full"
            style={{
              display: 'grid',
              gridTemplateColumns,
            }}
          >
            {columns.map((col) => {
              const value = col.accessor ? col.accessor(row) : row[col.key];
              if (col.cellRenderer) {
                return (
                  <div
                    key={col.id || String(col.key)}
                    className="px-3 py-3 text-sm text-theme-light whitespace-normal break-words"
                    style={{ minWidth: 0 }}
                  >
                    <div className="whitespace-normal break-words">
                      {col.cellRenderer(value, row)}
                    </div>
                  </div>
                );
              }
              // Default cell
              return (
                <div
                  key={col.id || String(col.key)}
                  className="px-3 py-3 text-sm text-theme-light whitespace-normal break-words"
                  style={{ minWidth: 0 }}
                >
                  {String(value ?? '')}
                </div>
              );
            })}
          </div>
          {/* El menú contextual se renderiza fuera del <tr> */}
        </td>
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
