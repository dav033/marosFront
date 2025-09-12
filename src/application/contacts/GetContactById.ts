import type { Contact } from "../../domain/entities/Contact";
import type { ContactRepositoryPort } from "../../domain/ports/ContactRepositoryPort";

export async function getContactById(repo: ContactRepositoryPort, id: number): Promise<Contact> {
  return repo.getById(id);
}