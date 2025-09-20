// maros-app/src/features/leads/domain/services/buildLeadDraft.ts

import { BusinessRuleError } from "../errors/BusinessRuleError";
import { makeLeadNumber } from "./leadNumberPolicy";
import {
  normalizeNewContact,
  ensureNewContactMinimums,
} from "./leadContactLinkPolicy";
import { ensureLeadDraftIntegrity } from "./ensureLeadDraftIntegrity";

import type { LeadType, LeadStatus } from "../../enums";
import type {
  ProjectTypeId,
  Clock,
  NewContact,
  LeadPolicies,
  LeadDraftWithNewContact,
  ISODate,
  ContactId,
  LeadDraftWithExistingContact,
} from "../../types";

/** Entradas comunes para construir un LeadDraft. */
type CommonInput = Readonly<{
  leadNumber?: string | null;
  leadName: string;
  location: string;
  projectTypeId: ProjectTypeId;
  leadType: LeadType;
}>;

/** Normaliza string (trim + colapsa espacios internos). */
function normalizeText(s: string): string {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

/** Valida nombre del lead. */
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

/**
 * Construye un LeadDraft cuando el contacto es NUEVO (sin ID).
 */
export function buildLeadDraftForNewContact(
  clock: Clock,
  input: CommonInput & { contact: NewContact },
  policies: LeadPolicies = {}
): LeadDraftWithNewContact {
  const name = validateLeadName(input.leadName);

  const numberRules = policies.leadNumberPattern
    ? { pattern: policies.leadNumberPattern }
    : undefined;
  const leadNumber = makeLeadNumber(input.leadNumber, numberRules); // string | null

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

/**
 * Construye un LeadDraft cuando el contacto YA EXISTE (contactId).
 */
export function buildLeadDraftForExistingContact(
  clock: Clock,
  input: CommonInput & { contactId: ContactId },
  policies: LeadPolicies = {}
): LeadDraftWithExistingContact {
  const name = validateLeadName(input.leadName);

  const numberRules = policies.leadNumberPattern
    ? { pattern: policies.leadNumberPattern }
    : undefined;
  const leadNumber = makeLeadNumber(input.leadNumber, numberRules); // string | null

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
