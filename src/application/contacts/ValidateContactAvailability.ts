import type { ContactRepositoryPort, ContactValidation } from "../../domain/ports/ContactRepositoryPort";

type Params = { name?: string; email?: string; phone?: string; excludeId?: number };

export async function validateContactAvailability(repo: ContactRepositoryPort, params: Params): Promise<ContactValidation> {
  return repo.validateAvailability(params);
}