// src/components/table/TableHeader.tsx
import React, { memo } from "react";
import type { Column, SortDirection } from "../../types/types.ts";

interface Props<T> {
  columns: Column<T>[];
  sortColumn: string | null;
  sortDirection: SortDirection;
  onSort: (columnId: string) => void;
}

function TableHeaderInner<T>({
  columns,
  sortColumn,
  sortDirection,
  onSort,
}: Props<T>) {
  return (
    <thead className="bg-[#273F4F]">
      <tr>
        {columns.map((col) => (
          <th
            key={col.id}
            onClick={() => onSort(col.id)}
            className="
              px-4 py-2
              text-left !text-[11px] uppercase tracking-wider
              text-[#EFEEEA]
              cursor-pointer select-none
              font-normal
            "
          >
            <div className="flex items-center">
              {col.header}
              {sortColumn === col.id && (
                <svg
                  className="ml-1 h-4 w-4 fill-[#FE7743]"
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
