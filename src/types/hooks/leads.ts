// src/types/hooks/leads.ts

import type { LeadFormData } from "../components/form";

export interface UseCreateLeadOptions {
  leadType: "new-contact" | "existing-contact";
  onLeadCreated?: (lead: unknown) => void;
}

export interface UseCreateLeadResult {
  createWithNewContact: (formData: LeadFormData) => Promise<void>;
  createWithExistingContact: (formData: LeadFormData) => Promise<void>;
  createWithAssignmentLead: (formData: LeadFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}
