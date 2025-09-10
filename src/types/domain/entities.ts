// src/types/domain/entities.ts

import type {
  LeadStatus,
  LeadType,
  ProjectStatus,
  InvoiceStatus,
} from "../enums";

// ===========================================
// CORE DOMAIN ENTITIES
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
  lastContact?: string;
  [key: string]: unknown;
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
  status: LeadStatus;
  contact: Contacts;
  projectType: ProjectType;
  leadType: LeadType;
  description?: string;
  budget?: number;
  estimatedEndDate?: string;
  actualEndDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  lead: Lead;
  budget?: number;
  actualCost?: number;
  progress?: number;
  team?: string[];
  documents?: Document[];
}

export interface Invoice {
  id: number;
  number: string;
  projectId: number;
  leadId: number;
  amount: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  description?: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Document {
  id: number;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  projectId?: number;
  leadId?: number;
}
