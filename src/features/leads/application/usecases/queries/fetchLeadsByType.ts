import type { Lead, LeadsAppContext,LeadType } from "@/leads";

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
