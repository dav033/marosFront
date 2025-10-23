import type { LeadType } from "@/leads";
import type { Lead } from "@/leads";

// eslint-disable-next-line no-restricted-imports
import { LeadStatus } from "../../enums";

function effectiveStatus(s: LeadStatus | null | undefined): LeadStatus {
  return s ?? LeadStatus.UNDETERMINED;
}

export const DEFAULT_STATUS_ORDER: readonly LeadStatus[] = [
  LeadStatus.NEW,
  LeadStatus.UNDETERMINED,
  LeadStatus.TO_DO,
  LeadStatus.IN_PROGRESS,
  LeadStatus.DONE,
  LeadStatus.LOST,
  LeadStatus.NOT_EXECUTED,
] as const;

export function filterByType(leads: readonly Lead[], type: LeadType): Lead[] {
  return (leads ?? []).filter((l) => l.leadType === type);
}

export function filterByStatus(
  leads: readonly Lead[],
  status: LeadStatus
): Lead[] {
  return (leads ?? []).filter((l) => effectiveStatus(l.status) === status);
}

export function partitionByStatus(
  leads: readonly Lead[]
): Partial<Record<LeadStatus, Lead[]>> {
  const buckets: Partial<Record<LeadStatus, Lead[]>> = {
    [LeadStatus.NEW]: [],
    [LeadStatus.UNDETERMINED]: [],
    [LeadStatus.TO_DO]: [],
    [LeadStatus.IN_PROGRESS]: [],
    [LeadStatus.DONE]: [],
    [LeadStatus.LOST]: [],
    [LeadStatus.NOT_EXECUTED]: [],
  };
  for (const l of leads ?? []) {
    const key = effectiveStatus(l.status);
    (buckets[key] ||= []).push(l);
  }
  return buckets;
}

export function sortByStartDateDesc(leads: readonly Lead[]): Lead[] {
  return [...(leads ?? [])].sort((a, b) =>
    a.startDate > b.startDate ? -1 : a.startDate < b.startDate ? 1 : 0
  );
}
