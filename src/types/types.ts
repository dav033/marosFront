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
  phone?: string;
  email?: string;
  address?: string;
  lastContact?: string;
}

export interface SidebarItemProps {
  title: string;
  to: string;
  icon?: string;
  currentPath: string;
}
// Ajuste si ya tiene este tipo en otro archivo:
export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export type StorageLayer = "memory" | "session" | "local";

export interface OptimizedFetchConfig {
  cacheKey: string;
  ttl?: number; // ms
  storage?: StorageLayer;
  showSkeletonOnlyOnFirstLoad?: boolean;
  refetchInterval?: number; // ms
  /** Umbral para refrescar en background cuando el cache supera X% del TTL (por defecto 0.5 = 50%) */
  backgroundRefreshThreshold?: number; // 0..1
}

export type UseOptimizedFetchReturn<T> = UseFetchResult<T> & {
  fromCache: boolean;
  cacheAge: number;
  forceRefresh: () => Promise<void>;
};

export interface SidebarDropdownProps {
  trigger: {
    title: string;
    icon?: string;
    className?: string;
  };
  width?: string;
  children: React.ReactNode;
  duration?: number;
  indentLevel?: number;
  id: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  currentPath: string;
}

export interface CreateContactRequest {
  companyName: string;
  name: string;
  occupation?: string;
  product?: string;
  phone?: string;
  email?: string;
  address?: string;
  lastContact?: string;
}

export interface ProjectType {
  id: number;
  name: string;
  color: string;
}

export interface Lead {
  id: number;
  leadNumber: string;
  name: string;
  startDate: string;
  location?: string;
  status: LeadStatus | null;
  contact: Contacts;
  projectType: ProjectType;
  leadType: LeadType;
}

export interface CreateLeadRequest {
  leadNumber?: string;
  name: string;
  startDate: string;
  location?: string;
  status: LeadStatus | null;
  contact?: CreateContactRequest;
  projectType: ProjectType;
  leadType: LeadType;
}

export interface Project {
  id: number;
  projectName: string;
  overview?: string;
  payments?: number[];
  projectStatus: ProjectStatus;
  invoiceStatus: InvoiceStatus;
  quickbooks?: boolean;
  startDate?: string;
  endDate?: string;
  lead: Lead;
}

export interface GetContactByNameRequest {
  name: string;
}

export interface GetLeadsByTypeRequest {
  type: LeadType;
}

export interface CreateLeadByNewContactRequest {
  lead: CreateLeadRequest;
  contact: CreateContactRequest;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  message: string;
  path: string;
}

export type SortDirection = "asc" | "desc";

export interface Column<T> {
  id: string;
  header: string;
  accessor: (row: T) => string | number;
  type: "string" | "number";
  cellRenderer?: (value: string | number, row: T) => React.ReactNode;
}
