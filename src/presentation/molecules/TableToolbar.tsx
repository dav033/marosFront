import React, { useMemo } from "react";
import Button from "@/presentation/atoms/Button";
import { SearchBoxWithDropdown } from "./SearchBoxWithDropdown";
import type { SearchFieldOption } from "@/types";

export type TableToolbarProps = {
  onCreate?: () => void;
  createLabel?: string;
  // Search props
  searchTerm: string;
  onSearchChange: (v: string) => void;
  selectedField: string;
  onFieldChange: (v: string) => void;
  // OJO: aquí seguimos aceptando { value, label }
  searchFields: Array<{ value: string; label: string }>;
  onClearSearch: () => void;
  placeholder?: string;
  hasActiveSearch: boolean;
  resultCount: number;
  totalCount: number;
  rightSlot?: React.ReactNode;
};

const TableToolbar: React.FC<TableToolbarProps> = ({
  onCreate,
  createLabel = "Create",
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
  rightSlot,
}) => {
  // 🔧 Normalizar { value, label } -> { key, label } para SearchBoxWithDropdown
  const normalizedFields: SearchFieldOption[] = useMemo(
    () => searchFields.map((f) => ({ key: f.value, label: f.label })),
    [searchFields]
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-2">
        {onCreate && (
          <Button className="text-sm" onClick={onCreate}>
            {createLabel}
          </Button>
        )}
        {rightSlot}
      </div>

      <div className="flex-1 max-w-md">
        <SearchBoxWithDropdown
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          selectedField={selectedField}         // usa el mismo string (value) como key
          onFieldChange={onFieldChange}
          searchFields={normalizedFields}       // 👈 ya con { key, label }
          onClearSearch={onClearSearch}
          placeholder={placeholder}
          hasActiveSearch={hasActiveSearch}
          resultCount={resultCount}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
};

export default TableToolbar;
