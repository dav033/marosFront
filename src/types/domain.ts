// src/types/domain.ts

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
  [key: string]: unknown;
}

export interface PrefetchConfig {
  enabled: boolean;
  priority: "low" | "medium" | "high";
  conditions: PrefetchCondition[];
  delay: number; // ms
}

export interface PrefetchCondition {
  type: "route" | "hover" | "scroll" | "idle" | "intersection";
  trigger?: Element;
  threshold?: number;
}

export interface PrefetchTask {
  id: string;
  key: string;
  fetchFn: () => Promise<unknown>;
  config: PrefetchConfig;
  status: "pending" | "running" | "completed" | "failed";
  priority: number;
  createdAt: number;
}

export interface PrefetchStats {
  total: number;
  pending: number;
  runningTasks: number;
  completed: number;
  failed: number;
  queueSize: number;
  activeConnections: number;
}

export interface PrefetchManager {
  register: (
    key: string,
    fetchFn: () => Promise<unknown>,
    config?: Partial<PrefetchConfig>
  ) => string;
  execute: (key: string) => Promise<unknown>;
  cancel: (id: string) => boolean;
  onHover: (
    element: Element,
    key: string,
    fetchFn: () => Promise<unknown>
  ) => void;
  onIntersection: (
    element: Element,
    key: string,
    fetchFn: () => Promise<unknown>
  ) => void;
  onRoutePredict: (
    currentRoute: string,
    predictedRoutes: string[],
    fetchData: Record<string, () => Promise<unknown>>
  ) => void;
  getStats: () => PrefetchStats;
  cleanup: () => void;
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

export interface InteractiveTableProps {
  leadType: import("src/types/enums").LeadType;
  title: string;
  createButtonText: string;
}

export interface UseInstantDataConfig<T> {
  cacheKey: string;
  fetchFn: () => Promise<T>;
  initialValue?: T;
  ttl?: number;
  enableCache?: boolean;
  strategy?: "cache-first" | "network-first" | "cache-only";
  onCacheHit?: (data: T) => void;
  onCacheMiss?: () => void;
}
export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface UseContactContextMenuProps {
  onEdit?: (contact: Contacts) => void;
  onDelete?: (contactId: number) => void;
}

export interface UseCreateLeadOptions {
  leadType: LeadType;
  onLeadCreated: (lead: Lead) => void;
}

export interface UseInstantContactsResult {
  contacts: Contacts[];
  isLoading: boolean;
  showSkeleton: boolean;
  error: Error | null;
  fromCache: boolean;
  refetch: () => Promise<void>;
}

export interface UseInstantDataResult<T> {
  data: T;
  loading: boolean;
  error: Error | null;
  fromCache: boolean;
  refresh: () => Promise<void>;
  clearCache: () => void;
  mutate?: (updater: (prev: T) => T) => void;
}

export interface UseLeadContextMenuProps {
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: number) => void;
}

export interface LeadSectionData {
  title: string;
  status: LeadStatus | null;
  data: Lead[];
}

export interface LeadFormData {
  leadNumber: string;
  leadName: string;
  customerName: string;
  contactName: string;
  phone: string;
  email: string;
  contactId: string;
  projectTypeId: string;
  location: string;
  status?: string;
  startDate?: string;
}

export interface UseLeadFormOptions {
  initialData?: Partial<LeadFormData>;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onSuccess?: () => void;
}

export interface ContactValidationResponse {
  nameAvailable: boolean;
  emailAvailable: boolean;
  phoneAvailable: boolean;
  nameReason?: string;
  emailReason?: string;
  phoneReason?: string;
}
