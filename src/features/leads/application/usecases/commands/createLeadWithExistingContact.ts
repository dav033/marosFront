// src/features/leads/application/usecases/commands/createLeadWithExistingContact.ts
import type { LeadsAppContext } from "../../context";
import type {
  Lead,
  LeadType,
  LeadPolicies,
  ProjectTypeId,
  ContactId,
} from "@/features/leads/domain";
import { buildLeadDraftForExistingContact } from "@/features/leads/domain";
import { ensureLeadNumberAvailable } from "@/features/leads/domain/services/leadNumberPolicy";

export type CreateLeadWithExistingContactInput = Readonly<{
  leadName: string;
  leadNumber?: string | null;
  location: string;
  projectTypeId: ProjectTypeId;
  leadType: LeadType;
  contactId: ContactId;
}>;

export type CreateLeadOptions = Readonly<{
  policies?: LeadPolicies;
  checkNumberAvailability?: boolean; // default true
}>;

export async function createLeadWithExistingContact(
  ctx: LeadsAppContext,
  input: CreateLeadWithExistingContactInput,
  options: CreateLeadOptions = {}
): Promise<Lead> {
  const { policies = {}, checkNumberAvailability = true } = options;

  const draft = buildLeadDraftForExistingContact(ctx.clock, input, policies);

  if (checkNumberAvailability && draft.leadNumber) {
    await ensureLeadNumberAvailable(draft.leadNumber, async (n) => {
      const available =
        await ctx.services.leadNumberAvailability.isAvailable(n);
      return !available;
    });
  }

  return ctx.repos.lead.saveNew(draft);
}
