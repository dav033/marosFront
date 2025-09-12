import type { Lead } from "../../domain/entities/Lead";
import type { LeadRepositoryPort } from "../../domain/ports/LeadRepositoryPort";

export async function updateLead(repo: LeadRepositoryPort, id: number, patch: Partial<Lead>): Promise<Lead> {
  return repo.update(id, patch);
}