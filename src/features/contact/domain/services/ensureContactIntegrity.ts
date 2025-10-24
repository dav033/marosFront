import type { Contact } from "@/contact";
import { BusinessRuleError, countDigits, isISODateOrDateTime, isValidEmail, normalizeText } from "@/shared";

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

export function ensureContactIntegrity(
  contact: Contact,
  policies: ContactIntegrityPolicies = {}
): void {
  const cfg = { ...DEFAULTS, ...policies };

  if (typeof contact.id !== "number" || !Number.isFinite(contact.id) || contact.id <= 0) {
    throw new BusinessRuleError("INTEGRITY_VIOLATION", "Invalid contact id", {
      details: { field: "id", value: contact.id },
    });
  }

  const companyName = normalizeText(contact.companyName);
  if (!companyName) {
    throw new BusinessRuleError("VALIDATION_ERROR", "Company name must not be empty", {
      details: { field: "companyName" },
    });
  }
  if (companyName.length > cfg.maxCompanyLength) {
    throw new BusinessRuleError(
      "FORMAT_ERROR",
      `Company name max length is ${cfg.maxCompanyLength}`,
      { details: { field: "companyName", length: companyName.length } }
    );
  }

  const name = normalizeText(contact.name);
  if (!name) {
    throw new BusinessRuleError("VALIDATION_ERROR", "Contact name must not be empty", {
      details: { field: "name" },
    });
  }
  if (name.length > cfg.maxNameLength) {
    throw new BusinessRuleError("FORMAT_ERROR", `Contact name max length is ${cfg.maxNameLength}`, {
      details: { field: "name", length: name.length },
    });
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

  if (cfg.validateLastContactISO && contact.lastContact && !isISODateOrDateTime(contact.lastContact)) {
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
