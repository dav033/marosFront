import { useEffect, useMemo, useState } from "react";

export type SearchField<T> = {
  key: keyof T | string;
  label: string;
    accessor?: (row: T) => string | number | null | undefined;
    searchable?: boolean; // default: true
};

export type SearchConfig<T> = {
  fields: Array<SearchField<T>>;
    defaultField?: keyof T | string;
    placeholder?: string;
    debounceMs?: number; // default: 200
    normalize?: (s: string) => string;
};

export type AnyField<T> = "*" | (keyof T | string);

export type UseSearchState<T> = {
  searchTerm: string;
  setSearchTerm: (v: string) => void;

  selectedField: AnyField<T>;
  setSelectedField: (f: AnyField<T>) => void;

    filteredData: T[];
    searchFields: Array<{ value: AnyField<T>; label: string }>;

  hasActiveSearch: boolean;
  clearSearch: () => void;
};

/* ========================================= */
/* Utilidades internas                       */
/* ========================================= */

function defaultNormalize(s: string) {
  return (s ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getFieldValue<T>(row: T, field: SearchField<T>): string {
  const raw =
    typeof field.accessor === "function"
      ? field.accessor(row)
      : (row as any)[field.key as any];
  return raw == null ? "" : String(raw);
}

function useDebouncedValue<T>(value: T, delay = 200) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/* ========================================= */
/* Hook principal                            */
/* ========================================= */

export function useSearch<T>(items: T[], config: SearchConfig<T>): UseSearchState<T> {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState<AnyField<T>>(
    (config.defaultField as AnyField<T>) ?? "*"
  );

  const normalize = config.normalize ?? defaultNormalize;
  const debounced = useDebouncedValue(searchTerm, config.debounceMs ?? 200);

  const visibleFields = useMemo(
    () => config.fields.filter((f) => f.searchable !== false),
    [config.fields]
  );

  const searchFields = useMemo(
    () =>
      [
        { value: "*" as AnyField<T>, label: "All fields" },
        ...visibleFields.map((f) => ({ value: f.key as AnyField<T>, label: f.label }))
      ],
    [visibleFields]
  );

  const hasActiveSearch = debounced.trim().length > 0;

  const filteredData = useMemo(() => {
    if (!hasActiveSearch) return items;
    const q = normalize(debounced);

    const fieldsToCheck: SearchField<T>[] =
      selectedField === "*"
        ? visibleFields
        : visibleFields.filter((f) => String(f.key) === String(selectedField));

    if (fieldsToCheck.length === 0) return items;

    return items.filter((row) =>
      fieldsToCheck.some((f) => normalize(getFieldValue(row, f)).includes(q))
    );
  }, [items, hasActiveSearch, debounced, selectedField, visibleFields, normalize]);

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedField((config.defaultField as AnyField<T>) ?? "*");
  };

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

export default useSearch;
