import type * as React from "react";

export type SortDirection = "asc" | "desc";

export type Column<T> = {
    key: keyof T | string;
    id?: string;
    label?: string;
    header?: React.ReactNode;
    accessor?: (row: T) => unknown;
    cellRenderer?: (value: unknown, row: T) => React.ReactNode;
    type?: "text" | "number";
    width?: string;
};

export type ContextMenuOption = {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
};

export type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
    contextMenuOptions?: (row: T) => ContextMenuOption[];
  showRowSeparators?: boolean;
    columnWidths?: Record<string, string>;
  className?: string;
};

export type TableHeaderProps<T> = {
  columns: Column<T>[];
  sortColumn?: string;
  sortDirection: SortDirection;
  onSort: (columnKey: string) => void;
  columnWidths?: Record<string, string>;
};

export type TableBodyProps<T> = {
  columns: Column<T>[];
  data: T[];
  contextMenuOptions?: (row: T) => ContextMenuOption[];
  showRowSeparators?: boolean;
  columnWidths?: Record<string, string>;
};

export type TableRowProps<T> = {
  row: T;
  columns: Column<T>[];
  contextMenuOptions?: (row: T) => ContextMenuOption[];
};

export type TableCellProps = {
  value: React.ReactNode;
  type?: "text" | "number";
  className?: string;
};
