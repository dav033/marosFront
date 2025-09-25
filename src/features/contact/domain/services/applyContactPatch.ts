// src/features/contact/domain/services/applyContactPatch.ts

import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";

import type { Contact } from "../models/Contact";
// Si prefieres no cruzar features, define BusinessRuleError en contact/domain/errors y ajusta el import.
import type { ContactDraftPolicies } from "./ensureContactDraftIntegrity";

/* ----------------- Tipos ----------------- */

export type ContactPatch = Readonly<{
  companyName?: string;
  name?: string;
  phone?: string | undefined;
  email?: string | undefined;
  occupation?: string | undefined;
  product?: string | undefined;
  address?: string | undefined;
  /** ISO 8601 (YYYY-MM-DD o datetime). */
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

/* Puedes reutilizar la misma configuración de políticas que el draft */
const DEFAULTS: Required<ContactDraftPolicies> = {
  maxNameLength: 140,
  maxCompanyLength: 140,
  requireAtLeastOneReach: false,
  phoneMinDigits: 7,
  validateLastContactISO: false,
};

/* ----------------- Utils puras ----------------- */

function normText(s: unknown): string {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function normEmail(e?: string): string | undefined {
  if (!e) return undefined;
  const v = String(e).trim().toLowerCase();
  return v || undefined;
}

function normPhone(p?: string): string | undefined {
  if (!p) return undefined;
  const trimmed = String(p).trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("+")) {
    const rest = trimmed.slice(1).replace(/\D+/g, "");
    return rest ? `+${rest}` : undefined;
  }
  const digits = trimmed.replace(/\D+/g, "");
  return digits || undefined;
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

/* ----------------- Servicio principal ----------------- */

/**
 * Aplica un patch de forma PURA sobre un Contact:
 * - Normaliza campos de texto/email/teléfono.
 * - Valida formatos y longitudes configurables.
 * - Devuelve el contacto actualizado y un evento con la lista de campos cambiados.
 */
export function applyContactPatch(
  current: Contact,
  patch: ContactPatch,
  policies: ContactDraftPolicies = {}
): ApplyContactPatchResult {
  const cfg = { ...DEFAULTS, ...policies };

  let updated: Contact = { ...current };
  const changed: string[] = [];

  // companyName
  if (patch.companyName !== undefined) {
    const v = normText(patch.companyName);
    if (!v) {
      throw new BusinessRuleError(
        "VALIDATION_ERROR",
        "Company name must not be empty",
        { details: { field: "companyName" } }
      );
    }
    if (v.length > cfg.maxCompanyLength) {
      throw new BusinessRuleError(
        "FORMAT_ERROR",
        `Company name max length is ${cfg.maxCompanyLength}`,
        { details: { field: "companyName", length: v.length } }
      );
    }
    if (v !== normText(updated.companyName)) {
      updated = { ...updated, companyName: v };
      changed.push("companyName");
    }
  }

  // name
  if (patch.name !== undefined) {
    const v = normText(patch.name);
    if (!v) {
      throw new BusinessRuleError(
        "VALIDATION_ERROR",
        "Contact name must not be empty",
        { details: { field: "name" } }
      );
    }
    if (v.length > cfg.maxNameLength) {
      throw new BusinessRuleError(
        "FORMAT_ERROR",
        `Contact name max length is ${cfg.maxNameLength}`,
        { details: { field: "name", length: v.length } }
      );
    }
    if (v !== normText(updated.name)) {
      updated = { ...updated, name: v };
      changed.push("name");
    }
  }

  // email
  if (patch.email !== undefined) {
    const v = normEmail(patch.email);
    if (v && !isValidEmail(v)) {
      throw new BusinessRuleError("FORMAT_ERROR", "Invalid email format", {
        details: { field: "email", value: patch.email },
      });
    }
    const prev = normEmail(updated.email);
    if (v !== prev) {
      updated = { ...updated, email: v };
      changed.push("email");
    }
  }

  // phone
  if (patch.phone !== undefined) {
    const v = normPhone(patch.phone);
    if (v && countDigits(v) < cfg.phoneMinDigits) {
      throw new BusinessRuleError(
        "FORMAT_ERROR",
        `Phone must contain at least ${cfg.phoneMinDigits} digits`,
        { details: { field: "phone", value: patch.phone } }
      );
    }
    const prev = normPhone(updated.phone);
    if (v !== prev) {
      updated = { ...updated, phone: v };
      changed.push("phone");
    }
  }

  // occupation
  if (patch.occupation !== undefined) {
    const v = normText(patch.occupation);
    if (v !== normText(updated.occupation)) {
      updated = { ...updated, occupation: v || undefined };
      changed.push("occupation");
    }
  }

  // product
  if (patch.product !== undefined) {
    const v = normText(patch.product);
    if (v !== normText(updated.product)) {
      updated = { ...updated, product: v || undefined };
      changed.push("product");
    }
  }

  // address
  if (patch.address !== undefined) {
    const v = normText(patch.address);
    if (v !== normText(updated.address)) {
      updated = { ...updated, address: v || undefined };
      changed.push("address");
    }
  }

  // lastContact
  if (patch.lastContact !== undefined) {
    const v = normText(patch.lastContact) || undefined;
    if (v && cfg.validateLastContactISO && !isISODateOrDateTime(v)) {
      throw new BusinessRuleError(
        "FORMAT_ERROR",
        "lastContact must be ISO-8601 date/datetime",
        { details: { field: "lastContact", value: patch.lastContact } }
      );
    }
    const prev = normText(updated.lastContact) || undefined;
    if (v !== prev) {
      updated = { ...updated, lastContact: v };
      changed.push("lastContact");
    }
  }

  // (opcional) política: al menos un medio de contacto
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
