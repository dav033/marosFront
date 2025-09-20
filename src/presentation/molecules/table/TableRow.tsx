// src/presentation/molecules/table/TableRow.tsx
import React, { memo } from "react";
import type { TableRowProps } from "@/types/components/table";
import { useContextMenu } from "@/presentation/hooks/useContextMenu";
import { ContextMenu } from "../ContextMenu";
// Mantén tus hooks/componentes de menú contextual externos:

function TableRowInner<T>({
  row,
  columns,
  contextMenuOptions,
}: TableRowProps<T>) {
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  const gridTemplateColumns = columns
    .map((c) => (c.width ? c.width : "minmax(120px,1fr)"))
    .join(" ");

  return (
    <>
      <tr
        className="hover:bg-theme-primary/10 h-auto"
        onContextMenu={contextMenuOptions ? showContextMenu : undefined}
      >
        <td colSpan={columns.length} style={{ padding: 0, border: "none" }}>
          <div
            className="w-full"
            style={{ display: "grid", gridTemplateColumns, minWidth: 0 }}
            role="row"
          >
            {columns.map((col) => {
              const key = col.id ?? String(col.key);

              const raw = col.accessor
                ? col.accessor(row)
                : (row as any)[col.key as keyof T];
              const content = col.cellRenderer
                ? col.cellRenderer(raw, row)
                : String(raw ?? "");
              return (
                <div
                  key={key}
                  className={`px-3 py-3 text-sm text-theme-light whitespace-normal break-words ${
                    col.type === "number" ? "text-right" : "text-left"
                  }`}
                  style={{ minWidth: 0 }}
                  role="cell"
                >
                  {content}
                </div>
              );
            })}
          </div>
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

export default memo(TableRowInner) as typeof TableRowInner;
