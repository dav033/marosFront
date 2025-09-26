import type { Contact } from "@/features/contact/domain/models/Contact";
export * from "./enums";
export * from "./contexts";
export type { Contact } from "@/features/contact/domain/models/Contact";
export type { Lead } from "@/features/leads/domain/models/Lead";
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
  CreateContactRequest,
  CreateLeadByExistingContactData,
  CreateLeadByNewContactData,
  CreateLeadRequest,
  UpdateLeadData,
} from "./domain/requests";
export type {
  ApiListResponse,
  ApiResponse,
  ContactResponse,
  ContactsResponse,
  LeadNumberResponse,
  LeadResponse,
  LeadsResponse,
  ProjectTypeResponse,
  ProjectTypesResponse,
} from "./domain/responses";
export * from "./lib";
export type {
  ApiClient,
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
  StorageLayer,
} from "./system/cache";
export type {
  CacheConfigShape,
  CacheDebugConfig,
  CacheResourceConfig,
  CacheResourceKey,
  DebugConfig,
} from "./system/config";
export type {
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
  PrefetchManager,
  PrefetchPriority,
  PrefetchStats,
  PrefetchTask,
  PrefetchTrigger,
} from "./system/prefetch";
export type {
  SidebarContextType,
  SidebarDropdownProps,
  SidebarItemProps,
  SidebarProviderProps,
  SidebarWrapperProps,
  TriggerProps,
} from "./system/sidebar";
export type {
  ContactContextMenuOptions,
  ContextMenuOption,
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
  FetchState,
  UseFetchResult,
} from "./hooks/fetch";
export type { UseCreateLeadResult } from "./hooks/leads";
export type {
  LeadsByTypeConfig,
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
  SearchFieldOption,
  SearchState,
  UseSearchResult,
} from "./hooks/search";
export type {
  BadgeVariant,
  ProjectTypeBadgeProps,
  StatusBadgeProps,
} from "./components/badges";
export type { SearchBoxWithDropdownProps } from "./components/common";
export type {
  ContactFormComponentProps,
  ContactSectionProps,
  ContactsTableProps,
  ContactsTableSkeletonProps,
  CreateContactModalProps,
  EditContactModalProps,
} from "./components/contacts";
export type {
  ContactFormData,
  ContactFormProps,
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
  InstantLeadsListProps,
  LeadFormFieldsProps,
  SelectorFields,
} from "./components/leads";
export type {
  AlertModalProps,
  ConfirmModalProps,
  FormModalProps,
  ModalProps,
} from "./components/modal";
export type {
  Column,
  LeadsTableProps,
  SortConfig,
  SortDirection,
  TableProps,
  TableSkeletonProps,
} from "./components/table";
export type {
  BadgeProps,
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
export type { CachedResult } from "./utils/cache";
export type {
  LeadForEdit,
  SelectOption,
  StatusOption,
  ValidateEditLeadData,
  ValidateExistingContactLeadData,
  ValidateNewContactLeadData,
} from "./utils/validation";
export type {
  CachedRequestConfig,
  OptimizedApiClientMetrics,
  RequestMetrics,
} from "./lib/api-client";
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
