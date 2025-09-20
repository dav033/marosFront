import type { ContactsAppContext } from "../../context";
import type { Contacts } from "@/features/contact/domain/models/Contact";
import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";

export async function getContactById(
  ctx: ContactsAppContext,
  id: number
): Promise<Contacts> {
  const contact = await ctx.repos.contact.getById(id);
  if (!contact) {
    throw new BusinessRuleError("NOT_FOUND", "Contact not found", {
      details: { id },
    });
  }
  return contact;
}
