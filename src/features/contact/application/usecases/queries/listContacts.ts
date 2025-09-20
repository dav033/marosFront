import type { ContactsAppContext } from "../../context";
import type { Contacts } from "@/features/contact/domain/models/Contact";

export async function listContacts(ctx: ContactsAppContext): Promise<Contacts[]> {
  return ctx.repos.contact.getAll();
}
