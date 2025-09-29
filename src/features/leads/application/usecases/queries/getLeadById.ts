import type { Lead, LeadId } from "@/features/leads/domain";

import type { LeadsAppContext } from "../../context";
import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";

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
