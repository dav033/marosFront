import type { Lead } from "@/features/leads/domain/models/Lead";
import type { LeadType } from "@/features/leads/enums";
import type { LeadsAppContext } from "../../context";

/**
 * Versión simplificada: refuerza el contrato del Port y llama exclusivamente a `findByType`.
 * Evita reflexión/adaptadores dinámicos.
 */
export async function fetchLeadsByType(
  ctx: LeadsAppContext,
  type: LeadType
): Promise<Lead[]> {
  return ctx.repos.lead.findByType(type);
}
