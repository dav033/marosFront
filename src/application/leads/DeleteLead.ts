import type { LeadRepositoryPort } from "../../domain/ports/LeadRepositoryPort";

export async function deleteLead(repo: LeadRepositoryPort, id: number): Promise<void> {
  return repo.delete(id);
}