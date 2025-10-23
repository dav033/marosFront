
import type { ReactNode } from "react";

import type { Contact } from "@/contact";
import type { LeadStatus, LeadType,ProjectType } from "@/leads";
import type { FormMode } from "@/types";

export interface FormFieldProps {
  label: string;
  name: string;
  value?: string | number | undefined;
  placeholder?: string | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  error?: string | undefined;
  type?:
    | "text"
    | "email"
    | "tel"
    | "number"
    | "date"
    | "datetime-local"
    | "textarea"
    | "select";
  options?: Array<{ value: string | number; label: string }>;
  onChange?: ((name: string, value: string | number) => void) | undefined;
  onBlur?: ((name: string) => void) | undefined;
  className?: string | undefined;
}

export interface FormProps {
  children: ReactNode;
  onSubmit?: ((data: Record<string, unknown>) => void) | undefined;
  className?: string | undefined;
  loading?: boolean | undefined;
}
export interface LeadFormData {
  leadNumber?: string | undefined;
  name: string;
  leadName?: string | undefined; 
  startDate: string;
  location?: string | undefined;
  status: LeadStatus | null;
  projectTypeId?: number | undefined;
  leadType: LeadType;
  contactId?: number | undefined;
  companyName?: string | undefined;
  contactName?: string | undefined;
  customerName?: string | undefined; 
  occupation?: string | undefined;
  product?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  address?: string | undefined;
}

export interface LeadFormProps {
  mode: FormMode;
  initialData?: Partial<LeadFormData>;
  contacts: Contact[];
  projectTypes: ProjectType[];
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean | undefined;
}

export interface ContactFormData {
  companyName: string;
  name: string;
  occupation?: string | undefined;
  product?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  address?: string | undefined;
}

export interface ContactFormProps {
  mode: FormMode;
  initialData?: Partial<ContactFormData>;
  onSubmit: (data: ContactFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean | undefined;
}

export interface UseLeadFormOptions {
  initialData?: Partial<LeadFormData>;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onSuccess?: ((lead: unknown) => void) | undefined;
}
