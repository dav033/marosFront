// src/hooks/useSort.ts
import { useCallback, useMemo, useState } from "react";
import type { Column, SortDirection } from "@/types/components/table";

export default function useSort<T>(data: T[], columns: Column<T>[]) {
  const [sortColumn, setSortColumn] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const onSort = useCallback(
    (columnKey: string) => {
      setSortColumn((prev) => {
        if (prev === columnKey) {
          setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
          return prev;
        }
        setSortDirection("asc");
        return columnKey;
      });
    },
    [setSortColumn, setSortDirection]
  );

  const columnsByKey = useMemo(() => {
    const map = new Map<string, Column<T>>();
    columns.forEach((c) => {
      const key = c.id ?? String(c.key);
      map.set(key, c);
    });
    return map;
  }, [columns]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    const col = columnsByKey.get(sortColumn);
    if (!col) return data;

    const getValue = (row: T): unknown => {
      if (col.accessor) return col.accessor(row);
      return (row as any)[col.key as keyof T];
    };

    const copy = [...data];
    copy.sort((a, b) => {
      const va = getValue(a);
      const vb = getValue(b);

      // normaliza a string para comparación robusta
      const sa = va === null || va === undefined ? "" : String(va);
      const sb = vb === null || vb === undefined ? "" : String(vb);

      if (sa < sb) return sortDirection === "asc" ? -1 : 1;
      if (sa > sb) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, sortColumn, sortDirection, columnsByKey]);

  return { sortedData, sortColumn, sortDirection, onSort };
}
