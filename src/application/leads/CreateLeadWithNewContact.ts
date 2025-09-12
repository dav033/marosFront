import type { Lead } from "../../domain/entities/Lead";
import type { LeadRepositoryPort } from "../../domain/ports/LeadRepositoryPort";

type Input = Omit<Lead, "id" | "contact"> & { contact: Lead["contact"] };

export async function createLeadWithNewContact(repo: LeadRepositoryPort, input: Input): Promise<Lead> {
  return repo.createWithNewContact(input);
}