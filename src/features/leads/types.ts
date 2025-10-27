// src/features/leads/types.ts
import type { ISODate } from "@/shared";

import type { Lead } from "./domain";
import type { LeadStatus, LeadType } from "./enums";

export type {
  Clock,
  Err,
  ISODate,
  ISODateTime,
  Ok,
  Result,
} from "@/shared";
export { err, ok, SystemClock } from "@/shared";

export type LeadId = number;
export type ContactId = number;
export type ProjectTypeId = number;

export type NewContact = Readonly<{
  companyName: string;
  name: string;
  phone: string;
  email: string;
}>;

export type LeadPolicies = Readonly<{
  leadNumberPattern?: RegExp;
  defaultStatus?: LeadStatus | null;
}>;

export type LeadDraftBase = Readonly<{
  leadNumber: string | null;
  name: string;
  startDate: ISODate;
  location: string;
  status: LeadStatus | null;
  projectTypeId: ProjectTypeId;
  leadType: LeadType;
}>;

export type LeadDraftWithNewContact = LeadDraftBase &
  Readonly<{
    contact: NewContact;
  }>;

export type LeadDraftWithExistingContact = LeadDraftBase &
  Readonly<{
    contactId: ContactId;
  }>;

export type LeadDraft = LeadDraftWithNewContact | LeadDraftWithExistingContact;

export type LeadStatusChangedEvent = Readonly<{
  type: "LeadStatusChanged";
  payload: {
    id: number;
    from: LeadStatus;
    to: LeadStatus;
    at: number; // epoch ms
  };
}>;

export type DomainEvent = LeadStatusChangedEvent;

export type LeadPatch = Readonly<{
  name?: string;
  location?: string;
  status?: LeadStatus | null;
  contactId?: number;
  projectTypeId?: number;
  startDate?: ISODate;
  leadNumber?: string | null; // ← unificado a string | null
}>;

export type LeadPatchPolicies = Readonly<{
  leadNumberPattern?: RegExp;
  allowedTransitions?: Partial<Record<LeadStatus, LeadStatus[]>>;
}>;

export type ApplyLeadPatchResult = Readonly<{
  lead: Lead;
  events: DomainEvent[];
}>;

export type LeadNumberRules = Readonly<{
  trim?: boolean;
  collapseWhitespace?: boolean;
  uppercase?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  allowEmpty?: boolean;
}>;

export type { Lead };
