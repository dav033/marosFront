
import type { ContactDraft } from "../services/buildContactDraft";
import {
  buildCreateContactDTO,
  type CreateContactRequestDTO,
} from "./mapContactDTO";

export function mapContactDraftToCreatePayload(
  draft: ContactDraft
): CreateContactRequestDTO {
  return buildCreateContactDTO(draft);
}

export type { CreateContactRequestDTO } from "./mapContactDTO";
