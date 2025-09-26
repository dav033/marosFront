import type {
  ISODate,
  Lead,
  LeadId,
  LeadPatch,
} from "@/features/leads/domain";
import { applyLeadPatch } from "@/features/leads/domain";
import type { LeadPatchPolicies } from "@/features/leads/types";

import type { LeadsAppContext } from "../../context";
import { getLeadById } from "../queries/getLeadById";

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

export async function patchLead(
  ctx: LeadsAppContext,
  id: LeadId,
  patch: LeadPatch,
  policies: LeadPatchPolicies = {}
): Promise<Lead> {
  const current = await getLeadById(ctx, id);
  const { lead: updated /*, events*/ } = applyLeadPatch(
    ctx.clock,
    current,
    patch,
    policies
  );
  const normalizedPatch = diffToPatch(current, updated);
  const saved = await ctx.repos.lead.update(id, normalizedPatch);

  return saved;
}
