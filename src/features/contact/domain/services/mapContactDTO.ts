// src/features/contact/domain/services/mapContactDTO.ts

import type { ContactPatch } from "../services/applyContactPatch";
import type { ContactDraft } from "../services/buildContactDraft";

/**
 * DTO esperado por la API/infra para crear un contacto.
 * (Opcionales: si la clave existe, debe ser string; con EOPT=true no puede ser undefined.)
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

/** DTO para actualizar un contacto (solo campos provistos). */
export type UpdateContactRequestDTO = Partial<CreateContactRequestDTO>;

/* Tipos “loose” para construir y luego filtrar (EOPT=true compatible) */
type LooseCreateContactRequestDTO = {
  name: string;
} & {
  [K in Exclude<keyof CreateContactRequestDTO, "name">]?: string | undefined;
};

type LooseUpdateContactRequestDTO = {
  [K in keyof UpdateContactRequestDTO]?: string | undefined;
};

/* Utils */
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

/* Builder unificado */
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

  return pickDefined(loose) as CreateContactRequestDTO;
}

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
