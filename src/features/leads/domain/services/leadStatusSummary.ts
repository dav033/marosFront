import type { Lead, LeadType } from "@/leads";
import { LeadStatus } from "../../enums";

export type StatusCounts = Readonly<Record<LeadStatus, number>>;
type MutableStatusCounts = Record<LeadStatus, number>;

export type LeadStatusSummary = Readonly<{
  total: number;
  counts: StatusCounts;
  active: number;
  completionRate: number;
}>;

function toEffectiveStatus(s: LeadStatus | null | undefined): LeadStatus {
  return s ?? LeadStatus.UNDETERMINED;
}

function zeroCounts(): MutableStatusCounts {
  return {
    [LeadStatus.NEW]: 0,
    [LeadStatus.UNDETERMINED]: 0,
    [LeadStatus.TO_DO]: 0,
    [LeadStatus.IN_PROGRESS]: 0,
    [LeadStatus.DONE]: 0,
    [LeadStatus.LOST]: 0,
    [LeadStatus.NOT_EXECUTED]: 0,
  } as MutableStatusCounts;
}

export function summarizeLeads(leads: readonly Lead[]): LeadStatusSummary {
  const counts = zeroCounts();
  const src = Array.isArray(leads) ? leads : [];

  for (const lead of src) {
    const s = toEffectiveStatus(lead.status);
    counts[s] = (counts[s] ?? 0) + 1;
  }

  const total =
    counts[LeadStatus.NEW] +
    counts[LeadStatus.UNDETERMINED] +
    counts[LeadStatus.TO_DO] +
    counts[LeadStatus.IN_PROGRESS] +
    counts[LeadStatus.DONE] +
    counts[LeadStatus.LOST] +
    counts[LeadStatus.NOT_EXECUTED];

  const active = (
    [
      LeadStatus.NEW,
      LeadStatus.UNDETERMINED,
      LeadStatus.TO_DO,
      LeadStatus.IN_PROGRESS,
    ] as const
  ).reduce((acc, k) => acc + counts[k], 0);

  const completionRate = total > 0 ? (counts[LeadStatus.DONE] ?? 0) / total : 0;
  return { total, counts: counts as StatusCounts, active, completionRate };
}

export function summarizeLeadsByType(
  leads: readonly Lead[],
  type: LeadType
): LeadStatusSummary {
  const filtered = (leads ?? []).filter((l) => l.leadType === type);
  return summarizeLeads(filtered);
}

export function countsInOrder(
  counts: StatusCounts,
  order: readonly LeadStatus[]
): ReadonlyArray<{ key: LeadStatus; count: number }> {
  return order.map((k) => ({ key: k, count: counts[k] ?? 0 }));
}
