import { diffToPatch } from '@/features/leads/domain/services/diffToPatch';
import type { LeadsAppContext } from '../../context';
import { getLeadById } from '../queries/getLeadById';
import type { Lead } from '@/features/leads/domain/models/Lead';
import { applyLeadPatch } from '@/features/leads/domain/services/applyLeadPatch';
import type { LeadPatch, LeadPatchPolicies } from '@/features/leads/types';

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

  // Ejecuta el PUT; ignoramos si el servidor no envía body (204).
  await ctx.repos.lead.update(Number(id), normalizedPatch);

  // La UI se actualiza con el objeto de dominio "updated".
  return updated;
}
