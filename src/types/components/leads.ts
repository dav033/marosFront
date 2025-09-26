
import type React from "react";

import type { Contact } from "@/features/contact/domain/models/Contact";
import type { Lead } from "@/features/leads/domain/models/Lead";
import type { LeadType } from "@/features/leads/enums";

import type { LeadFormData } from "./form";
export interface ProjectType {
  id: number;
  name: string;
}

export type FormMode = "create" | "edit";
export type ContactMode = "existing" | "new";

export interface InstantLeadsListProps {
  leadType: LeadType;
}

export interface LeadFormFieldsProps {
  form: Record<string, unknown>;
  onChange: (field: string, value: string) => void;
  projectTypes: ProjectType[];
  contacts: Contact[];
  mode: FormMode;
  contactMode?: ContactMode;
  showLeadNumber?: boolean;
  isLoading?: boolean;
}

export type SelectorFields = "customerName" | "contactName" | "phone" | "email";

export interface ContactModeSelectorProps {
  contactMode: ContactMode;
  onContactModeChange: (mode: ContactMode) => void;
  form: LeadFormData;
  onChange: (field: string, value: string) => void;
  isLoading?: boolean;
}

export interface CreateLocalLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTypes: ProjectType[];
  contacts: Contact[];
  leadType: LeadType;
  onLeadCreated: (lead: Lead) => void;
}

export interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  projectTypes: ProjectType[];
  contacts: Contact[];
  onLeadUpdated: (lead: Lead) => void;
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
  cancelText?: string;
  isSubmitDisabled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
    formId?: string;
}

