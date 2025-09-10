/**
 * Lead and Contact component types
 */

import type { LeadFormData, ProjectType, Contacts } from "../index";
import type { FormMode, ContactMode } from "../enums";

// ===========================================
// LEAD COMPONENTS
// ===========================================

export interface LeadFormFieldsProps {
  form: LeadFormData;
  onChange: (field: keyof LeadFormData, value: string) => void;
  projectTypes: ProjectType[];
  contacts?: Contacts[];
  mode?: FormMode;
  contactMode?: ContactMode;
  // Optional override to explicitly show/hide the Lead Number field
  showLeadNumber?: boolean;
}

// ===========================================
// CONTACT COMPONENTS
// ===========================================

export interface EditContactModalProps {
  isOpen: boolean;
  onClose: (shouldRefetch?: boolean) => void;
  contact: Contacts | null;
}

export interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTypes: ProjectType[];
  contacts: Contacts[];
  leadType: import("../enums").LeadType;
  onLeadCreated: (lead: import("../index").Lead) => void;
}

export interface LeadSectionProps {
  title: string;
  data: import("../index").Lead[];
  columns: import("../index").Column<import("../index").Lead>[];
  onEditLead?: (lead: import("../index").Lead) => void;
  onDeleteLead?: (lead: import("../index").Lead) => void;
}
