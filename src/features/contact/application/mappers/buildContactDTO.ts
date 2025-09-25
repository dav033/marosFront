// src/features/contacts/application/mappers/buildContactDTO.ts

import type { ContactPatch } from "../../domain/services/applyContactPatch";
import type { ContactDraft } from "../../domain/services/buildContactDraft";

/**
 * DTO esperado por la API/infra para crear un contacto.
 * Ajuste los nombres si su capa HTTP requiere otras claves.
 */
export interface CreateContactRequestDTO {
  name: string;
  companyName?: string;
  occupation?: string;
  product?: string;
  phone?: string;
  email?: string;
  address?: string;
  lastContact?: string;
}

/**
 * DTO para actualizar un contacto (solo campos provistos).
 */
export type UpdateContactRequestDTO = Partial<CreateContactRequestDTO>;

/* ============================================================
   Tipos "loose" para poder asignar undefined temporalmente
   cuando exactOptionalPropertyTypes = true
   ============================================================ */

type LooseCreateContactRequestDTO = {
  name: string;
} & {
  [K in Exclude<keyof CreateContactRequestDTO, "name">]?: string | undefined;
};

type LooseUpdateContactRequestDTO = {
  [K in keyof UpdateContactRequestDTO]?: string | undefined;
};

/* ===================== Utils internas ===================== */

function normalizeEmptyToUndefined(v?: string | null): string | undefined {
  if (v == null) return undefined;
  const t = `${v}`.trim();
  return t === "" ? undefined : t;
}

function pickDefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

/* ===================== Builders públicos ===================== */

/**
 * Builder único para crear Contact.
 * - Normaliza strings vacíos → undefined.
 * - Exige `name` no vacío.
 * - Omite campos undefined del payload final (compatible con exactOptionalPropertyTypes).
 */
export function buildCreateContactDTO(draft: ContactDraft): CreateContactRequestDTO {
  const loose: LooseCreateContactRequestDTO = {
    name: (draft.name ?? "").trim(),
    companyName: normalizeEmptyToUndefined(draft.companyName),
    occupation: normalizeEmptyToUndefined(draft.occupation),
    product: normalizeEmptyToUndefined(draft.product),
    phone: normalizeEmptyToUndefined(draft.phone),
    email: normalizeEmptyToUndefined(draft.email),
    address: normalizeEmptyToUndefined(draft.address),
    lastContact: normalizeEmptyToUndefined(draft.lastContact),
  };

  if (!loose.name) {
    throw new Error("Contact name is required");
  }

  // Eliminamos claves con undefined y casteamos al DTO exacto
  return pickDefined(loose) as CreateContactRequestDTO;
}

/**
 * Builder único para actualizar Contact.
 * - Normaliza strings vacíos → undefined (se omiten).
 * - NO impone `name` (en update puede no venir).
 * - Omite campos undefined del payload final.
 */
export function buildUpdateContactDTO(
  patch: ContactPatch
): UpdateContactRequestDTO {
  const loose: LooseUpdateContactRequestDTO = {
    name: normalizeEmptyToUndefined(patch.name),
    companyName: normalizeEmptyToUndefined(patch.companyName),
    occupation: normalizeEmptyToUndefined(patch.occupation),
    product: normalizeEmptyToUndefined(patch.product),
    phone: normalizeEmptyToUndefined(patch.phone),
    email: normalizeEmptyToUndefined(patch.email),
    address: normalizeEmptyToUndefined(patch.address),
    lastContact: normalizeEmptyToUndefined(patch.lastContact),
  };

  return pickDefined(loose) as UpdateContactRequestDTO;
}
