// src/types/hooks/search.ts

import type { Contacts, Lead } from "../domain";

// ===========================================
// SEARCH HOOK TYPES
// ===========================================

export interface SearchFieldOption {
  key: string;
  label: string;
  type?: "text" | "date" | "select" | "number";
  options?: Array<{ value: string | number; label: string }>;
}

export interface SearchConfig<T> {
  fields: SearchFieldOption[];
  searchableFields?: SearchFieldOption[]; // Legacy property for compatibility
  defaultField?: string;
  placeholder?: string;
  debounceMs?: number;
  caseSensitive?: boolean;
  searchType?: string; // Add this for compatibility
  searchFunction?: (items: T[], query: string, field: string) => T[];
}

export interface SearchState {
  query: string;
  field: string;
  isSearching: boolean;
}

export interface SearchActions {
  setQuery: (query: string) => void;
  setField: (field: string) => void;
  clearSearch: () => void;
  performSearch: () => void;
}

export interface UseSearchResult<T> {
  results: T[];
  loading: boolean;
  error: string | null;
  state: SearchState;
  actions: SearchActions;
  hasResults: boolean;
  totalResults: number;
  
  // Legacy properties for compatibility
  searchTerm: string;
  selectedField: string;
  filteredData: T[];
  searchFields: SearchFieldOption[];
  hasActiveSearch: boolean;
  setSearchTerm: (term: string) => void;
  setSelectedField: (field: string) => void;
  clearSearch: () => void;
}

// Specific search configurations
export interface ContactSearchConfig extends SearchConfig<Contacts> {
  includeInactive?: boolean;
}

export interface LeadSearchConfig extends SearchConfig<Lead> {
  statusFilters?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
}
