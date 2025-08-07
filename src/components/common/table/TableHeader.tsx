// src/components/table/TableHeader.tsx
import React, { memo } from "react";
import type { Column, SortDirection } from "../../../types/types.ts";

interface Props<T> {
  columns: Column<T>[];
  sortColumn: string | null;
  sortDirection: SortDirection;
  onSort: (columnId: string) => void;
  columnWidths?: string[];
}

function TableHeaderInner<T>({
  columns,
  sortColumn,
  sortDirection,
  onSort,
  columnWidths,
}: Props<T>) {
  
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
    <thead className="bg-theme-gray">
      <tr className="h-auto">
        {columns.map((col, index) => (
          <th
            key={col.id}
            onClick={() => onSort(col.id)}
            className={`
              px-3 py-3
              text-left text-[11px] uppercase tracking-wider
              text-theme-light
              cursor-pointer select-none
              font-normal
              whitespace-normal break-words
              ${getColumnWidth(index)}
            `}
          >
            <div className="flex items-center">
              <span className="whitespace-normal break-words">{col.header}</span>
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
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default memo(TableHeaderInner) as typeof TableHeaderInner;
