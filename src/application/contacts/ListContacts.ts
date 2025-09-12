import type { Contact } from "../../domain/entities/Contact";
import type { ContactRepositoryPort } from "../../domain/ports/ContactRepositoryPort";

export async function listContacts(repo: ContactRepositoryPort): Promise<Contact[]> {
  return repo.list();
}