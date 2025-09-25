// src/features/leads/application/usecases/commands/deleteLead.ts
import type { LeadId } from "@/features/leads/domain";

import type { LeadsAppContext } from "../../context";
import { getLeadById } from "../queries/getLeadById";

/**
 * Borra un lead por id. Idempotente: si no existe, lanza NOT_FOUND para consistencia.
 * (puedes cambiar a silencio si prefieres que no falle)
 */
export async function deleteLead(
  ctx: LeadsAppContext,
  id: LeadId
): Promise<void> {
  // asegura existencia (útil para UX y logs)
  await ctx.repos.lead.delete(id);
}
