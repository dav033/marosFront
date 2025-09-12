import type { Lead } from "../../domain/entities/Lead";
import type { LeadType } from "../../domain/enums/LeadType";
import type { LeadRepositoryPort } from "../../domain/ports/LeadRepositoryPort";

export async function listLeads(repo: LeadRepositoryPort, type?: LeadType): Promise<Lead[]> {
  return repo.list(type);
}