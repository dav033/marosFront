// src/hooks/useSearch.ts
import { useMemo, useState } from "react";

/** Un campo de búsqueda: por key segura de T o por accessor opcional */
export type SearchField<T> = {
  key: keyof T & string;
  label: string;
  accessor?: (row: T) => string | number | null | undefined;
};

export type SearchConfig<T> = {
  fields: Array<SearchField<T>>;
  defaultField: SearchField<T>["key"];
  normalize?: (txt: string) => string; // p.ej. (s) => s.toLowerCase().trim()
};

export type SearchFieldOption<K extends string = string> = {
  key: K;
  label: string;
};

export function useSearch<T extends object>(items: T[], config: SearchConfig<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] =
    useState<SearchField<T>["key"]>(config.defaultField);

  const filteredData = useMemo(() => {
    const norm = config.normalize ?? ((s: string) => s.toLowerCase().trim());
    const term = norm(searchTerm);
    if (!term) return items;

    const fieldDef = config.fields.find((f) => f.key === selectedField);
    if (!fieldDef) return items;

    return items.filter((row) => {
      const raw = fieldDef.accessor ? fieldDef.accessor(row) : (row as any)[fieldDef.key];
      const val = String(raw ?? "").toLowerCase();
      return val.includes(term);
    });
  }, [items, searchTerm, selectedField, config]);

  // ⬇️ ahora devolvemos { key, label } para el dropdown
  const searchFields: SearchFieldOption<SearchField<T>["key"]>[] = useMemo(
    () => config.fields.map((f) => ({ key: f.key, label: f.label })),
    [config.fields]
  );

  const hasActiveSearch = searchTerm.trim().length > 0;
  const clearSearch = () => setSearchTerm("");

  return {
    searchTerm,
    setSearchTerm,
    selectedField,
    setSelectedField,
    filteredData,
    searchFields,
    hasActiveSearch,
    clearSearch,
  };
}
