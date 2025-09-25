// src/features/contact/domain/services/mapContactToUpdatePayload.ts

import type { ContactPatch } from "../services/applyContactPatch";
import {
  buildUpdateContactDTO,
  type UpdateContactRequestDTO,
} from "./mapContactDTO";

/**
 * Wrapper de compatibilidad: conserva el nombre anterior
 * y delega en el builder unificado.
 */
export function mapContactToUpdatePayload(
  patch: ContactPatch
): UpdateContactRequestDTO {
  return buildUpdateContactDTO(patch);
}

export type { UpdateContactRequestDTO } from "./mapContactDTO";
