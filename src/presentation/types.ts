// src/types/components/table.ts
import type * as React from "react";

export type SortDirection = "asc" | "desc";

export type Column<T> = {
  /** clave del dato (se usa si no pasas accessor) */
  key: keyof T | string;
  /** id estable (si no, se usa String(key)) */
  id?: string;
  /** texto simple del header */
  label?: string;
  /** header más rico (sobrescribe label si lo pasas) */
  header?: React.ReactNode;
  /** función para leer el valor mostrado */
  accessor?: (row: T) => unknown;
  /** renderizador de celda (si no, se hace String(value)) */
  cellRenderer?: (value: unknown, row: T) => React.ReactNode;
  /** hint de alineación */
  type?: "text" | "number";
  /** ancho CSS (p.ej. '160px' o 'minmax(120px,1fr)') */
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
  /** genera opciones para cada fila (si lo usas con tu ContextMenu externo) */
  contextMenuOptions?: (row: T) => ContextMenuOption[];
  showRowSeparators?: boolean;
  /** override por id/clave de columna → width CSS */
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
