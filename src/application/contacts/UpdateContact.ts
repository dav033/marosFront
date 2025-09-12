import type { Contact } from "../../domain/entities/Contact";
import type { ContactRepositoryPort } from "../../domain/ports/ContactRepositoryPort";

export async function updateContact(repo: ContactRepositoryPort, id: number, patch: Partial<Contact>): Promise<Contact> {
  return repo.update(id, patch);
}