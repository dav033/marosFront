import React from "react";

type Props = {
  visible: boolean;
  resultCount?: number;
  totalCount?: number;
  term?: string;
  fieldLabel?: string;
  className?: string;
};

const SearchResultsSummary: React.FC<Props> = ({
  visible,
  resultCount,
  totalCount,
  term,
  fieldLabel,
  className = "",
}) => {
  if (!visible || resultCount === undefined || totalCount === undefined) return null;

  return (
    <div className={`text-sm text-gray-400 ${className}`}>
      Showing {resultCount} of {totalCount} results
      {term && (
        <span className="text-gray-500 ml-2">
          for "{term}"{fieldLabel ? ` in ${fieldLabel}` : ""}
        </span>
      )}
      {resultCount === 0 && (
        <span className="text-gray-500 ml-2">- No results found</span>
      )}
    </div>
  );
};

export default SearchResultsSummary;
