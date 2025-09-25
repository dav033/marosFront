import { useCallback,useMemo, useState } from "react";

import type { Column, SortConfig } from "@/types";

export default function useSort<T extends object>(
  data: T[],
  columns: Column<T>[]
) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);

  const onSort = useCallback((columnId: string) => {
    const column = columns.find((c) => c.id === columnId || String(c.key) === columnId);
    if (!column) return;
    
    setSortConfig((prev: SortConfig<T> | null) => {
      const key = column.key;
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return {
        key,
        direction: "asc",
      };
    });
  }, [columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    
    const { key, direction } = sortConfig;
    const column = columns.find((c) => c.key === key);
    if (!column) return data;
    
    return [...data].sort((a, b) => {
      let aVal: unknown;
      let bVal: unknown;
      
      if (column.accessor) {
        aVal = column.accessor(a);
        bVal = column.accessor(b);
      } else {
        aVal = a[key];
        bVal = b[key];
      }
      
      let diff = 0;
      if (column.type === "number") {
        diff = Number(aVal || 0) - Number(bVal || 0);
      } else {
        diff = String(aVal || "").localeCompare(String(bVal || ""));
      }
      return direction === "asc" ? diff : -diff;
    });
  }, [data, sortConfig, columns]);

  return {
    sortedData,
    sortColumn: sortConfig ? String(sortConfig.key) : null,
    sortDirection: sortConfig?.direction || "asc",
    onSort,
  };
}
