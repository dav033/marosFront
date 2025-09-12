// src/features/leads/types/hooks.ts

import type { LeadFormData } from "./forms";
import type { Lead } from "./entities";

export interface UseCreateLeadOptions {
  onSuccess?: (lead: Lead) => void;
  onError?: (error: Error) => void;
}

export interface UseCreateLeadResult {
  createLead: (data: LeadFormData) => Promise<Lead>;
  isLoading: boolean;
  error: string | null;
}

export interface LeadContextMenuOptions {
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
  onDuplicate?: (lead: Lead) => void;
}

export interface UseLeadFormOptions {
  initialData?: Partial<LeadFormData>;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onSuccess?: () => void;
}
