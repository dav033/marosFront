// src/features/leads/application/usecases/commands/patchLead.ts
import type { LeadsAppContext } from "../../context";
import type {
  Lead,
  LeadId,
  LeadPatch,
  ISODate,
} from "@/features/leads/domain";
import { applyLeadPatch } from "@/features/leads/domain";
import { getLeadById } from "../queries/getLeadById";
import type { LeadPatchPolicies } from "@/features/leads/types";

/** Construye un LeadPatch SOLO con los cambios (sin mutar, para respetar readonly). */
function diffToPatch(current: Lead, updated: Lead): LeadPatch {
  return {
    ...(updated.name !== current.name ? { name: updated.name } : {}),
    ...((updated.location ?? "") !== (current.location ?? "")
      ? { location: updated.location ?? "" }
      : {}),
    ...(updated.status !== current.status ? { status: updated.status } : {}),
    ...(updated.startDate !== current.startDate
      ? { startDate: updated.startDate as ISODate }
      : {}),
    ...(updated.projectType.id !== current.projectType.id
      ? { projectTypeId: updated.projectType.id }
      : {}),
    ...(updated.contact.id !== current.contact.id
      ? { contactId: updated.contact.id }
      : {}),
    ...((updated.leadNumber ?? "") !== (current.leadNumber ?? "")
      ? { leadNumber: updated.leadNumber ?? "" }
      : {}),
  };
}

/**
 * Aplica un patch de dominio (normalización + validación + transición) y persiste.
 * Retorna el Lead actualizado desde el repositorio.
 */
export async function patchLead(
  ctx: LeadsAppContext,
  id: LeadId,
  patch: LeadPatch,
  policies: LeadPatchPolicies = {}
): Promise<Lead> {
  const current = await getLeadById(ctx, id);

  // Normaliza/valida en dominio
  const { lead: updated /*, events*/ } = applyLeadPatch(
    ctx.clock,
    current,
    patch,
    policies
  );

  // Genera un patch “limpio” con los cambios efectivos
  const normalizedPatch = diffToPatch(current, updated);

  // Persistencia vía repo (el adapter mapeará a DTO de API)
  const saved = await ctx.repos.lead.update(id, normalizedPatch);

  return saved;
}
