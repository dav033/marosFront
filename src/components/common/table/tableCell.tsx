import React, { memo } from "react";
import type { TableCellProps } from "../../../types/components/table";

function TableCellInner({ value, type, className = "" }: TableCellProps) {
  return (
    <td
      className={`
        px-3 py-3
        text-sm
        text-theme-light
        whitespace-normal break-words
        h-auto
        ${type === "number" ? "text-right" : "text-left"}
        ${className}
      `}
    >
      <div className="whitespace-normal break-words">{value}</div>
    </td>
  );
}

export default memo(TableCellInner) as typeof TableCellInner;
