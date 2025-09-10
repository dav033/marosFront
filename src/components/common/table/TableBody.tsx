// src/components/table/TableBody.tsx
import React, { memo } from "react";
import type { TableBodyProps } from "../../../types/components/table";
import TableRow from "./TableRow.tsx";

function TableBodyInner<T>({
  columns,
  data,
  contextMenuOptions,
  showRowSeparators = false,
  columnWidths,
}: TableBodyProps<T>) {
  return (
    <tbody className="bg-theme-dark">
      {data.map((row, idx) => (
        <React.Fragment key={idx}>
          <TableRow
            row={row}
            columns={columns}
            contextMenuOptions={contextMenuOptions}
          />
          {showRowSeparators && idx < data.length - 1 && (
            <tr>
              <td colSpan={columns.length} className="px-0 py-0">
                <div className="border-b border-gray-600 mx-3"></div>
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </tbody>
  );
}

export default memo(TableBodyInner) as typeof TableBodyInner;
