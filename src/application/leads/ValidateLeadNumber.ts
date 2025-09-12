import type { LeadRepositoryPort, LeadNumberValidation } from "../../domain/ports/LeadRepositoryPort";

export async function validateLeadNumber(repo: LeadRepositoryPort, leadNumber: string): Promise<LeadNumberValidation> {
  return repo.validateLeadNumber(leadNumber);
}