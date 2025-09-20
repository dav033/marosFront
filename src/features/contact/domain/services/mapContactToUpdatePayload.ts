// src/features/contact/domain/services/mapContactToUpdatePayload.ts

import type { ContactPatch } from "./applyContactPatch";
import type { CreateContactRequestDTO } from "./mapContactDraftToCreatePayload";

/**
 * DTO de actualización esperado por la API.
 * Es un subconjunto parcial del DTO de creación.
 */
export type UpdateContactRequestDTO = Readonly<
  Partial<CreateContactRequestDTO>
>;

/**
 * Mapea un ContactPatch (ya normalizado por dominio) al payload de actualización.
 * - Solo incluye las propiedades presentes en el patch.
 * - No re-normaliza: asume que applyContactPatch ya lo hizo.
 * - Usa spreads condicionales para evitar escribir sobre objetos readonly.
 */
export function mapContactPatchToUpdatePayload(
  patch: ContactPatch
): UpdateContactRequestDTO {
  const dto: UpdateContactRequestDTO = {
    ...(patch.companyName !== undefined
      ? { companyName: patch.companyName }
      : {}),
    ...(patch.name !== undefined ? { name: patch.name } : {}),
    ...(patch.occupation !== undefined
      ? { occupation: patch.occupation || undefined }
      : {}),
    ...(patch.product !== undefined
      ? { product: patch.product || undefined }
      : {}),
    ...(patch.phone !== undefined ? { phone: patch.phone || undefined } : {}),
    ...(patch.email !== undefined ? { email: patch.email || undefined } : {}),
    ...(patch.address !== undefined
      ? { address: patch.address || undefined }
      : {}),
    ...(patch.lastContact !== undefined
      ? { lastContact: patch.lastContact || undefined }
      : {}),
  };

  return dto;
}
