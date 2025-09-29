
import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";

import type { Contact } from "../models/Contact";

export type ContactIntegrityPolicies = Readonly<{
  maxNameLength?: number; 
  maxCompanyLength?: number; 
  phoneMinDigits?: number; 
  validateLastContactISO?: boolean; 
}>;

const DEFAULTS: Required<ContactIntegrityPolicies> = {
  maxNameLength: 140,
  maxCompanyLength: 140,
  phoneMinDigits: 7,
  validateLastContactISO: false,
};


function normText(s: unknown): string {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function isValidEmail(email?: string): boolean {
  if (!email) return true; 
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function countDigits(s?: string): number {
  if (!s) return 0;
  return s.replace(/\D+/g, "").length;
}

function isISODateOrDateTime(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+\-]\d{2}:\d{2})?)?$/.test(
    s
  );
}


export function ensureContactIntegrity(
  contact: Contact,
  policies: ContactIntegrityPolicies = {}
): void {
  const cfg = { ...DEFAULTS, ...policies };
  if (
    typeof contact.id !== "number" ||
    !Number.isFinite(contact.id) ||
    contact.id <= 0
  ) {
    throw new BusinessRuleError("INTEGRITY_VIOLATION", "Invalid contact id", {
      details: { field: "id", value: contact.id },
    });
  }
  const companyName = normText(contact.companyName);
  if (!companyName) {
    throw new BusinessRuleError(
      "VALIDATION_ERROR",
      "Company name must not be empty",
      { details: { field: "companyName" } }
    );
  }
  if (companyName.length > cfg.maxCompanyLength) {
    throw new BusinessRuleError(
      "FORMAT_ERROR",
      `Company name max length is ${cfg.maxCompanyLength}`,
      { details: { field: "companyName", length: companyName.length } }
    );
  }
  const name = normText(contact.name);
  if (!name) {
    throw new BusinessRuleError(
      "VALIDATION_ERROR",
      "Contact name must not be empty",
      { details: { field: "name" } }
    );
  }
  if (name.length > cfg.maxNameLength) {
    throw new BusinessRuleError(
      "FORMAT_ERROR",
      `Contact name max length is ${cfg.maxNameLength}`,
      { details: { field: "name", length: name.length } }
    );
  }
  if (contact.email && !isValidEmail(contact.email)) {
    throw new BusinessRuleError("FORMAT_ERROR", "Invalid email format", {
      details: { field: "email", value: contact.email },
    });
  }
  if (contact.phone && countDigits(contact.phone) < cfg.phoneMinDigits) {
    throw new BusinessRuleError(
      "FORMAT_ERROR",
      `Phone must contain at least ${cfg.phoneMinDigits} digits`,
      { details: { field: "phone", value: contact.phone } }
    );
  }
  if (
    cfg.validateLastContactISO &&
    contact.lastContact &&
    !isISODateOrDateTime(contact.lastContact)
  ) {
    throw new BusinessRuleError(
      "FORMAT_ERROR",
      "lastContact must be ISO-8601 date/datetime",
      { details: { field: "lastContact", value: contact.lastContact } }
    );
  }
}

export function isContactIntegrityOK(
  contact: Contact,
  policies: ContactIntegrityPolicies = {}
): boolean {
  try {
    ensureContactIntegrity(contact, policies);
    return true;
  } catch {
    return false;
  }
}
