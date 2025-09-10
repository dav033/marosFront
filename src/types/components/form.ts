// src/types/components/form.ts

import type { ReactNode } from "react";
import type { LeadStatus, LeadType, FormMode } from "../enums";
import type { ProjectType, Contacts } from "../domain";

// ===========================================
// FORM COMPONENT TYPES
// ===========================================

export interface FormFieldProps {
  label: string;
  name: string;
  value?: string | number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  type?: "text" | "email" | "tel" | "number" | "date" | "textarea" | "select";
  options?: Array<{ value: string | number; label: string }>;
  onChange?: (name: string, value: string | number) => void;
  onBlur?: (name: string) => void;
  className?: string;
}

export interface FormProps {
  children: ReactNode;
  onSubmit?: (data: Record<string, unknown>) => void;
  className?: string;
  loading?: boolean;
}

// Lead-specific form interfaces
export interface LeadFormData {
  leadNumber?: string;
  name: string;
  leadName?: string; // Alias for compatibility
  startDate: string;
  location?: string;
  status: LeadStatus | null;
  projectTypeId?: number;
  leadType: LeadType;
  contactId?: number;
  
  // For new contact creation
  companyName?: string;
  contactName?: string;
  customerName?: string; // Add this for compatibility
  occupation?: string;
  product?: string;
  phone?: string;
  email?: string;
  address?: string;
  lastContact?: string;
}

export interface LeadFormProps {
  mode: FormMode;
  initialData?: Partial<LeadFormData>;
  contacts: Contacts[];
  projectTypes: ProjectType[];
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export interface ContactFormData {
  companyName: string;
  name: string;
  occupation?: string;
  product?: string;
  phone?: string;
  email?: string;
  address?: string;
  lastContact?: string;
}

export interface ContactFormProps {
  mode: FormMode;
  initialData?: Partial<ContactFormData>;
  onSubmit: (data: ContactFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export interface UseLeadFormOptions {
  initialData?: Partial<LeadFormData>;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onSuccess?: (lead: unknown) => void;
}
