// src/presentation/atoms/table/SeparatorRow.tsx
import React from "react";

export default function SeparatorRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-0 py-0">
        <div className="border-b border-gray-600 mx-3" />
      </td>
    </tr>
  );
}
