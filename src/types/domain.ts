// src/types/domain.ts

import type {
  LeadStatus,
  LeadType,
  ProjectStatus,
  InvoiceStatus,
} from "./enums";

export interface Contacts {
  id: number;
  companyName: string;
  name: string;
  occupation?: string;
  product?: string;
  phone?: string;
  email?: string;
  address?: string;
  lastContact?: string;
}

export interface ProjectType {
  id: number;
  name: string;
  color: string;
}

export interface Lead {
  id: number;
  leadNumber: string;
  name: string;
  startDate: string;
  location?: string;
  status: LeadStatus | null;
  contact: Contacts;
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

export interface Project {
  id: number;
  projectName: string;
  overview?: string;
  payments?: number[];
  projectStatus: ProjectStatus;
  invoiceStatus: InvoiceStatus;
  quickbooks?: boolean;
  startDate?: string;
  endDate?: string;
  lead: Lead;
}
