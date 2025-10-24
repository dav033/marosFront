import { BusinessRuleError, countDigits, isISODateOrDateTime, isValidEmail } from "@/shared";

import type { ContactDraft } from "./buildContactDraft";

export type ContactDraftPolicies = Readonly<{
  maxNameLength?: number;
  maxCompanyLength?: number;
  requireAtLeastOneReach?: boolean;
  phoneMinDigits?: number;
  validateLastContactISO?: boolean;
}>;

const DEFAULTS: Required<ContactDraftPolicies> = {
  maxNameLength: 140,
  maxCompanyLength: 140,
  requireAtLeastOneReach: false,
  phoneMinDigits: 7,
  validateLastContactISO: false,
};

export function ensureContactDraftIntegrity(
  draft: ContactDraft,
  policies: ContactDraftPolicies = {}
): void {
  const cfg = { ...DEFAULTS, ...policies };

  if (!draft.companyName) {
    throw new BusinessRuleError("VALIDATION_ERROR", "Company name must not be empty", {
      details: { field: "companyName" },
    });
  }
  if (!draft.name) {
    throw new BusinessRuleError("VALIDATION_ERROR", "Contact name must not be empty", {
      details: { field: "name" },
    });
  }
  if (draft.name.length > cfg.maxNameLength) {
    throw new BusinessRuleError(
      "FORMAT_ERROR",
      `Contact name max length is ${cfg.maxNameLength}`,
      { details: { field: "name", length: draft.name.length } }
    );
  }
  if (draft.companyName.length > cfg.maxCompanyLength) {
    throw new BusinessRuleError(
      "FORMAT_ERROR",
      `Company name max length is ${cfg.maxCompanyLength}`,
      { details: { field: "companyName", length: draft.companyName.length } }
    );
  }

  if (cfg.requireAtLeastOneReach && !draft.email && !draft.phone) {
    throw new BusinessRuleError(
      "VALIDATION_ERROR",
      "Provide at least one contact method (email or phone)",
      { details: { fields: ["email", "phone"] } }
    );
  }
  if (draft.email && !isValidEmail(draft.email)) {
    throw new BusinessRuleError("FORMAT_ERROR", "Invalid email format", {
      details: { field: "email", value: draft.email },
    });
  }
  if (draft.phone && countDigits(draft.phone) < cfg.phoneMinDigits) {
    throw new BusinessRuleError(
      "FORMAT_ERROR",
      `Phone must contain at least ${cfg.phoneMinDigits} digits`,
      { details: { field: "phone", value: draft.phone } }
    );
  }
  if (cfg.validateLastContactISO && draft.lastContact && !isISODateOrDateTime(draft.lastContact)) {
    throw new BusinessRuleError(
      "FORMAT_ERROR",
      "lastContact must be ISO-8601 date/datetime",
      { details: { field: "lastContact", value: draft.lastContact } }
    );
  }
}
