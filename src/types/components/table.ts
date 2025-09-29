
import type { ReactElement, ReactNode } from "react";

import type { Lead } from "@/features/leads/domain/models/Lead";

import type { ContextMenuOption } from "../hooks";

export interface TableSkeletonProps {
  rows?: number;
  showSections?: boolean;
}

export interface TableCellProps {
  value: string | number;
  type: "string" | "number";
  className?: string;
}

export interface TableBodyProps<T> {
  columns: Column<T>[];
  data: T[];
  contextMenuOptions?: ((row: T) => ContextMenuOption[]) | undefined;
  showRowSeparators?: boolean | undefined;
  columnWidths?: Record<string, string> | undefined;
}

export interface TableRowProps<T> {
  row: T;
  columns: Column<T>[];
  contextMenuOptions?: ((row: T) => ContextMenuOption[]) | undefined;
}

export interface TableHeaderProps<T> {
  columns: Column<T>[];
  sortColumn?: string | undefined;
  sortDirection?: SortDirection | undefined;
  onSort: (columnId: string) => void;
  columnWidths?: Record<string, string> | undefined;
}

export type SortDirection = "asc" | "desc";

export interface Column<T> {
  key: keyof T;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => ReactElement | string;
  align?: "left" | "center" | "right";
  id?: string;
  header?: string; 
  accessor?: (item: T) => unknown;
  type?: string;
  cellRenderer?: (value: unknown, item: T) => ReactElement | string | null;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  sortConfig?: SortConfig<T>;
  onSort?: (key: keyof T) => void;
  className?: string;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  contextMenuOptions?: (item: T) => ContextMenuOption[];
  showRowSeparators?: boolean;
  columnWidths?: Record<string, string>;
}

export interface SortConfig<T> {
  key: keyof T;
  direction: "asc" | "desc";
}
export interface LeadsTableProps {
  data: Lead[];
  onContactView?: (contactId: number) => void;
  onContactEdit?: (contactId: number) => void;
  onLeadView?: (leadId: number) => void;
  onLeadEdit?: (leadId: number) => void;
  onLeadDuplicate?: (leadId: number) => void;
  onLeadDelete?: (leadId: number) => void;
  sortConfig?: {
    key: keyof Lead;
    direction: "asc" | "desc";
  };
  onSort?: (key: keyof Lead) => void;
}
export type { ContactsTableProps } from "./contacts";
