
import type { Contact } from "@/features/contact/domain/models/Contact";
import type { Lead } from "@/features/leads/domain/models/Lead";
import type { ProjectType } from "@/features/leads/domain/models/ProjectType";
import type { LeadType } from "@/features/leads/enums";
import type { Column } from "@/types/components/table";

import type { ContactMode,FormMode } from "../enums";
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
