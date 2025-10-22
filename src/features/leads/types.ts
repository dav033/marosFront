
import type { Lead } from "@/features/leads/domain/models/Lead";

import type { LeadStatus, LeadType } from "./enums";

export type ContactId = number;
export type ProjectTypeId = number;
export type ISODate = string; 
export type ISODateTime = string; 

export interface Clock {
  now(): number; 
  todayISO(): ISODate; 
}

export const SystemClock: Clock = {
  now: () => Date.now(),
  todayISO: () => new Date().toISOString().split("T")[0] as ISODate,
};

export type Ok<T> = { ok: true; value: T };
export type Err<E> = { ok: false; error: E };
export type Result<T, E> = Ok<T> | Err<E>;
export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const err = <E>(error: E): Err<E> => ({ ok: false, error });

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
    at: number; 
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
  leadNumber?: number | null;
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
