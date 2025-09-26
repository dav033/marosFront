
import { BusinessRuleError } from "@/shared/domain/BusinessRuleError";

import { LeadStatus } from "../../enums";
import type { Clock, DomainEvent } from "../../types";
import type { Lead } from "../models/Lead";

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

export function canTransition(
  from: LeadStatus,
  to: LeadStatus,
  transitions: Readonly<Record<LeadStatus, readonly LeadStatus[]>> = DEFAULT_TRANSITIONS
): boolean {
  return from === to || (transitions[from] ?? []).includes(to);
}

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

export function applyStatus(
  clock: Clock,
  lead: Lead,
  to: LeadStatus,
  transitions: Readonly<Record<LeadStatus, readonly LeadStatus[]>> = DEFAULT_TRANSITIONS
): { lead: Lead; events: DomainEvent[] } {
  const from: LeadStatus = lead.status;
  if (to === from) return { lead, events: [] };

  ensureTransition(from, to, transitions);

  const updated: Lead = { ...lead, status: to };
  const events: DomainEvent[] = [{
    type: "LeadStatusChanged",
    payload: { id: lead.id, from, to, at: clock.now() },
  }];

  return { lead: updated, events };
}
