import React, { memo } from "react";

import type { Column, TableHeaderProps } from "@/types";

import SortIcon from "./SortIcon";
import Th from "./Th";

function TableHeaderInner<T extends object>({
  columns,
  sortColumn,
  sortDirection,
  onSort,
  columnWidths,
}: TableHeaderProps<T>) {
  const onHeaderClick = (col: Column<T>) => {
    const key = col.id ?? String(col.key);
    onSort(key);
  };

  const onHeaderKeyDown = (e: React.KeyboardEvent, col: Column<T>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onHeaderClick(col);
    }
  };

  return (
    <thead className="bg-theme-dark sticky top-0 z-10">
      <tr>
        {columns.map((col) => {
          const key = col.id ?? String(col.key);
          const width = columnWidths?.[key] ?? col.width;
          const active = sortColumn === key;

          return (
            <Th
              key={key}
              {...(width ? { width } : {})}
              data-sort-direction={active ? sortDirection : undefined}
              data-active={active || undefined}
              role="button"
              tabIndex={0}
              onClick={() => onHeaderClick(col)}
              onKeyDown={(e) => onHeaderKeyDown(e, col)}
            >
              <div className="flex items-center justify-between">
                <span className="whitespace-normal break-words">
                  {col.header ?? col.label}
                </span>
                {active && sortDirection && <SortIcon dir={sortDirection} />}
              </div>
            </Th>
          );
        })}
      </tr>
    </thead>
  );
}

export default memo(TableHeaderInner) as <T extends object>(
  p: TableHeaderProps<T>
) => React.ReactElement;
