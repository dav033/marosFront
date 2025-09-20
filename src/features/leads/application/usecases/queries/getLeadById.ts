// src/features/leads/application/usecases/queries/getLeadById.ts
import type { LeadsAppContext } from "../../context";
import type { Lead, LeadId } from "@/features/leads/domain";
import { BusinessRuleError } from "@/features/leads/domain";

export async function getLeadById(
  ctx: LeadsAppContext,
  id: LeadId
): Promise<Lead> {
  const lead = await ctx.repos.lead.findById(id);
  if (!lead) {
    throw new BusinessRuleError("NOT_FOUND", `Lead ${id} not found`, {
      details: { id },
    });
  }
  return lead;
}
