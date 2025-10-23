import type { Clock, ContactId, ISODate, LeadDraftWithExistingContact, LeadDraftWithNewContact, LeadPolicies, LeadStatus, LeadType, NewContact, ProjectTypeId } from "@/leads";
import { BusinessRuleError } from "@/shared";

import { ensureLeadDraftIntegrity } from "./ensureLeadDraftIntegrity";
import {
  ensureNewContactMinimums,
  normalizeNewContact,
} from "./leadContactLinkPolicy";
import { makeLeadNumber } from "./leadNumberPolicy";

type CommonInput = Readonly<{
  leadNumber?: string | null;
  leadName: string;
  location: string;
  projectTypeId: ProjectTypeId;
  leadType: LeadType;
}>;

function normalizeText(s: string): string {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function validateLeadName(raw: string): string {
  const v = normalizeText(raw);
  if (!v) {
    throw new BusinessRuleError(
      "VALIDATION_ERROR",
      "Lead name must not be empty",
      { details: { field: "leadName" } }
    );
  }
  if (v.length > 140) {
    throw new BusinessRuleError("FORMAT_ERROR", "Lead name max length is 140", {
      details: { field: "leadName", length: v.length },
    });
  }
  return v;
}

export function buildLeadDraftForNewContact(
  clock: Clock,
  input: CommonInput & { contact: NewContact },
  policies: LeadPolicies = {}
): LeadDraftWithNewContact {
  const name = validateLeadName(input.leadName);

  const numberRules = policies.leadNumberPattern
    ? { pattern: policies.leadNumberPattern }
    : undefined;
  const leadNumber = makeLeadNumber(input.leadNumber, numberRules); 

  const normalizedContact = normalizeNewContact(input.contact);
  ensureNewContactMinimums(normalizedContact);

  const draft: LeadDraftWithNewContact = {
    leadNumber,
    name,
    startDate: clock.todayISO() as ISODate,
    location: normalizeText(input.location),
    status: (policies.defaultStatus ?? null) as LeadStatus | null,
    projectTypeId: input.projectTypeId,
    leadType: input.leadType,
    contact: normalizedContact,
  };

  ensureLeadDraftIntegrity(draft, policies);
  return draft;
}

export function buildLeadDraftForExistingContact(
  clock: Clock,
  input: CommonInput & { contactId: ContactId },
  policies: LeadPolicies = {}
): LeadDraftWithExistingContact {
  const name = validateLeadName(input.leadName);

  const numberRules = policies.leadNumberPattern
    ? { pattern: policies.leadNumberPattern }
    : undefined;
  const leadNumber = makeLeadNumber(input.leadNumber, numberRules); 

  const draft: LeadDraftWithExistingContact = {
    leadNumber,
    name,
    startDate: clock.todayISO() as ISODate,
    location: normalizeText(input.location),
    status: (policies.defaultStatus ?? null) as LeadStatus | null,
    projectTypeId: input.projectTypeId,
    leadType: input.leadType,
    contactId: input.contactId,
  };

  ensureLeadDraftIntegrity(draft, policies);
  return draft;
}
