import React, { memo } from "react";

import type { TableBodyProps } from "@/types";

import { TableRow } from ".";
import SeparatorRow from "./SeparatorRow";

function TableBodyInner<T>({
  columns,
  data,
  contextMenuOptions,
  showRowSeparators = false,
}: TableBodyProps<T>) {
  return (
    <tbody className="bg-theme-dark">
      {data.map((row, idx) => {
        const key =
          (row as any)?.id ??
          (row as any)?.leadNumber ??
          (row as any)?.name ??
          `row-${idx}`;
        return (
          <React.Fragment key={key}>
            <TableRow row={row} columns={columns} contextMenuOptions={contextMenuOptions} />
            {showRowSeparators && idx < data.length - 1 && (
              <SeparatorRow colSpan={columns.length} />
            )}
          </React.Fragment>
        );
      })}
    </tbody>
  );
}

export default memo(TableBodyInner) as typeof TableBodyInner;
