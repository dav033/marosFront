// src/features/contact/domain/services/mapContactDraftToCreatePayload.ts

import type { ContactDraft } from "./buildContactDraft";

/**
 * DTO esperado por la API para crear un contacto.
 * Manténgalo alineado con el contrato del backend.
 */
export type CreateContactRequestDTO = Readonly<{
  companyName: string;
  name: string;
  occupation?: string;
  product?: string;
  phone?: string;
  email?: string;
  address?: string;
  /** ISO 8601 opcional si el backend lo admite */
  lastContact?: string;
}>;

/**
 * Mapea un ContactDraft (ya normalizado/validado en dominio)
 * al payload de creación de la API.
 * - No re-normaliza: asume que `buildContactDraft` y `ensureContactDraftIntegrity`
 *   ya fueron ejecutados.
 * - Omite campos undefined para no enviar ruido al backend.
 */
export function mapContactDraftToCreatePayload(
  draft: ContactDraft
): CreateContactRequestDTO {
  const dto: CreateContactRequestDTO = {
    companyName: draft.companyName,
    name: draft.name,
    ...(draft.occupation ? { occupation: draft.occupation } : {}),
    ...(draft.product ? { product: draft.product } : {}),
    ...(draft.phone ? { phone: draft.phone } : {}),
    ...(draft.email ? { email: draft.email } : {}),
    ...(draft.address ? { address: draft.address } : {}),
    ...(draft.lastContact ? { lastContact: draft.lastContact } : {}),
  };

  return dto;
}
