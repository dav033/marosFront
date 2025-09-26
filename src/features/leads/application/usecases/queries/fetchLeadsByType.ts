import type { Lead } from "@/features/leads/domain/models/Lead";
import type { LeadType } from "@/features/leads/enums";

type LeadRepoLike = Partial<{
  listByType: (t: LeadType) => Promise<unknown>;
  fetchByType: (t: LeadType) => Promise<unknown>;
  getByType: (t: LeadType) => Promise<unknown>;
  findByType: (t: LeadType) => Promise<unknown>;
  list: (opts?: Record<string, unknown>) => Promise<unknown>;
  search: (opts?: Record<string, unknown>) => Promise<unknown>;
}>;
export type LeadsAppContext = {
  repos: {
    lead?: LeadRepoLike;
  };
};

function resolveFetchByType(reposLead?: LeadRepoLike): ((t: LeadType) => Promise<unknown>) {
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

  const candidateFn = candidate as unknown as Function;
  const needsBind = typeof candidateFn?.bind === "function";
  return (lt: LeadType) => (needsBind ? candidateFn.call(reposLead, lt) : candidate(lt));
}

export async function fetchLeadsByType(
  ctx: LeadsAppContext,
  leadType: LeadType
): Promise<Lead[]> {
  const fetch = resolveFetchByType(ctx?.repos?.lead);
  const res = await fetch(leadType);
  const items = Array.isArray(res)
    ? (res as unknown[])
  : ((res as Record<string, unknown> | null)?.["items"] ?? []);
  return (items as unknown[]) as Lead[];
}
