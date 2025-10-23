
import type { Contact } from "@/contact";
import type { Lead, LeadType,ProjectType } from "@/leads";

import type { ContactMode, FormMode } from "..";
import type { Column } from ".";
import type { LeadFormData } from "./form";

export interface LeadFormFieldsProps {
  form: LeadFormData;
  onChange: (field: keyof LeadFormData, value: string) => void;
  projectTypes: ProjectType[];
  contacts?: Contact[] | undefined;
  mode?: FormMode;
  contactMode?: ContactMode;
  showLeadNumber?: boolean;
}

export interface EditContactModalProps {
  isOpen: boolean;
  onClose: (shouldRefetch?: boolean) => void;
  contact: Contact | null;
}

export interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTypes: ProjectType[];
  contacts: Contact[] | undefined;
  leadType: LeadType;
  onLeadCreated: (lead: Lead) => void;
}

export interface LeadSectionProps {
  title: string;
  data: Lead[];
  columns: Column<Lead>[];
  onEditLead?: (lead: Lead) => void;
  onDeleteLead?: (lead: Lead) => void;
}
