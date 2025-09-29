import type { LeadType } from "@/features/leads/domain";
import {
  summarizeLeadsByType as summarizeLeadsByTypeDomain, 
} from "@/features/leads/domain";
import type { LeadStatusSummary } from "@/features/leads/domain/services/leadStatusSummary";

import type { LeadsAppContext } from "../../context";

export async function summarizeLeadsByType(
  ctx: LeadsAppContext,
  type: LeadType
): Promise<LeadStatusSummary> {
  const leads = await ctx.repos.lead.findByType(type);
  return summarizeLeadsByTypeDomain(leads, type);
}
