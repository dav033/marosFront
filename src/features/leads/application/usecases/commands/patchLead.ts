import type { Lead, LeadPatch, LeadPatchPolicies, LeadsAppContext } from "@/leads";
import { applyLeadPatch, diffToPatch, getLeadById } from "@/leads";

/**
 * Aplica el patch en dominio y persiste.
 * Si el PUT devuelve 204/empty, NO se recarga el recurso; devolvemos el "updated".
 */
export async function patchLead(
  ctx: LeadsAppContext,
  id: number,
  patch: LeadPatch,
  policies: LeadPatchPolicies = {},
): Promise<Lead> {
  const current = await getLeadById(ctx, Number(id));

  const { lead: updated /*, events*/ } = applyLeadPatch(
    ctx.clock,
    current,
    patch,
    policies,
  );

  const normalizedPatch = diffToPatch(current, updated);

    await ctx.repos.lead.update(Number(id), normalizedPatch);

    return updated;
}
