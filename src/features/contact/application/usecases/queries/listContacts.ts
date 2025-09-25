import type { Contact } from "@/features/contact/domain/models/Contact";

import type { ContactsAppContext } from "../../context";

export async function listContacts(ctx: ContactsAppContext): Promise<Contact[]> {
  return ctx.repos.contact.findAll();
}
