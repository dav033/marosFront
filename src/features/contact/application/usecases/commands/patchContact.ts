import type { ContactsAppContext } from "@/features/contact/application";
import type { Contact } from "@/features/contact/domain/models/Contact";
import type { ContactPatch } from "@/features/contact/domain/services/applyContactPatch";
import {
  buildUpdateContactDTO,
  type UpdateContactRequestDTO,
} from "@/features/contact/domain/services/mapContactDTO";

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
