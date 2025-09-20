// src/features/leads/application/usecases/commands/createLeadWithNewContact.ts
import type { LeadsAppContext } from "../../context";
import type {
  Lead,
  LeadType,
  LeadPolicies,
  ProjectTypeId,
} from "@/features/leads/domain";
import { buildLeadDraftForNewContact } from "@/features/leads/domain";
import { ensureLeadNumberAvailable } from "@/features/leads/domain/services/leadNumberPolicy";
import type { NewContact } from "@/features/leads/types";

export type CreateLeadWithNewContactInput = Readonly<{
  leadName: string;
  leadNumber?: string | null;
  location: string;
  projectTypeId: ProjectTypeId;
  leadType: LeadType;
  contact: NewContact;
}>;

export type CreateLeadOptions = Readonly<{
  policies?: LeadPolicies;
  checkNumberAvailability?: boolean; // default true
}>;

export async function createLeadWithNewContact(
  ctx: LeadsAppContext,
  input: CreateLeadWithNewContactInput,
  options: CreateLeadOptions = {}
): Promise<Lead> {
  const { policies = {}, checkNumberAvailability = true } = options;

  const draft = buildLeadDraftForNewContact(ctx.clock, input, policies);

  // unicidad del número si corresponde
  if (checkNumberAvailability && draft.leadNumber) {
    await ensureLeadNumberAvailable(draft.leadNumber, async (n) => {
      const available =
        await ctx.services.leadNumberAvailability.isAvailable(n);
      return !available; // exists?
    });
  }

  return ctx.repos.lead.saveNew(draft);
}
