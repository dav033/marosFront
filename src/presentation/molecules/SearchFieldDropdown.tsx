import React from "react";

import type { SearchFieldOption } from "@/types";

type Props = {
  selectedField: string;
  onFieldChange: (key: string) => void;
  searchFields: SearchFieldOption[];
  className?: string;
};

const SearchFieldDropdown: React.FC<Props> = ({
  selectedField,
  onFieldChange,
  searchFields,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={selectedField}
        onChange={(e) => onFieldChange(e.target.value)}
        className="appearance-none bg-theme-gray-subtle border border-theme-gray-subtle border-r-0 rounded-l-md px-3 py-2 text-sm text-theme-light focus:outline-none focus:ring-1 focus:ring-theme-primary focus:border-theme-primary cursor-pointer min-w-[140px]"
      >
        {searchFields.map((field) => (
          <option
            key={field.key}
            value={field.key}
            className="bg-theme-gray-subtle text-theme-light"
          >
            {field.label}
          </option>
        ))}
      </select>

      {/* Chevron */}
      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
        <svg
          className="h-4 w-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchFieldDropdown;
