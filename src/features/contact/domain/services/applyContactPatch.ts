import type { Contact } from "@/contact";
import { BusinessRuleError, countDigits, isISODateOrDateTime, isValidEmail, normalizeEmail, normalizePhone, normalizeText } from "@/shared";


import type { ContactDraftPolicies } from "./ensureContactDraftIntegrity";

export type ContactPatch = Readonly<{
  companyName?: string;
  name?: string;
  phone?: string | undefined;
  email?: string | undefined;
  occupation?: string | undefined;
  product?: string | undefined;
  address?: string | undefined;
  lastContact?: string | undefined;
}>;

export type ApplyContactPatchResult = Readonly<{
  contact: Contact;
  events: ReadonlyArray<
    Readonly<{
      type: "ContactUpdated";
      payload: { id: number; changed: string[] };
    }>
  >;
}>;

const DEFAULTS: Required<ContactDraftPolicies> = {
  maxNameLength: 140,
  maxCompanyLength: 140,
  requireAtLeastOneReach: false,
  phoneMinDigits: 7,
  validateLastContactISO: false,
};

export function applyContactPatch(
  current: Contact,
  patch: ContactPatch,
  policies: ContactDraftPolicies = {}
): ApplyContactPatchResult {
  const cfg = { ...DEFAULTS, ...policies };
  let updated: Contact = { ...current };
  const changed: string[] = [];

  if (patch.companyName !== undefined) {
    const v = normalizeText(patch.companyName);
    if (!v) {
      throw new BusinessRuleError("VALIDATION_ERROR", "Company name must not be empty", {
        details: { field: "companyName" },
      });
    }
    if (v.length > cfg.maxCompanyLength) {
      throw new BusinessRuleError(
        "FORMAT_ERROR",
        `Company name max length is ${cfg.maxCompanyLength}`,
        { details: { field: "companyName", length: v.length } }
      );
    }
    const prev = normalizeText(updated.companyName);
    if (v !== prev) {
      updated = { ...updated, companyName: v };
      changed.push("companyName");
    }
  }

  if (patch.name !== undefined) {
    const v = normalizeText(patch.name);
    if (!v) {
      throw new BusinessRuleError("VALIDATION_ERROR", "Contact name must not be empty", {
        details: { field: "name" },
      });
    }
    if (v.length > cfg.maxNameLength) {
      throw new BusinessRuleError(
        "FORMAT_ERROR",
        `Contact name max length is ${cfg.maxNameLength}`,
        { details: { field: "name", length: v.length } }
      );
    }
    const prev = normalizeText(updated.name);
    if (v !== prev) {
      updated = { ...updated, name: v };
      changed.push("name");
    }
  }

  if (patch.email !== undefined) {
    const v = normalizeEmail(patch.email);
    if (v && !isValidEmail(v)) {
      throw new BusinessRuleError("FORMAT_ERROR", "Invalid email format", {
        details: { field: "email", value: patch.email },
      });
    }
    const prev = normalizeEmail(updated.email);
    if (v !== prev) {
      updated = { ...updated, email: v };
      changed.push("email");
    }
  }

  if (patch.phone !== undefined) {
    const v = normalizePhone(patch.phone);
    if (v && countDigits(v) < cfg.phoneMinDigits) {
      throw new BusinessRuleError(
        "FORMAT_ERROR",
        `Phone must contain at least ${cfg.phoneMinDigits} digits`,
        { details: { field: "phone", value: patch.phone } }
      );
    }
    const prev = normalizePhone(updated.phone);
    if (v !== prev) {
      updated = { ...updated, phone: v };
      changed.push("phone");
    }
  }

  if (patch.occupation !== undefined) {
    const v = normalizeText(patch.occupation) || undefined;
    if (v !== (updated.occupation || undefined)) {
      updated = { ...updated, occupation: v };
      changed.push("occupation");
    }
  }

  if (patch.product !== undefined) {
    const v = normalizeText(patch.product) || undefined;
    if (v !== (updated.product || undefined)) {
      updated = { ...updated, product: v };
      changed.push("product");
    }
  }

  if (patch.address !== undefined) {
    const v = normalizeText(patch.address) || undefined;
    if (v !== (updated.address || undefined)) {
      updated = { ...updated, address: v };
      changed.push("address");
    }
  }

  if (patch.lastContact !== undefined) {
    const v = normalizeText(patch.lastContact) || undefined;
    if (cfg.validateLastContactISO && v && !isISODateOrDateTime(v)) {
      throw new BusinessRuleError("FORMAT_ERROR", "lastContact must be ISO-8601 date/datetime", {
        details: { field: "lastContact", value: patch.lastContact },
      });
    }
    const prev = normalizeText(updated.lastContact) || undefined;
    if (v !== prev) {
      updated = { ...updated, lastContact: v };
      changed.push("lastContact");
    }
  }

  if (cfg.requireAtLeastOneReach) {
    const hasEmail = !!updated.email;
    const hasPhone = !!updated.phone;
    if (!hasEmail && !hasPhone) {
      throw new BusinessRuleError(
        "VALIDATION_ERROR",
        "Provide at least one contact method (email or phone)",
        { details: { fields: ["email", "phone"] } }
      );
    }
  }

  const events =
    changed.length > 0
      ? [
          {
            type: "ContactUpdated" as const,
            payload: { id: updated.id, changed },
          },
        ]
      : [];

  return { contact: updated, events };
}
