import type { Contact } from "@/features/contact/domain/models/Contact";
import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";

import type { ContactsAppContext } from "../../context";

export async function getContactById(
  ctx: ContactsAppContext,
  id: number
): Promise<Contact> {
  const contact = await ctx.repos.contact.findById(id);
  if (!contact) {
    throw new BusinessRuleError("NOT_FOUND", "Contact not found", {
      details: { id },
    });
  }
  return contact;
}
