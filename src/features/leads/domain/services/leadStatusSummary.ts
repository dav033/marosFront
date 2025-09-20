// maros-app/src/features/leads/domain/services/leadStatusSummary.ts

import type { Lead } from "../models/Lead";
import { LeadStatus, LeadType } from "../../enums";

/** Estado efectivo: mapea null/undefined a UNDETERMINED (defensivo). */
function toEffectiveStatus(s: LeadStatus | null | undefined): LeadStatus {
  return s ?? LeadStatus.UNDETERMINED;
}

/** Contadores por estado (interfaz pública readonly). */
export type StatusCounts = Readonly<Record<LeadStatus, number>>;
/** Versión interna mutable para el cómputo. */
type MutableStatusCounts = Record<LeadStatus, number>;

/** Resumen general con métricas derivadas. */
export type LeadStatusSummary = Readonly<{
  total: number;
  counts: StatusCounts;
  /** Leads “activos” (no DONE/NOT_EXECUTED/LOST). Ajuste a su negocio si cambia. */
  active: number;
  /** Tasa de completados sobre total (0..1). */
  completionRate: number;
}>;

/** Inicializa contadores en 0 (mutable). */
function zeroCounts(): MutableStatusCounts {
  return {
    [LeadStatus.NEW]: 0,
    [LeadStatus.UNDETERMINED]: 0,
    [LeadStatus.TO_DO]: 0,
    [LeadStatus.IN_PROGRESS]: 0,
    [LeadStatus.DONE]: 0,
    [LeadStatus.LOST]: 0,
    [LeadStatus.NOT_EXECUTED]: 0,
  };
}

/** Regla de “activo”: pendientes/en progreso/por hacer/indeterminados/nuevos. */
function isActive(status: LeadStatus): boolean {
  switch (status) {
    case LeadStatus.DONE:
    case LeadStatus.LOST:
    case LeadStatus.NOT_EXECUTED:
      return false;
    default:
      return true;
  }
}

/**
 * Calcula contadores por estado y métricas básicas.
 * Puro; NO muta el arreglo recibido.
 */
export function summarizeLeads(leads: readonly Lead[]): LeadStatusSummary {
  const counts = zeroCounts(); // <- mutable durante el cómputo
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

  const completionRate = total > 0 ? counts[LeadStatus.DONE] / total : 0;

  // Exponer como readonly
  return { total, counts: counts as StatusCounts, active, completionRate };
}

/** Variante que filtra por tipo de lead antes de resumir. */
export function summarizeLeadsByType(
  leads: readonly Lead[],
  type: LeadType
): LeadStatusSummary {
  const filtered = (leads ?? []).filter((l) => l.leadType === type);
  return summarizeLeads(filtered);
}

/** Devuelve pares {key, count} en un orden dado (ideal para badges/leyendas). */
export function countsInOrder(
  counts: StatusCounts,
  order: readonly LeadStatus[]
): ReadonlyArray<{ key: LeadStatus; count: number }> {
  return order.map((k) => ({ key: k, count: counts[k] ?? 0 }));
}
