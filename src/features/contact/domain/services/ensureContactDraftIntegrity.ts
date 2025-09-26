
import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";
import type { ContactDraft } from "./buildContactDraft";

export type ContactDraftPolicies = Readonly<{
  maxNameLength?: number; // default 140
  maxCompanyLength?: number; // default 140
  requireAtLeastOneReach?: boolean; // exigir phone o email (default false)
  phoneMinDigits?: number; // default 7
  validateLastContactISO?: boolean; // default false (si true, exige ISO-8601 parseable)
}>;

const DEFAULTS: Required<ContactDraftPolicies> = {
  maxNameLength: 140,
  maxCompanyLength: 140,
  requireAtLeastOneReach: false,
  phoneMinDigits: 7,
  validateLastContactISO: false,
};

/* ----------------- helpers ----------------- */

function isValidEmail(email?: string): boolean {
  if (!email) return true; // vacío es permitido a menos que la política diga lo contrario
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function countDigits(s?: string): number {
  if (!s) return 0;
  const digits = s.replace(/\D+/g, "");
  return digits.length;
}

function isISODateOrDateTime(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+\-]\d{2}:\d{2})?)?$/.test(
    s
  );
}

/* ----------------- servicio ----------------- */

export function ensureContactDraftIntegrity(
  draft: ContactDraft,
  policies: ContactDraftPolicies = {}
): void {
  const cfg = { ...DEFAULTS, ...policies };
  if (!draft.companyName) {
    throw new BusinessRuleError(
      "VALIDATION_ERROR",
      "Company name must not be empty",
      {
        details: { field: "companyName" },
      }
    );
  }
  if (!draft.name) {
    throw new BusinessRuleError(
      "VALIDATION_ERROR",
      "Contact name must not be empty",
      {
        details: { field: "name" },
      }
    );
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
  if (
    cfg.validateLastContactISO &&
    draft.lastContact &&
    !isISODateOrDateTime(draft.lastContact)
  ) {
    throw new BusinessRuleError(
      "FORMAT_ERROR",
      "lastContact must be ISO-8601 date/datetime",
      {
        details: { field: "lastContact", value: draft.lastContact },
      }
    );
  }
}
