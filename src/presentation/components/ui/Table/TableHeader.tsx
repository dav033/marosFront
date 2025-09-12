// src/components/table/TableHeader.tsx
import React, { memo } from "react";
import type { TableHeaderProps, Column } from "../../../types/components/table";

function TableHeaderInner<T extends object>({
  columns,
  sortColumn,
  sortDirection,
  onSort,
  columnWidths,
}: TableHeaderProps<T>) {
  const handleHeaderClick = (col: Column<T>) => {
    const columnKey = col.id || String(col.key);
    onSort(columnKey);
  };

  const handleKeyDown = (event: React.KeyboardEvent, col: Column<T>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleHeaderClick(col);
    }
  };

  return (
    <thead className="bg-theme-dark sticky top-0 z-10">
      <tr>
        {columns.map((col, index) => {
          const columnKey = col.id || String(col.key);
          const width = columnWidths?.[columnKey];
          
          return (
            <th
              key={columnKey}
              className="px-4 py-3 text-left text-sm font-medium text-theme-light uppercase tracking-wider border-b border-theme-accent/20 cursor-pointer hover:bg-theme-accent/10"
              style={{ width }}
              onClick={() => handleHeaderClick(col)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => handleKeyDown(event, col)}
            >
              <div className="flex items-center justify-between">
                <span className="whitespace-normal break-words">
                  {col.header || col.label}
                </span>
                {sortColumn === columnKey && (
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
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

const MemoizedTableHeader = memo(TableHeaderInner) as <T>(props: TableHeaderProps<T>) => React.ReactElement;
export default MemoizedTableHeader;