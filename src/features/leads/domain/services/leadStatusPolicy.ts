// maros-app/src/features/leads/domain/services/leadStatusPolicy.ts

import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";
import { LeadStatus } from "../../enums";
import type { Lead } from "../models/Lead";
import type { Clock, DomainEvent } from "../../types";

/**
 * Matriz de transiciones por defecto.
 * Ajuste según sus reglas reales de negocio.
 */
export const DEFAULT_TRANSITIONS: Readonly<
  Record<LeadStatus, readonly LeadStatus[]>
> = {
  [LeadStatus.NEW]:           [LeadStatus.TO_DO, LeadStatus.IN_PROGRESS, LeadStatus.LOST, LeadStatus.UNDETERMINED],
  [LeadStatus.UNDETERMINED]:  [LeadStatus.NEW, LeadStatus.TO_DO, LeadStatus.IN_PROGRESS, LeadStatus.LOST],
  [LeadStatus.TO_DO]:         [LeadStatus.IN_PROGRESS, LeadStatus.DONE, LeadStatus.LOST, LeadStatus.NOT_EXECUTED],
  [LeadStatus.IN_PROGRESS]:   [LeadStatus.DONE, LeadStatus.LOST, LeadStatus.NOT_EXECUTED],
  [LeadStatus.DONE]:          [LeadStatus.IN_PROGRESS],                 // reabrir trabajo si aplica
  [LeadStatus.LOST]:          [LeadStatus.TO_DO, LeadStatus.IN_PROGRESS], // reactivar oportunidad
  [LeadStatus.NOT_EXECUTED]:  [LeadStatus.TO_DO],                       // reprogramado/retomado
};

/** Verifica si la transición es válida según la matriz proporcionada (o la por defecto). */
export function canTransition(
  from: LeadStatus,
  to: LeadStatus,
  transitions: Readonly<Record<LeadStatus, readonly LeadStatus[]>> = DEFAULT_TRANSITIONS
): boolean {
  return from === to || (transitions[from] ?? []).includes(to);
}

/** Lanza BusinessRuleError si la transición no está permitida. */
export function ensureTransition(
  from: LeadStatus,
  to: LeadStatus,
  transitions: Readonly<Record<LeadStatus, readonly LeadStatus[]>> = DEFAULT_TRANSITIONS
): void {
  if (!canTransition(from, to, transitions)) {
    throw new BusinessRuleError(
      "INVALID_TRANSITION",
      `Cannot transition from ${String(from)} to ${String(to)}`,
      { details: { from, to } }
    );
  }
}

/**
 * Aplica el cambio de estado sobre el Lead de forma PURA y emite evento si procede.
 * No persiste ni llama red; solo actualiza el agregado y devuelve el/los eventos.
 */
export function applyStatus(
  clock: Clock,
  lead: Lead,
  to: LeadStatus,
  transitions: Readonly<Record<LeadStatus, readonly LeadStatus[]>> = DEFAULT_TRANSITIONS
): { lead: Lead; events: DomainEvent[] } {
  const from: LeadStatus = lead.status;

  // Si no cambia, no hay evento
  if (to === from) return { lead, events: [] };

  ensureTransition(from, to, transitions);

  const updated: Lead = { ...lead, status: to };
  const events: DomainEvent[] = [{
    type: "LeadStatusChanged",
    payload: { id: lead.id, from, to, at: clock.now() },
  }];

  return { lead: updated, events };
}
