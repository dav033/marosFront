// src/components/common/SearchBoxWithDropdown.tsx
import React from "react";

type SearchFieldOption = { key: string; label: string };

type Props = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedField: string;
  onFieldChange: (key: string) => void;
  searchFields: SearchFieldOption[];
  onClearSearch: () => void;
  placeholder?: string;
  hasActiveSearch?: boolean;
  resultCount?: number;
  totalCount?: number;
};

export function SearchBoxWithDropdown({
  searchTerm,
  onSearchChange,
  selectedField,
  onFieldChange,
  searchFields,
  onClearSearch,
  placeholder,
  hasActiveSearch,
  resultCount,
  totalCount,
}: Props) {
  return (
    <div className="flex gap-2 items-center">
      <select
        value={selectedField}
        onChange={(e) => onFieldChange(e.target.value)}
        className="px-2 py-1 rounded bg-neutral-800 text-white"
      >
        {searchFields.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.label}
          </option>
        ))}
      </select>

      <input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 rounded bg-neutral-800 text-white"
      />

      {hasActiveSearch && (
        <button onClick={onClearSearch} className="px-2 py-1 text-sm">
          Clear
        </button>
      )}

      {typeof resultCount === "number" && typeof totalCount === "number" && (
        <span className="text-xs opacity-70">
          {resultCount}/{totalCount}
        </span>
      )}
    </div>
  );
}
