// src/features/contact/domain/services/buildContactDraft.ts

import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";
// Si prefieres no cruzar features, duplica BusinessRuleError en contact/domain/errors y cambia este import.

export type ContactDraft = Readonly<{
  companyName: string;
  name: string;
  phone?: string;
  email?: string;
  occupation?: string;
  product?: string;
  address?: string;
  /** ISO 8601 (ej. "2025-09-12T10:30:00Z"), opcional */
  lastContact?: string;
}>;

/* ----------------- Utils puras ----------------- */
function normText(s: unknown): string {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalización mínima: deja sólo dígitos y un posible '+' inicial. NO valida. */
function normPhone(p?: string): string | undefined {
  if (!p) return undefined;
  const trimmed = String(p).trim();
  // conserva '+' inicial si existe y remueve no dígitos del resto
  if (trimmed.startsWith("+")) {
    const rest = trimmed.slice(1).replace(/\D+/g, "");
    return rest ? `+${rest}` : undefined;
  }
  const digits = trimmed.replace(/\D+/g, "");
  return digits || undefined;
}

/** Normalización simple de email (lowercase + trim). Validación va en ensureContactDraftIntegrity. */
function normEmail(e?: string): string | undefined {
  if (!e) return undefined;
  const v = String(e).trim().toLowerCase();
  return v || undefined;
}

/* ----------------- Servicio principal ----------------- */

/**
 * Construye un borrador de Contacto listo para validación/persistencia.
 * - Normaliza textos (trim/colapsa espacios)
 * - Normaliza teléfono/email (sin validar formato aquí)
 * - Verifica mínimos duros: companyName y name no vacíos
 */
export function buildContactDraft(input: {
  companyName: string;
  name: string;
  phone?: string;
  email?: string;
  occupation?: string;
  product?: string;
  address?: string;
  lastContact?: string;
}): ContactDraft {
  const companyName = normText(input.companyName);
  const name = normText(input.name);

  if (!companyName) {
    throw new BusinessRuleError(
      "VALIDATION_ERROR",
      "Company name must not be empty",
      {
        details: { field: "companyName" },
      }
    );
  }
  if (!name) {
    throw new BusinessRuleError(
      "VALIDATION_ERROR",
      "Contact name must not be empty",
      {
        details: { field: "name" },
      }
    );
  }

  const draft: ContactDraft = {
    companyName,
    name,
    phone: normPhone(input.phone),
    email: normEmail(input.email),
    occupation: normText(input.occupation),
    product: normText(input.product),
    address: normText(input.address),
    lastContact: normText(input.lastContact) || undefined,
  };

  return draft;
}
