import type { ReactNode } from "react";

import type { Contact } from "@/features/contact/domain/models/Contact";
import type { Lead } from "@/features/leads/domain";

export interface ContactsContextType {
  contacts: Contact[];
  loading: boolean;
  isLoading?: boolean;
  error: string | null;
  searchTerm?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";

  fetchContacts: () => Promise<void>;
  addContact: (contact: Omit<Contact, "id">) => Promise<void>;
  updateContact: (id: number, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: number) => Promise<void>;
  setSearchTerm?: (term: string) => void;
  setSorting?: (field: string, direction: "asc" | "desc") => void;
  clearError: () => void;
  refetch: () => Promise<void>;

  setContacts: (contacts: Contact[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  removeContact?: (contactId: number) => void;
}

export interface ContactsProviderProps {
  children: ReactNode;
}

export interface LeadsContextType {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  sortField: string;
  sortDirection: "asc" | "desc";
  filters: {
    status?: string[];
    leadType?: string[];
    dateRange?: {
      start?: string;
      end?: string;
    };
  };

  fetchLeads: () => Promise<void>;
  addLead: (lead: Omit<Lead, "id">) => Promise<void>;
  updateLead: (id: number, lead: Partial<Lead>) => Promise<void>;
  deleteLead: (id: number) => Promise<void>;
  duplicateLead: (id: number) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setSorting: (field: string, direction: "asc" | "desc") => void;
  setFilters: (filters: LeadsContextType["filters"]) => void;
  clearError: () => void;
  refetch: () => Promise<void>;
}

export interface LeadsProviderProps {
  children: ReactNode;
}

export interface LoadingContextValue {
  isLoading: boolean;
  loadingMessage?: string;
  setLoading: (loading: boolean, message?: string) => void;
}

export interface LoadingProviderProps {
  children: ReactNode;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
  defaultDuration?: number;
}
