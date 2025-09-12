import type { Contacts } from "src/types";

export type ContactEvent =
  | { type: "CONTACT_CREATED"; payload: Contacts }
  | { type: "CONTACT_UPDATED"; payload: Contacts }
  | { type: "CONTACT_DELETED"; payload: { id: number } }
  | { type: "REFETCH_REQUESTED" };

export type ContactEventListener = (event: ContactEvent) => void;

export class ContactEventBus {
  private listeners = new Set<ContactEventListener>();
  on(l: ContactEventListener) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }
  emit(e: ContactEvent) {
    this.listeners.forEach((l) => l(e));
  }
}
