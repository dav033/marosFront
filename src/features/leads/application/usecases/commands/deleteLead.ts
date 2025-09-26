import type { LeadId } from "@/features/leads/domain";

import type { LeadsAppContext } from "../../context";
import { getLeadById } from "../queries/getLeadById";

export async function deleteLead(
  ctx: LeadsAppContext,
  id: LeadId
): Promise<void> {
  await ctx.repos.lead.delete(id);
}
