import React from "react";

type Props = React.ThHTMLAttributes<HTMLTableCellElement> & {
  width?: string;
  active?: boolean;
  sortDirection?: "asc" | "desc";
};

export default function Th({
  children,
  width,
  active,
  sortDirection,
  className = "",
  ...rest
}: Props) {
  return (
    <th
      className={`px-4 py-3 text-left text-sm font-medium text-theme-light uppercase tracking-wider border-b border-theme-accent/20 cursor-pointer hover:bg-theme-accent/10 ${className}`}
      style={{ width }}
      aria-sort={active ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
      {...rest}
    >
      {children}
    </th>
  );
}
