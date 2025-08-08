import { useState, useMemo, useCallback } from "react";
import type { Column, SortDirection } from "../types/types";

interface SortConfig {
  columnId: string | null;
  direction: SortDirection;
}

export default function useSort<T extends object>(
  data: T[],
  columns: Column<T>[]
) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    columnId: null,
    direction: "asc",
  });

  const onSort = useCallback((columnId: string) => {
    setSortConfig((prev) => ({
      columnId,
      direction:
        prev.columnId === columnId
          ? prev.direction === "asc"
            ? "desc"
            : "asc"
          : "asc",
    }));
  }, []);

  const sortedData = useMemo(() => {
    const { columnId, direction } = sortConfig;
    if (!columnId) return data;
    const col = columns.find((c) => c.id === columnId)!;
    return [...data].sort((a, b) => {
      const aVal = col.accessor(a);
      const bVal = col.accessor(b);
      let diff = 0;
      if (col.type === "number") {
        diff = Number(aVal) - Number(bVal);
      } else {
        diff = String(aVal).localeCompare(String(bVal));
      }
      return direction === "asc" ? diff : -diff;
    });
  }, [data, sortConfig, columns]);

  return {
    sortedData,
    sortColumn: sortConfig.columnId,
    sortDirection: sortConfig.direction,
    onSort,
  };
}
