import type { Lead } from "../../domain/entities/Lead";
import type { LeadRepositoryPort } from "../../domain/ports/LeadRepositoryPort";

export async function getLeadById(repo: LeadRepositoryPort, id: number): Promise<Lead> {
  return repo.getById(id);
}