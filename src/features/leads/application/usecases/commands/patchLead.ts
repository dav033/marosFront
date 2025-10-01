
import type { Lead, LeadId, LeadPatch } from "@/features/leads/domain";
import { applyLeadPatch } from "@/features/leads/domain";
import type { LeadPatchPolicies } from "@/features/leads/types";
import { getLeadById } from "../queries/getLeadById";
import { diffToPatch } from "@/features/leads/domain/services/diffToPatch";
import type { LeadsAppContext } from "../../context";

/**
 * Aplica patch de dominio (con validaciones/eventos),
 * normaliza a un patch mínimo (diff) y persiste usando el repo.
 */
export async function patchLead(
  ctx: LeadsAppContext,
  id: LeadId,
  patch: LeadPatch,
  policies: LeadPatchPolicies = {}
): Promise<Lead> {
  const current = await getLeadById(ctx, id);

  const { lead: updated /*, events*/ } = applyLeadPatch(
    ctx.clock,
    current,
    patch,
    policies
  );

  const normalizedPatch = diffToPatch(current, updated);
  const saved = await ctx.repos.lead.update(id, normalizedPatch);

  return saved;
}
