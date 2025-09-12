// src/features/leads/types/components.ts

import type { ContactMode, FormMode } from "../../../types/enums";
import type { Contacts, ProjectType } from "../../../types/domain/entities";
import type { LeadType } from "./enums";
import type { Lead } from "./entities";
import type { LeadFormData } from "./forms";

export interface InstantLeadsListProps {
  leadType: LeadType;
}

export interface LeadFormFieldsProps {
  form: LeadFormData;
  onChange: (field: string, value: string) => void;
  projectTypes: ProjectType[];
  contacts?: Contacts[];
  mode?: FormMode;
  contactMode?: ContactMode;
  showLeadNumber?: boolean;
}

export interface CreateLocalLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTypes: ProjectType[];
  contacts: Contacts[];
  leadType: LeadType;
  onLeadCreated: (lead: Lead) => void;
}

export interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTypes: ProjectType[];
  contacts: Contacts[];
  leadType: LeadType;
  onLeadCreated: (lead: Lead) => void;
}

export interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  projectTypes: ProjectType[];
  contacts: Contacts[];
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
}

export interface LeadsInteractiveTableProps {
  leadType: LeadType;
  title: string;
  createButtonText: string;
}

export interface LeadSectionData {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
}

export interface StatusBadgeProps {
  status: string;
}

export interface ProjectTypeBadgeProps {
  projectType: ProjectType;
}
