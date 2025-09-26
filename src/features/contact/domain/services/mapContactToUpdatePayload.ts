
import type { ContactPatch } from "../services/applyContactPatch";
import {
  buildUpdateContactDTO,
  type UpdateContactRequestDTO,
} from "./mapContactDTO";

export function mapContactToUpdatePayload(
  patch: ContactPatch
): UpdateContactRequestDTO {
  return buildUpdateContactDTO(patch);
}

export type { UpdateContactRequestDTO } from "./mapContactDTO";
