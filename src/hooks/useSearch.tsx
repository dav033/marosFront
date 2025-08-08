import { useState, useMemo, useCallback } from "react";

export interface SearchFieldOption {
  value: string;
  label: string;
}

export interface SearchConfig<T> {
  searchableFields: SearchFieldOption[];
  caseSensitive?: boolean;
  searchType?: "includes" | "startsWith" | "exact";
  defaultField?: string;
}

export interface UseSearchResult<T> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedField: string;
  setSelectedField: (field: string) => void;
  filteredData: T[];
  clearSearch: () => void;
  hasActiveSearch: boolean;
  searchFields: SearchFieldOption[];
}

// Helper function to get nested property value
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}

export function useSearch<T extends Record<string, any>>(
  data: T[],
  config: SearchConfig<T>
): UseSearchResult<T> {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState(
    config.defaultField || config.searchableFields[0]?.value || ""
  );

  const filteredData = useMemo(() => {
    if (!searchTerm.trim() || !selectedField) {
      return data;
    }

    const searchValue = config.caseSensitive
      ? searchTerm.trim()
      : searchTerm.trim().toLowerCase();

    return data.filter((item) => {
      const fieldValue = selectedField.includes(".")
        ? getNestedValue(item, selectedField)
        : item[selectedField as keyof T];

      if (fieldValue == null) return false;

      const stringValue = config.caseSensitive
        ? String(fieldValue)
        : String(fieldValue).toLowerCase();

      switch (config.searchType) {
        case "startsWith":
          return stringValue.startsWith(searchValue);
        case "exact":
          return stringValue === searchValue;
        case "includes":
        default:
          return stringValue.includes(searchValue);
      }
    });
  }, [data, searchTerm, selectedField, config]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const hasActiveSearch = searchTerm.trim().length > 0;

  return {
    searchTerm,
    setSearchTerm,
    selectedField,
    setSelectedField,
    filteredData,
    clearSearch,
    hasActiveSearch,
    searchFields: config.searchableFields,
  };
}
