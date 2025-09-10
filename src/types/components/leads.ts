// src/types/components/leads.ts

import type { ContactMode, FormMode, LeadType } from "../enums";
import type { Contacts, ProjectType } from "../domain/entities";

export interface InstantLeadsListProps {
  leadType: LeadType;
}

export interface LeadFormFieldsProps {
  form: Record<string, unknown>;
  onChange: (field: string, value: string) => void;
  projectTypes: ProjectType[];
  contacts: Contacts[];
  mode: FormMode;
  contactMode?: ContactMode;
  showLeadNumber?: boolean;
  isLoading?: boolean;
}

export type SelectorFields = "customerName" | "contactName" | "phone" | "email";

export interface ContactModeSelectorProps {
  contactMode: ContactMode;
  onContactModeChange: (mode: ContactMode) => void;
  form: import("./form").LeadFormData;
  onChange: (field: string, value: string) => void;
  isLoading?: boolean;
}

export interface CreateLocalLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTypes: ProjectType[];
  contacts: Contacts[];
  leadType: import("../enums").LeadType;
  onLeadCreated: (lead: import("../domain/entities").Lead) => void;
}

export interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: import("../domain/entities").Lead | null;
  projectTypes: ProjectType[];
  contacts: Contacts[];
  onLeadUpdated: (lead: import("../domain/entities").Lead) => void;
}

export interface BaseLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  submitText: string;
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}
