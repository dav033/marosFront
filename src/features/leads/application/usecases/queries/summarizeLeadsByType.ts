// src/features/leads/application/usecases/queries/summarizeLeadsByType.ts
import type { LeadType } from "@/features/leads/domain";
import {
  summarizeLeadsByType as summarizeLeadsByTypeDomain, // ← alias para evitar conflicto
} from "@/features/leads/domain";
import type { LeadStatusSummary } from "@/features/leads/domain/services/leadStatusSummary";

import type { LeadsAppContext } from "../../context";

/**
 * Use case: devuelve el resumen de estados para un tipo de lead.
 */
export async function summarizeLeadsByType(
  ctx: LeadsAppContext,
  type: LeadType
): Promise<LeadStatusSummary> {
  const leads = await ctx.repos.lead.findByType(type);
  return summarizeLeadsByTypeDomain(leads, type);
}
