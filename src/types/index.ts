// src/types/index.ts

// ===========================================
// MAIN TYPE EXPORTS - CLEAN VERSION
// ===========================================

// Enums - export first as they're used by other types
export * from "./enums";

// Context types
export * from "./contexts";

// Domain entities and business logic
export type {
  // Core entities from domain/entities.ts
  Contacts,
  ProjectType,
  Lead,
  Project,

} from "./domain/entities";

export type {
  // Request types from domain/requests.ts
  CreateContactRequest,
  CreateLeadRequest,
  ContactValidationResponse,
  CreateLeadByNewContactData,
  CreateLeadByExistingContactData,
  UpdateLeadData,
} from "./domain/requests";

export type {
  // Response types from domain/responses.ts
  ApiResponse,
  ApiListResponse,
  ContactsResponse,
  LeadsResponse,
  ProjectTypesResponse,
  ContactResponse,
  LeadResponse,
  ProjectTypeResponse,
  LeadNumberResponse,
} from "./domain/responses";

// Library types
export * from "./lib";

// System types
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
  // Sidebar types
  SidebarContextType,
  SidebarProviderProps,
  SidebarWrapperProps,
  SidebarItemProps,
  TriggerProps,
  SidebarDropdownProps,
} from "./system/sidebar";

export type {
  // Configuration types
  CacheResourceKey,
  CacheResourceConfig,
  DebugConfig,
  CacheConfigShape,
  CacheDebugConfig,
} from "./system/config";

export type {
  // API types
  ApiClientConfig,
  ApiError,
  ApiInterceptors,
  RequestConfig,
  ApiClient,
} from "./system/api";

export type {
  // Cache types
  StorageLayer,
  CacheConfig,
  CacheEntry,
  CacheMetrics,
  CacheStorage,
  CacheManager,
} from "./system/cache";

export type {
  // Prefetch types
  PrefetchManager,
  PrefetchTask,
  PrefetchConfig,
  PrefetchStats,
  PrefetchPriority,
  PrefetchTrigger,
  PrefetchCondition,
} from "./system/prefetch";

// Hook types
export type {
  // Search types
  SearchFieldOption,
  SearchConfig,
  SearchState,
  SearchActions,
  UseSearchResult,
  ContactSearchConfig,
  LeadSearchConfig,
} from "./hooks/search";

export type {
  // Fetch types
  FetchState,
  FetchOptions,
  UseFetchResult,
  FetchContextValue,
} from "./hooks/fetch";

export type {
  // Optimized fetch types
  OptimizedFetchConfig,
  UseOptimizedFetchReturn,
  VisibilityIntervalOptions,
  Undetermined,
  LeadsByTypeConfig,
} from "./hooks/optimized-fetch";

export type {
  // Lead hook types
  UseCreateLeadResult,
} from "./hooks/leads";

export type {
  // Context menu types
  ContextMenuPosition,
  ContextMenuOption,
  ContextMenuState,
  UseContextMenuResult,
  ContactContextMenuOptions,
  LeadContextMenuOptions,
  UseContactContextMenuProps,
  UseLeadContextMenuProps,
} from "./hooks/context-menu";

// Component types
export type {
  // Table types
  TableSkeletonProps,
  Column,
  TableProps,
  SortConfig,
  SortDirection,
  LeadsTableProps,
} from "./components/table";

export type {
  // Form types
  FormFieldProps,
  FormProps,
  LeadFormData,
  LeadFormProps,
  ContactFormData,
  ContactFormProps,
  UseLeadFormOptions,
} from "./components/form";

export type {
  // Modal types
  ModalProps,
  ConfirmModalProps,
  AlertModalProps,
  FormModalProps,
} from "./components/modal";

export type {
  // UI component types
  BaseButtonProps,
  IconButtonProps,
  GenericButtonProps,
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
  LoadingSpinnerProps,
  LoadingOverlayProps,
  BadgeProps,
} from "./components/ui";

export type {
  // Badge component types
  StatusBadgeProps,
  ProjectTypeBadgeProps,
  BadgeVariant,
} from "./components/badges";

export type {
  // Common component types
  SearchBoxWithDropdownProps,
  CacheDiagnosticsProps,
} from "./components/common";

export type {
  // Lead component types
  InstantLeadsListProps,
  LeadFormFieldsProps,
  SelectorFields,
  ContactModeSelectorProps,
  CreateLocalLeadModalProps,
  EditLeadModalProps,
  BaseLeadModalProps,
} from "./components/leads";

export type {
  // Contact component types
  ContactsTableProps,
  ContactSectionProps,
  CreateContactModalProps,
  EditContactModalProps,
  ContactsTableSkeletonProps,
  InteractiveTableProps,
  ContactFormComponentProps,
} from "./components/contacts";

// Utility types
export type {
  // Validation types
  ValidateNewContactLeadData,
  ValidateExistingContactLeadData,
  ValidateEditLeadData,
  LeadForEdit,
  SelectOption,
  StatusOption,
} from "./utils/validation";

export type {
  // Cache utility types
  CachedResult,
} from "./utils/cache";

// Lib types
export type {
  // API Client types
  CachedRequestConfig,
  RequestMetrics,
  OptimizedApiClientMetrics,
} from "./lib/api-client";

// Legacy interfaces - these should be migrated eventually
export interface UseCreateLeadOptions {
  leadType: "new-contact" | "existing-contact";
  onLeadCreated?: (lead: unknown) => void;
}

export interface UseInstantContactsResult {
  contacts: unknown[];
  isLoading: boolean;
  showSkeleton: boolean;
  error: Error | null;
  fromCache: boolean;
  refetch: () => Promise<void>;
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
