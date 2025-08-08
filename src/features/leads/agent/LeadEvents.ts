import type { Lead } from "src/types";

export type LeadEvent =
  | { type: "LEAD_CREATED"; payload: Lead }
  | { type: "LEAD_UPDATED"; payload: Lead }
  | { type: "LEAD_DELETED"; payload: { id: number } }
  | { type: "REFETCH_REQUESTED" };

export type LeadEventListener = (event: LeadEvent) => void;

export class LeadEventBus {
  private listeners = new Set<LeadEventListener>();
  on(l: LeadEventListener) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }
  emit(e: LeadEvent) {
    this.listeners.forEach((l) => l(e));
  }
}
