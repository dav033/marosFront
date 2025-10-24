import type { Lead, LeadStatus,LeadType } from "@/leads";

export type StatusCounts = Readonly<Record<LeadStatus, number>>;
type MutableStatusCounts = Record<LeadStatus, number>;

export type LeadStatusSummary = Readonly<{
  total: number;
  counts: StatusCounts;
  active: number;
  completionRate: number;
}>;

function toEffectiveStatus(s: LeadStatus | null | undefined): LeadStatus {
  return (s ?? "UNDETERMINED") as LeadStatus;
}

function zeroCounts(): MutableStatusCounts {
  return {
    NEW: 0,
    UNDETERMINED: 0,
    TO_DO: 0,
    IN_PROGRESS: 0,
    DONE: 0,
    LOST: 0,
    NOT_EXECUTED: 0,
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
    counts.NEW +
    counts.UNDETERMINED +
    counts.TO_DO +
    counts.IN_PROGRESS +
    counts.DONE +
    counts.LOST +
    counts.NOT_EXECUTED;

  const active = (['NEW','UNDETERMINED','TO_DO','IN_PROGRESS'] as const)
    .reduce((acc, k) => acc + counts[k], 0);

  const completionRate = total > 0 ? (counts.DONE ?? 0) / total : 0;
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
