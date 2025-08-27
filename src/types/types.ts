import type {
  LeadStatus,
  LeadType,
  ProjectStatus,
  InvoiceStatus,
} from "./enums";

export interface Contacts {
  id: number;
  companyName: string;
  name: string;
  occupation?: string;
  product?: string;
}

export type SortDirection = "asc" | "desc";

export interface Column<T> {
  id: string;
  header: string;
  accessor: (row: T) => string | number;
  type: "string" | "number";
  cellRenderer?: (value: string | number, row: T) => React.ReactNode;
  /**
   * Optional width for this column (e.g. '120px', '20%', 'minmax(120px,1fr)')
   */
  width?: string;
}
