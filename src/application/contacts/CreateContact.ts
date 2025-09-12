import type { Contact } from "../../domain/entities/Contact";
import type { ContactRepositoryPort } from "../../domain/ports/ContactRepositoryPort";

export async function createContact(repo: ContactRepositoryPort, input: Contact): Promise<Contact> {
  return repo.create(input);
}