import type { ContactsAppContext } from "@/features/contact/application";
import type { Contact } from "@/features/contact/domain/models/Contact";
import type { ContactDraft } from "@/features/contact/domain/services/buildContactDraft";
import {
  buildCreateContactDTO,
  type CreateContactRequestDTO,
} from "@/features/contact/domain/services/mapContactDTO";

export async function createContact(
  ctx: ContactsAppContext,
  draft: ContactDraft
): Promise<Contact> {
  const payload: CreateContactRequestDTO = buildCreateContactDTO(draft);
  return ctx.repos.contact.create(payload);
}
