import type { ContactsAppContext } from "@/contact";
import type { Contact, ContactDraft } from "@/contact";
import { buildCreateContactDTO, type CreateContactRequestDTO } from "@/contact";

export async function createContact(
  ctx: ContactsAppContext,
  draft: ContactDraft
): Promise<Contact> {
  const payload: CreateContactRequestDTO = buildCreateContactDTO(draft);
  return ctx.repos.contact.create(payload);
}
