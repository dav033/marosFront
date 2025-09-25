// src/features/leads/application/usecases/queries/listLeadsByType.ts
import type { Lead, LeadType } from "@/features/leads/domain";
import { sortByStartDateDesc } from "@/features/leads/domain";

import type { LeadsAppContext } from "../../context";

export type ListLeadsByTypeOptions = Readonly<{
  /** default: "startDateDesc" */
  sort?: "startDateDesc" | "none";
}>;

/**
 * Lista leads por tipo desde el repositorio y (opcionalmente) los ordena
 * usando la utilidad pura de dominio.
 */
export async function listLeadsByType(
  ctx: LeadsAppContext,
  type: LeadType,
  options: ListLeadsByTypeOptions = { sort: "startDateDesc" }
): Promise<Lead[]> {
  const leads = await ctx.repos.lead.findByType(type);

  const sort = options?.sort ?? "startDateDesc";
  if (sort === "startDateDesc") {
    return sortByStartDateDesc(leads);
  }
  return Array.isArray(leads) ? [...leads] : [];
}
