import type { Lead, LeadId, LeadsAppContext } from "@/leads";
import { BusinessRuleError } from "@/shared";

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
