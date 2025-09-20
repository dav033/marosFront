// maros-app/src/features/leads/domain/services/leadContactLinkPolicy.ts

import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";
import type { ContactId, NewContact } from "../../types";

/**
 * Normaliza strings: trim + colapsa espacios internos.
 */
function normalizeText(s: string): string {
  return String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normaliza los campos del contacto nuevo.
 */
export function normalizeNewContact(input: NewContact): NewContact {
  return {
    companyName: normalizeText(input.companyName),
    name: normalizeText(input.name),
    phone: normalizeText(input.phone),
    email: normalizeText(input.email),
  };
}

/**
 * Valida mínimos del contacto nuevo según la política de negocio.
 * Requisitos recomendados (ajuste si su backend exige otros):
 *  - name: requerido (no vacío)
 *  - email: requerido (no vacío)  ← si su backend permite vacío, quite esta regla
 *  - phone: opcional
 */
export function ensureNewContactMinimums(contact: NewContact): void {
  if (!contact.name) {
    throw new BusinessRuleError(
      "VALIDATION_ERROR",
      "Contact name must not be empty",
      { details: { field: "contact.name" } }
    );
  }
  if (!contact.email) {
    throw new BusinessRuleError(
      "VALIDATION_ERROR",
      "Contact email must not be empty",
      { details: { field: "contact.email" } }
    );
  }
}

/**
 * Garantiza la **exclusión** entre `contact` y `contactId`:
 *  - Debe venir **exactamente uno** de los dos.
 */
export function ensureExclusiveContactLink(args: {
  contact?: NewContact;
  contactId?: ContactId;
}): void {
  const hasNew = !!args.contact;
  const hasId = args.contactId !== undefined && args.contactId !== null;

  if (hasNew && hasId) {
    throw new BusinessRuleError(
      "INTEGRITY_VIOLATION",
      "Provide either contact or contactId, not both",
      { details: { fields: ["contact", "contactId"] } }
    );
  }
  if (!hasNew && !hasId) {
    throw new BusinessRuleError(
      "VALIDATION_ERROR",
      "Either contact or contactId must be provided",
      { details: { fields: ["contact", "contactId"] } }
    );
  }
}

/**
 * Resultado canónico de la política para capas superiores.
 */
export type ContactLink =
  | Readonly<{ kind: "new"; contact: NewContact }>
  | Readonly<{ kind: "existing"; contactId: ContactId }>;

/**
 * Resuelve y valida el vínculo de contacto:
 *  - Aplica exclusión.
 *  - Normaliza y valida mínimos si es contacto nuevo.
 *  - Devuelve una unión tipada para que la capa de aplicación orqueste sin ambigüedades.
 */
export function resolveContactLink(args: {
  contact?: NewContact;
  contactId?: ContactId;
}): ContactLink {
  ensureExclusiveContactLink(args);

  if (args.contact) {
    const normalized = normalizeNewContact(args.contact);
    ensureNewContactMinimums(normalized);
    return { kind: "new", contact: normalized };
  }
  // en este punto sabemos que hay contactId
  return { kind: "existing", contactId: args.contactId as ContactId };
}
