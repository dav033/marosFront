import type React from 'react';

export type SortDirection = 'asc' | 'desc';

export type Column<T> = {
  id?: string;
  key: keyof T;
  label?: string;
  header: string;
  width?: string;
  type?: 'text' | 'number' | 'string';
  accessor?: (row: T) => unknown;
  cellRenderer?: (value: unknown, row: T) => React.ReactNode;
};
export { ContactMode, FormMode } from '@/types';

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
  onSortChange?: (columnId: string) => void;
}

export type ContextMenuOption = Readonly<{
  id: string | number;
  label?: string;
  icon?: React.ReactNode | string;
  shortcut?: string;
  action?: () => void;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
}>;

export interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  id?: string;
  rightSlot?: React.ReactNode;
}

export interface ModalBodyProps {
  children: React.ReactNode;
}

export interface ModalFooterProps {
  children: React.ReactNode;
}               

export interface LeadFormData {
  leadNumber?: string;
  leadName?: string;
  customerName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  projectTypeId?: number;
  location?: string;
  status?: string;
  startDate?: string;
  contactId?: number;
}

export interface ContactFormData {
  companyName: string;
  name: string;
  occupation?: string;
  product?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export type SearchFieldOption = {
  value: string;
  label: string;
};

export type ContactsTableSkeletonProps = {
  rows?: number;
};
