import type { ISODate } from '@/shared';

import type { Project } from './domain';
import type { InvoiceStatus, ProjectStatus } from './enums';

export type { Clock, Err, ISODate, ISODateTime, Ok, Result } from '@/shared';
export { err, ok, SystemClock } from '@/shared';

export type ProjectId = number;
export type LeadId = number;

export interface ProjectPolicies {
  requireLead?: boolean;
  requireProjectName?: boolean;
  allowEmptyPayments?: boolean;
}

export interface ProjectDraft {
  projectName: string;
  overview?: string;
  payments?: number[];
  projectStatus?: ProjectStatus;
  invoiceStatus?: InvoiceStatus;
  quickbooks?: boolean;
  startDate?: ISODate;
  endDate?: ISODate;
  leadId?: LeadId;
}

export interface ProjectPatch {
  projectName?: string;
  overview?: string;
  payments?: number[];
  projectStatus?: ProjectStatus;
  invoiceStatus?: InvoiceStatus;
  quickbooks?: boolean;
  startDate?: ISODate;
  endDate?: ISODate;
  leadId?: LeadId;
}

export interface ApplyProjectPatchResult {
  project: Project;
  hasChanges: boolean;
}

export interface DomainEvent {
  type: string;
  aggregateId: string;
  timestamp: number;
  payload: unknown;
}

export interface ProjectWithLeadView {
  id: number;
  projectName: string;
  overview?: string;
  projectStatus?: string;
  invoiceStatus?: string;
  quickbooks?: boolean;
  startDate?: string; // ISODate
  endDate?: string; // ISODate

  leadId?: number;
  leadName?: string;
  leadNumber?: string;

  location?: string;
  contactName?: string;
  customerName?: string;
  email?: string;
  phone?: string;
}
