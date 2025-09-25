// src/presentation/molecules/table/TableBody.tsx
import React, { memo } from "react";

import SeparatorRow from "@/presentation/atoms/table/SeparatorRow";
import type { TableBodyProps } from "@/types/components/table";

import TableRow from "./TableRow";

function TableBodyInner<T>({
  columns,
  data,
  contextMenuOptions,
  showRowSeparators = false,
}: TableBodyProps<T>) {
  return (
    <tbody className="bg-theme-dark">
      {data.map((row, idx) => (
        <React.Fragment key={idx}>
          <TableRow row={row} columns={columns} contextMenuOptions={contextMenuOptions} />
          {showRowSeparators && idx < data.length - 1 && (
            <SeparatorRow colSpan={columns.length} />
          )}
        </React.Fragment>
      ))}
    </tbody>
  );
}

export default memo(TableBodyInner) as typeof TableBodyInner;
