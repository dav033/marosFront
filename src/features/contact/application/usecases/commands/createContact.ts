
import type { ContactsAppContext } from "@/features/contact/application";
import type { Contact } from "@/features/contact/domain/models/Contact";
import type { ContactDraft } from "@/features/contact/domain/services/buildContactDraft";
import {
  mapContactDraftToCreatePayload,
  type CreateContactRequestDTO,
} from "@/features/contact/domain/services/mapContactDraftToCreatePayload";

export async function createContact(
  ctx: ContactsAppContext,
  draft: ContactDraft
): Promise<Contact> {
  const payload: CreateContactRequestDTO = mapContactDraftToCreatePayload(draft);
  return ctx.repos.contact.create(payload);
}
