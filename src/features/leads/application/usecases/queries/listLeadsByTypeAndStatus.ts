// src/features/leads/application/usecases/queries/listLeadsByTypeAndStatus.ts
import type { Lead, LeadStatus,LeadType } from "@/features/leads/domain";
import { filterByStatus, sortByStartDateDesc } from "@/features/leads/domain";

import type { LeadsAppContext } from "../../context";

export type ListLeadsByTypeAndStatusOptions = Readonly<{
  sort?: "startDateDesc" | "none";
}>;

export async function listLeadsByTypeAndStatus(
  ctx: LeadsAppContext,
  type: LeadType,
  status: LeadStatus,
  options: ListLeadsByTypeAndStatusOptions = { sort: "startDateDesc" }
): Promise<Lead[]> {
  const all = await ctx.repos.lead.findByType(type);
  const filtered = filterByStatus(all, status);

  const sort = options?.sort ?? "startDateDesc";
  if (sort === "startDateDesc") return sortByStartDateDesc(filtered);
  return filtered;
}
