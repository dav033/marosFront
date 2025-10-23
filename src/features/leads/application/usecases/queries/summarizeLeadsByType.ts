import type { LeadsAppContext,LeadStatusSummary, LeadType } from "@/leads";
import { summarizeLeadsByType as summarizeLeadsByTypeDomain } from "@/leads";

export async function summarizeLeadsByTypeQuery(
  ctx: LeadsAppContext,
  type: LeadType
): Promise<LeadStatusSummary> {
  const leads = await ctx.repos.lead.findByType(type);
  return summarizeLeadsByTypeDomain(leads, type);
}
