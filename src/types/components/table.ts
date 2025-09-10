// src/types/components/table.ts

import type { ReactElement, ReactNode } from "react";
import type { Lead, Contacts } from "../domain";
import type { ContextMenuOption } from "../hooks";

export interface TableSkeletonProps {
  rows?: number;
  showSections?: boolean;
}

// ===========================================
// TABLE COMPONENT TYPES
// ===========================================

export interface TableCellProps {
  value: string | number;
  type: "string" | "number";
  className?: string;
}

export interface TableBodyProps<T> {
  columns: Column<T>[];
  data: T[];
  contextMenuOptions?: (row: T) => ContextMenuOption[];
  showRowSeparators?: boolean;
  columnWidths?: Record<string, string>;
}

export interface TableRowProps<T> {
  row: T;
  columns: Column<T>[];
  contextMenuOptions?: (row: T) => ContextMenuOption[];
}

export interface TableHeaderProps<T> {
  columns: Column<T>[];
  sortColumn?: string;
  sortDirection?: SortDirection;
  onSort: (columnId: string) => void;
  columnWidths?: Record<string, string>;
}

export type SortDirection = "asc" | "desc";

export interface Column<T> {
  key: keyof T;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => ReactElement | string;
  align?: "left" | "center" | "right";
  
  // Legacy properties for compatibility
  id?: string;
  header?: string; // Alias for label
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
  
  // Legacy properties for compatibility
  contextMenuOptions?: (item: T) => ContextMenuOption[];
  showRowSeparators?: boolean;
  columnWidths?: Record<string, string>;
}

export interface SortConfig<T> {
  key: keyof T;
  direction: "asc" | "desc";
}

// Specialized table interfaces
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

export interface ContactsTableProps {
  data: Contacts[];
  onContactView?: (contactId: number) => void;
  onContactEdit?: (contactId: number) => void;
  sortConfig?: {
    key: string;
    direction: "asc" | "desc";
  };
  onSort?: (key: string) => void;
}
