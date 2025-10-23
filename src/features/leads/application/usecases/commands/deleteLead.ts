import type { LeadId, LeadsAppContext } from "@/leads";

export async function deleteLead(
  ctx: LeadsAppContext,
  id: LeadId
): Promise<void> {
  await ctx.repos.lead.delete(id);
}
