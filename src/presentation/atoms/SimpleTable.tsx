import * as React from "react";
import classNames from "classnames";

export type TableAlign = "left" | "center" | "right";

export type TableColumn<T> = {
  key: keyof T & string;
  header: string;
  align?: TableAlign;
  render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  title?: string; // tooltip opcional
};

export type SimpleTableProps<T extends Record<string, any>> = {
  columns: Array<TableColumn<T>>;
  data: T[];
  dense?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
  onRowClick?: (row: T, index: number) => void;
  emptyState?: React.ReactNode;
  caption?: string;
  ariaLabel?: string;
};

function align(align?: TableAlign) {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

export default function SimpleTable<T extends Record<string, any>>({
  columns,
  data,
  dense = false,
  striped = true,
  hoverable = true,
  className,
  onRowClick,
  emptyState,
  caption,
  ariaLabel,
}: SimpleTableProps<T>) {
  return (
    <div className={classNames("overflow-x-auto", className)}>
      <table
        aria-label={ariaLabel ?? caption ?? "Tabla de datos"}
        className={classNames(
          "w-full border border-gray-200 bg-white rounded-2xl shadow-sm"
        )}
      >
        {caption ? (
          <caption className="text-sm text-gray-500 p-3">{caption}</caption>
        ) : null}
        <thead>
          <tr className="bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                title={col.title}
                className={classNames(
                  "font-semibold text-gray-700",
                  dense ? "px-3 py-2 text-sm" : "px-4 py-3 text-sm",
                  align(col.align),
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className={classNames(
                  "text-gray-500 text-center",
                  dense ? "px-3 py-6 text-sm" : "px-4 py-8 text-sm"
                )}
              >
                {emptyState ?? "Sin datos para mostrar"}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className={classNames(
                  striped && i % 2 === 1 ? "bg-gray-50/60" : "bg-white",
                  hoverable && "hover:bg-gray-50",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(row, i)}
              >
                {columns.map((col) => {
                  const value = row[col.key];
                  return (
                    <td
                      key={col.key}
                      className={classNames(
                        "text-gray-900 align-middle",
                        dense ? "px-3 py-2 text-sm" : "px-4 py-3 text-sm",
                        align(col.align),
                        col.className
                      )}
                    >
                      {col.render ? col.render(value, row, i) : value}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
