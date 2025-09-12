// src/types/domain/entities.ts

import type {
  LeadStatus,
  LeadType,
  ProjectStatus,
  InvoiceStatus,
} from "../enums";

// ===========================================
// CORE DOMAIN ENTITIES (Based on Backend DTOs)
// ===========================================

export interface Contacts {
  id: number;
  companyName: string;
  name: string;
  occupation?: string;
  product?: string;
  phone?: string;
  email?: string;
  address?: string;
  lastContact?: string; // LocalDateTime from backend, received as ISO string
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
  startDate: string; // LocalDate from backend, received as ISO string
  location?: string;
  status: LeadStatus;
  contact: Contacts;
  projectType: ProjectType;
  leadType: LeadType;
}

export interface Project {
  id: number;
  projectName: string; // Backend uses 'projectName' not 'name'
  overview?: string; // Backend uses 'overview' not 'description'
  payments?: number[]; // List<Float> from backend
  projectStatus: ProjectStatus;
  invoiceStatus: InvoiceStatus;
  quickbooks?: boolean;
  startDate?: string; // LocalDate from backend, received as ISO string
  endDate?: string; // LocalDate from backend, received as ISO string
  lead: Lead;
}
