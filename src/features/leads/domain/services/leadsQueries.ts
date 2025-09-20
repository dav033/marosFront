// src/features/leads/domain/services/leadsQueries.ts

import type { Lead } from "../models/Lead";
import { LeadStatus, LeadType } from "../../enums";

/** Mapea null/undefined a UNDETERMINED (defensivo). */
function effectiveStatus(s: LeadStatus | null | undefined): LeadStatus {
  return s ?? LeadStatus.UNDETERMINED;
}

/** Orden por defecto de estados (útil para tabs/badges). */
export const DEFAULT_STATUS_ORDER: readonly LeadStatus[] = [
  LeadStatus.NEW,
  LeadStatus.UNDETERMINED,
  LeadStatus.TO_DO,
  LeadStatus.IN_PROGRESS,
  LeadStatus.DONE,
  LeadStatus.LOST,
  LeadStatus.NOT_EXECUTED,
] as const;

/** Filtra por tipo. */
export function filterByType(leads: readonly Lead[], type: LeadType): Lead[] {
  return (leads ?? []).filter((l) => l.leadType === type);
}

/** Filtra por estado (null/undefined ⇒ UNDETERMINED). */
export function filterByStatus(
  leads: readonly Lead[],
  status: LeadStatus
): Lead[] {
  return (leads ?? []).filter((l) => effectiveStatus(l.status) === status);
}

/** Particiona por estado, devolviendo buckets con todos los estados presentes. */
export function partitionByStatus(
  leads: readonly Lead[]
): Record<LeadStatus, Lead[]> {
  const buckets: Record<LeadStatus, Lead[]> = {
    [LeadStatus.NEW]: [],
    [LeadStatus.UNDETERMINED]: [],
    [LeadStatus.TO_DO]: [],
    [LeadStatus.IN_PROGRESS]: [],
    [LeadStatus.DONE]: [],
    [LeadStatus.LOST]: [],
    [LeadStatus.NOT_EXECUTED]: [],
  };
  for (const l of leads ?? []) {
    buckets[effectiveStatus(l.status)].push(l);
  }
  return buckets;
}

/**
 * Ordena por startDate (YYYY-MM-DD) descendente.
 * NOTA: al ser formato ISO local, el orden lexicográfico funciona.
 */
export function sortByStartDateDesc(leads: readonly Lead[]): Lead[] {
  return [...(leads ?? [])].sort((a, b) =>
    a.startDate > b.startDate ? -1 : a.startDate < b.startDate ? 1 : 0
  );
}
