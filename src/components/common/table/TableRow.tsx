// src/components/table/TableRow.tsx

import React, { memo } from "react";
import type { Column } from "src/types/types";
import {
  ContextMenu,
  type ContextMenuOption,
} from "@components/common/ContextMenu";
import { useContextMenu } from "@components/common/ContextMenu";
import TableCell from "./TableCell";

interface Props<T> {
  row: T;
  columns: Column<T>[];
  contextMenuOptions?: (row: T) => ContextMenuOption[];
  // columns now can have width prop
}

function TableRow<T>({
  row,
  columns,
  contextMenuOptions,
}: Props<T>) {
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
              const value = col.accessor(row);
              if (col.cellRenderer) {
                return (
                  <div
                    key={col.id}
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
                  key={col.id}
                  className="px-3 py-3 text-sm text-theme-light whitespace-normal break-words"
                  style={{ minWidth: 0 }}
                >
                  {value}
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
