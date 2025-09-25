// src/types/index.ts

import type { Contact } from "@/features/contact/domain/models/Contact";

// ===========================================
// MAIN TYPE EXPORTS - CLEAN VERSION
// ===========================================

// Enums - export first as they're used by other types
export * from "./enums";

// Context types
export * from "./contexts";

// Domain models - Re-export for convenience 
export type { Contact } from "@/features/contact/domain/models/Contact";
export type { Lead } from "@/features/leads/domain/models/Lead";

// Interfaces that depend on domain models
export interface UseInstantContactsResult {
  contacts: Contact[];
  isLoading: boolean;
  showSkeleton: boolean;
  error: Error | null;
  fromCache: boolean;
  refetch: () => Promise<void>;
}


export type {
  ContactValidationResponse,
  // Request types from domain/requests.ts
  CreateContactRequest,
  CreateLeadByExistingContactData,
  CreateLeadByNewContactData,
  CreateLeadRequest,
  UpdateLeadData,
} from "./domain/requests";
export type {
  ApiListResponse,
  // Response types from domain/responses.ts
  ApiResponse,
  ContactResponse,
  ContactsResponse,
  LeadNumberResponse,
  LeadResponse,
  LeadsResponse,
  ProjectTypeResponse,
  ProjectTypesResponse,
} from "./domain/responses";

// Library types
export * from "./lib";

// System types
export type {
  ApiClient,
  // API types
  ApiClientConfig,
  ApiError,
  ApiInterceptors,
  RequestConfig,
} from "./system/api";
export type {
  CacheConfig,
  CacheEntry,
  CacheManager,
  CacheMetrics,
  CacheStorage,
  // Cache types
  StorageLayer,
} from "./system/cache";
export type {
  CacheConfigShape,
  CacheDebugConfig,
  CacheResourceConfig,
  // Configuration types
  CacheResourceKey,
  DebugConfig,
} from "./system/config";
export type {
  // Context types
  ContactsContextType,
  ContactsProviderProps,
  LeadsContextType,
  LeadsProviderProps,
  LoadingContextValue,
  LoadingProviderProps,
  Notification,
  NotificationContextValue,
  NotificationProviderProps,
} from "./system/contexts";
export type {
  PrefetchCondition,
  PrefetchConfig,
  // Prefetch types
  PrefetchManager,
  PrefetchPriority,
  PrefetchStats,
  PrefetchTask,
  PrefetchTrigger,
} from "./system/prefetch";
export type {
  // Sidebar types
  SidebarContextType,
  SidebarDropdownProps,
  SidebarItemProps,
  SidebarProviderProps,
  SidebarWrapperProps,
  TriggerProps,
} from "./system/sidebar";

// Hook types
export type {
  ContactContextMenuOptions,
  ContextMenuOption,
  // Context menu types
  ContextMenuPosition,
  ContextMenuState,
  LeadContextMenuOptions,
  UseContactContextMenuProps,
  UseContextMenuResult,
  UseLeadContextMenuProps,
} from "./hooks/context-menu";
export type {
  FetchContextValue,
  FetchOptions,
  // Fetch types
  FetchState,
  UseFetchResult,
} from "./hooks/fetch";
export type {
  // Lead hook types
  UseCreateLeadResult,
} from "./hooks/leads";
export type {
  LeadsByTypeConfig,
  // Optimized fetch types
  OptimizedFetchConfig,
  Undetermined,
  UseOptimizedFetchReturn,
  VisibilityIntervalOptions,
} from "./hooks/optimized-fetch";
export type {
  ContactSearchConfig,
  LeadSearchConfig,
  SearchActions,
  SearchConfig,
  // Search types
  SearchFieldOption,
  SearchState,
  UseSearchResult,
} from "./hooks/search";

// Component types
export type {
  BadgeVariant,
  ProjectTypeBadgeProps,
  // Badge component types
  StatusBadgeProps,
} from "./components/badges";
export type {
  CacheDiagnosticsProps,
  // Common component types
  SearchBoxWithDropdownProps,
} from "./components/common";
export type {
  ContactFormComponentProps,
  ContactSectionProps,
  // Contact component types
  ContactsTableProps,
  ContactsTableSkeletonProps,
  CreateContactModalProps,
  EditContactModalProps,
} from "./components/contacts";
export type {
  ContactFormData,
  ContactFormProps,
  // Form types
  FormFieldProps,
  FormProps,
  LeadFormData,
  LeadFormProps,
  UseLeadFormOptions,
} from "./components/form";
export type {
  BaseLeadModalProps,
  ContactModeSelectorProps,
  CreateLocalLeadModalProps,
  EditLeadModalProps,
  // Lead component types
  InstantLeadsListProps,
  LeadFormFieldsProps,
  SelectorFields,
} from "./components/leads";
export type {
  AlertModalProps,
  ConfirmModalProps,
  FormModalProps,
  // Modal types
  ModalProps,
} from "./components/modal";
export type {
  Column,
  LeadsTableProps,
  SortConfig,
  SortDirection,
  TableProps,
  // Table types
  TableSkeletonProps,
} from "./components/table";
export type {
  BadgeProps,
  // UI component types
  BaseButtonProps,
  CardContentProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  GenericButtonProps,
  IconButtonProps,
  LoadingOverlayProps,
  LoadingSpinnerProps,
} from "./components/ui";

// Utility types
export type {
  // Cache utility types
  CachedResult,
} from "./utils/cache";
export type {
  LeadForEdit,
  SelectOption,
  StatusOption,
  ValidateEditLeadData,
  ValidateExistingContactLeadData,
  // Validation types
  ValidateNewContactLeadData,
} from "./utils/validation";

// Lib types
// Lib types
export type {
  // API Client types
  CachedRequestConfig,
  OptimizedApiClientMetrics,
  RequestMetrics,
} from "./lib/api-client";

// Legacy interfaces - these should be migrated eventually
export interface UseCreateLeadOptions {
  leadType: "new-contact" | "existing-contact";
  onLeadCreated?: (lead: unknown) => void;
}


export interface UseInstantDataConfig<T = unknown> {
  cacheKey: string;
  fetchFn: () => Promise<T>;
  initialValue?: T;
  ttl?: number;
  enableCache?: boolean;
  strategy?: "cache-first" | "network-first" | "cache-only";
  onCacheHit?: (data: T) => void;
  onCacheMiss?: () => void;
}

export interface UseInstantDataResult<T = unknown> {
  data: T;
  loading: boolean;
  error: Error | null;
  fromCache: boolean;
  refresh: () => Promise<void>;
  clearCache: () => void;
  mutate: (updater: (prev: T) => T) => void;
}

export interface Section {
  name: string;
  data: unknown[];
}
