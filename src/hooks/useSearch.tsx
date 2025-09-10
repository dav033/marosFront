import { useState, useMemo, useCallback } from "react";
import type { SearchFieldOption, SearchConfig, UseSearchResult } from "@/types";

// Helper function to get nested property value
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function useSearch<T extends Record<string, unknown>>(
  data: T[],
  config: SearchConfig<T>
): UseSearchResult<T> {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState(
    config.defaultField || config.searchableFields?.[0]?.key || ""
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
    results: filteredData,
    loading: false,
    error: null,
    state: {
      query: searchTerm,
      field: selectedField,
      isSearching: false,
    },
    actions: {
      setQuery: setSearchTerm,
      setField: setSelectedField,
      clearSearch,
      performSearch: () => {}, // No-op since we filter in real-time
    },
    hasResults: filteredData.length > 0,
    totalResults: filteredData.length,
    
    // Legacy properties for compatibility
    searchTerm,
    setSearchTerm,
    selectedField,
    setSelectedField,
    filteredData,
    clearSearch,
    hasActiveSearch,
    searchFields: config.searchableFields || [],
  };
}
