import type { Lead } from "../../domain/entities/Lead";
import type { LeadRepositoryPort } from "../../domain/ports/LeadRepositoryPort";

type Input = Omit<Lead, "id" | "contact"> & { contactId: number };

export async function createLeadWithExistingContact(repo: LeadRepositoryPort, input: Input): Promise<Lead> {
  return repo.createWithExistingContact(input);
}