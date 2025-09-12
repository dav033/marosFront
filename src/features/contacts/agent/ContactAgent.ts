import { OptimizedContactsService } from "src/services/OptimizedContactsService";
import { ContactEventBus } from "./ContactEvents";
import type { Contacts, CreateContactRequest } from "@/types";

export class ContactAgent {
  private bus: ContactEventBus;

  constructor(bus: ContactEventBus) {
    this.bus = bus;
  }

  async create(input: CreateContactRequest): Promise<Contacts> {
    const created = await OptimizedContactsService.createContact(input);
    this.bus.emit({ type: "CONTACT_CREATED", payload: created });
    this.bus.emit({ type: "REFETCH_REQUESTED" });
    return created;
  }

  async update(input: Contacts): Promise<Contacts> {
    // Only send updatable fields
    const { id, name, phone, email, company } = input;
    const updated = await OptimizedContactsService.updateContact(id, {
      name,
      phone,
      email,
      company,
    });
    this.bus.emit({ type: "CONTACT_UPDATED", payload: updated });
    return updated;
  }

  async remove(id: number): Promise<void> {
    if (id == null || id === undefined) {
      console.error("Invalid id received in ContactAgent.remove:", id);
      throw new Error("Invalid contact ID for deletion");
    }
    await OptimizedContactsService.deleteContact(id);
    this.bus.emit({ type: "CONTACT_DELETED", payload: { id } });
  }
}
