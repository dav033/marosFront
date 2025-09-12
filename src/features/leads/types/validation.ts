// src/features/leads/types/validation.ts

import type { LeadStatus } from "./enums";

/**
 * Data structure for validating a new contact lead
 */
export interface ValidateNewContactLeadData {
  leadNumber?: string;
  leadName: string;
  customerName: string;
  contactName: string;
  projectTypeId: string;
  email?: string;
}

/**
 * Data structure for validating an existing contact lead
 */
export interface ValidateExistingContactLeadData {
  leadNumber?: string;
  leadName: string;
  contactId: string;
  projectTypeId: string;
}

/**
 * Data structure for validating lead edits
 */
export interface ValidateEditLeadData {
  projectTypeId: number | undefined;
  contactId: number | undefined;
}

/**
 * Lead data structure for editing operations
 */
export interface LeadForEdit {
  id: number;
  name: string;
  location?: string;
  status: LeadStatus | null;
  contact?: { id: number };
  projectType?: { id: number };
  startDate?: string;
}
