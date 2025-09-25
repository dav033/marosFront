// src/features/contact/domain/services/mapContactDraftToCreatePayload.ts

import type { ContactDraft } from "../services/buildContactDraft";
import {
  buildCreateContactDTO,
  type CreateContactRequestDTO,
} from "./mapContactDTO";

/**
 * Wrapper de compatibilidad: conserva el nombre anterior
 * y delega en el builder unificado.
 */
export function mapContactDraftToCreatePayload(
  draft: ContactDraft
): CreateContactRequestDTO {
  return buildCreateContactDTO(draft);
}

export type { CreateContactRequestDTO } from "./mapContactDTO";
