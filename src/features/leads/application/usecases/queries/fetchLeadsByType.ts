// Capa: Application — Caso de uso único y estable para la UI
import type { Lead } from "@/features/leads/domain/models/Lead";
import type { LeadType } from "@/features/leads/enums";

// El contexto propio de su app (ya existente en su proyecto)
export type LeadsAppContext = {
  repos: {
    lead: any; // Debe implementar al menos uno de: listByType | fetchByType | getByType | findByType
  };
};

/**
 * Resolver defensivo: acepta distintas firmas del repositorio.
 * Mantiene compatibilidad sin filtrar detalles de Infra a la UI.
 */
function resolveFetchByType(reposLead: any): ((t: LeadType) => Promise<unknown>) {
  if (!reposLead) throw new Error("Lead repository not found in ctx.repos.lead");

  const candidate =
    reposLead.listByType ??
    reposLead.fetchByType ??
    reposLead.getByType ??
    reposLead.findByType ??
    (async (lt: LeadType) => {
      if (typeof reposLead.list === "function") return reposLead.list({ type: lt });
      if (typeof reposLead.search === "function") return reposLead.search({ type: lt });
      return [];
    });

  const needsBind = typeof candidate?.bind === "function";
  return (lt: LeadType) => (needsBind ? candidate.call(reposLead, lt) : candidate(lt));
}

/**
 * Use case: trae leads por tipo en forma de arreglo de dominio.
 * No conoce HTTP ni mapeos; delega en el repositorio (Infra).
 */
export async function fetchLeadsByType(
  ctx: LeadsAppContext,
  leadType: LeadType
): Promise<Lead[]> {
  const fetch = resolveFetchByType(ctx?.repos?.lead);
  const res = await fetch(leadType);
  // Normaliza sólo la forma de contenedor (array o {items})
  const items = Array.isArray(res) ? (res as any[]) : ((res as any)?.items ?? []);
  return items as Lead[];
}
