// src/components/table/TableHeader.tsx
/**
 * Tabla genérica con soporte para anchos de columna por prop y CSS Grid.
 *
 * Para definir anchos, usa:
 * columns: [
 *   { id: 'name', header: 'Nombre', accessor: ..., type: 'string', width: '200px' },
 *   { id: 'email', header: 'Email', accessor: ..., type: 'string', width: 'minmax(120px,1fr)' },
 *   ...
 * ]
 * Si no se define width, usa minmax(120px,1fr) por defecto.
 */
import React, { memo } from "react";
import type { Column, SortDirection } from "../../../types/types.ts";

interface Props<T> {
  columns: Column<T>[];
  sortColumn: string | null;
  sortDirection: SortDirection;
  onSort: (columnId: string) => void;
}

function TableHeaderInner<T>(props: Props<T>) {
  const { columns, sortColumn, sortDirection, onSort } = props;
  // CSS Grid: set gridTemplateColumns from columns[].width only
  const gridTemplateColumns = columns
    .map(col => col.width ? col.width : 'minmax(120px,1fr)')
    .join(' ');

  return (
    <thead className="bg-theme-gray">
      <tr className="h-auto">
        <th colSpan={columns.length} style={{ padding: 0, border: 'none' }}>
          <div
            className="w-full"
            style={{
              display: 'grid',
              gridTemplateColumns,
            }}
          >
            {columns.map((col) => (
              <div
                key={col.id}
                onClick={() => onSort(col.id)}
                className="px-3 py-3 text-left text-[11px] uppercase tracking-wider text-theme-light cursor-pointer select-none font-normal whitespace-normal break-words flex items-center"
                style={{ minWidth: 0 }}
              >
                <span className="whitespace-normal break-words">
                  {col.header}
                </span>
                {sortColumn === col.id && (
                  <svg
                    className="ml-1 h-4 w-4 fill-[#FE7743] flex-shrink-0"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {sortDirection === "asc" ? (
                      <path d="M7 14l5-5 5 5H7z" />
                    ) : (
                      <path d="M7 10l5 5 5-5H7z" />
                    )}
                  </svg>
                )}
              </div>
            ))}
          </div>
        </th>
      </tr>
    </thead>
  );
}

const MemoizedTableHeader: React.FC<any> = memo(TableHeaderInner);
export default MemoizedTableHeader;
