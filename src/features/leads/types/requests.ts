// src/features/leads/types/requests.ts

import type { LeadStatus, LeadType } from "./enums";
import type { Contacts, ProjectType } from "../../../types/domain/entities";

export interface CreateLeadRequest {
  leadNumber?: string;
  name: string;
  startDate: string;
  location?: string;
  status: LeadStatus | null;
  contact?: CreateContactRequest;
  projectType: ProjectType;
  leadType: LeadType;
}

export interface CreateContactRequest {
  companyName: string;
  name: string;
  occupation?: string;
  product?: string;
  phone?: string;
  email?: string;
  address?: string;
  lastContact?: string;
}

// Helper interfaces for lead creation
export interface CreateLeadByNewContactData {
  leadNumber?: string;
  leadName: string;
  customerName: string;
  contactName: string;
  phone: string;
  email: string;
  projectTypeId: number;
  location: string;
  leadType: LeadType;
  startDate?: string;
}

export interface CreateLeadByExistingContactData {
  leadNumber?: string;
  leadName: string;
  contactId: number;
  projectTypeId: number;
  location: string;
  leadType: LeadType;
  startDate?: string;
}

export interface UpdateLeadData {
  id: number;
  leadNumber?: string;
  name?: string;
  startDate?: string;
  location?: string;
  status?: LeadStatus;
  contactId?: number;
  projectTypeId?: number;
}
