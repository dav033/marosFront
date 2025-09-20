// src/features/leads/domain/services/ensureLeadDraftIntegrity.ts

import { BusinessRuleError } from "../errors/BusinessRuleError";
import type {
  LeadDraft,
  LeadDraftWithNewContact,
  LeadDraftWithExistingContact,
  LeadPolicies,
} from "../../types";
import { ensureNewContactMinimums } from "./leadContactLinkPolicy";

/* Utils */
function normalizeText(s: unknown): string {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}
function isIsoLocalDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

/**
 * Valida la integridad de un LeadDraft (antes de mapear/persistir).
 * Lanza BusinessRuleError si alguna regla no se cumple.
 */
export function ensureLeadDraftIntegrity(
  draft: LeadDraft,
  policies: LeadPolicies = {}
): void {
  // name
  const name = normalizeText((draft as any).name);
  if (!name) {
    throw new BusinessRuleError("VALIDATION_ERROR", "Lead name must not be empty", {
      details: { field: "name" },
    });
  }
  if (name.length > 140) {
    throw new BusinessRuleError("FORMAT_ERROR", "Lead name max length is 140", {
      details: { field: "name", length: name.length },
    });
  }

  // startDate
  const sd = normalizeText((draft as any).startDate);
  if (!sd || !isIsoLocalDate(sd)) {
    throw new BusinessRuleError(
      "FORMAT_ERROR",
      "startDate must be in YYYY-MM-DD format",
      { details: { field: "startDate", value: (draft as any).startDate } }
    );
  }

  // projectTypeId
  if (
    typeof (draft as any).projectTypeId !== "number" ||
    !Number.isFinite((draft as any).projectTypeId) ||
    (draft as any).projectTypeId <= 0
  ) {
    throw new BusinessRuleError(
      "INTEGRITY_VIOLATION",
      "projectTypeId must be a positive number",
      { details: { field: "projectTypeId", value: (draft as any).projectTypeId } }
    );
  }

  // Variante de contacto: XOR entre contact y contactId
  if ((draft as LeadDraftWithNewContact).contact) {
    ensureNewContactMinimums((draft as LeadDraftWithNewContact).contact);
  } else if ((draft as LeadDraftWithExistingContact).contactId != null) {
    const id = (draft as LeadDraftWithExistingContact).contactId;
    if (typeof id !== "number" || !Number.isFinite(id) || id <= 0) {
      throw new BusinessRuleError(
        "INTEGRITY_VIOLATION",
        "contactId must be a positive number",
        { details: { field: "contactId", value: id } }
      );
    }
  } else {
    throw new BusinessRuleError(
      "VALIDATION_ERROR",
      "Either contact or contactId must be provided",
      { details: { fields: ["contact", "contactId"] } }
    );
  }

  // leadNumber (opcional) — valida patrón si viene en políticas
  if (policies.leadNumberPattern && draft.leadNumber) {
    if (!policies.leadNumberPattern.test(draft.leadNumber)) {
      throw new BusinessRuleError("FORMAT_ERROR", "Lead number format is invalid", {
        details: { field: "leadNumber", value: draft.leadNumber },
      });
    }
  }
}

/** Variante que devuelve boolean en lugar de lanzar. */
export function isLeadDraftIntegrityOK(
  draft: LeadDraft,
  policies: LeadPolicies = {}
): boolean {
  try {
    ensureLeadDraftIntegrity(draft, policies);
    return true;
  } catch {
    return false;
  }
}
