import type { Lead, LeadId, LeadStatus } from "@/features/leads/domain";
import { applyStatus, DEFAULT_TRANSITIONS } from "@/features/leads/domain";

import type { LeadsAppContext } from "../../context";
import { getLeadById } from "../queries/getLeadById";

export type ChangeLeadStatusOptions = Readonly<{
  transitions?: Readonly<Record<LeadStatus, readonly LeadStatus[]>>;
}>;

export async function changeLeadStatus(
  ctx: LeadsAppContext,
  id: LeadId,
  to: LeadStatus,
  options: ChangeLeadStatusOptions = {}
): Promise<Lead> {
  const current = await getLeadById(ctx, id);

  const transitions = options.transitions ?? DEFAULT_TRANSITIONS;
  const { lead: updated /*, events*/ } = applyStatus(
    ctx.clock,
    current,
    to,
    transitions
  );

  const saved = await ctx.repos.lead.update(id, { status: updated.status });
  return saved;
}
