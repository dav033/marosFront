import type { ContactsAppContext } from "@/contact";
import type { Contact, ContactPatch } from "@/contact";
import { buildUpdateContactDTO, type UpdateContactRequestDTO } from "@/contact";

export async function patchContact(
  ctx: ContactsAppContext,
  contactId: number,
  patch: ContactPatch
): Promise<Contact> {
  const payload: UpdateContactRequestDTO = buildUpdateContactDTO(patch);

  if (Object.keys(payload).length === 0) {
    const current = await ctx.repos.contact.findById(contactId);
    if (!current) {
      throw new Error(`Contact ${contactId} not found`);
    }
    return current;
  }

  return ctx.repos.contact.update(contactId, payload);
}
