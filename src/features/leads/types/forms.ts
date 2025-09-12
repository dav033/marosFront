// src/features/leads/types/forms.ts

import type { LeadStatus, LeadType } from "./enums";

export interface LeadFormData {
  leadNumber?: string;
  name?: string;
  leadName?: string; // Alias for compatibility
  startDate?: string;
  location?: string;
  status?: LeadStatus | null | string;
  projectTypeId?: number | string;
  leadType?: LeadType;
  contactId?: number | string;
  
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
