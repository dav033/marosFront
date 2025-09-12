import type { ContactRepositoryPort } from "../../domain/ports/ContactRepositoryPort";

export async function deleteContact(repo: ContactRepositoryPort, id: number): Promise<void> {
  return repo.delete(id);
}