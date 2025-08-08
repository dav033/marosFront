import type { Lead } from "src/types/types";
import { OptimizedLeadsService } from "src/services/OptimizedLeadsService";
import { deleteLead } from "src/utils/leadHelpers";
import { LeadEventBus } from "./LeadEvents";

export class LeadAgent {
  private bus: LeadEventBus;

  constructor(bus: LeadEventBus) {
    this.bus = bus;
  }

  async create(input: any): Promise<Lead> {
    // Decide if it's new or existing contact based on input
    let created: Lead;
    if (input.contactId) {
      created = await OptimizedLeadsService.createLeadByExistingContact(input);
    } else {
      created = await OptimizedLeadsService.createLeadByNewContact(input);
    }
    this.bus.emit({ type: "LEAD_CREATED", payload: created });
    this.bus.emit({ type: "REFETCH_REQUESTED" });
    return created;
  }

  async update(input: Lead): Promise<Lead> {
    // Only send updatable fields
    const { id, name, location, status, contact, projectType, startDate } = input;
    const updated = await OptimizedLeadsService.updateLead(id, {
      name,
      location,
      status: status ?? undefined,
      contactId: contact?.id,
      projectTypeId: projectType?.id,
      startDate,
    });
    this.bus.emit({ type: "LEAD_UPDATED", payload: updated });
    this.bus.emit({ type: "REFETCH_REQUESTED" });
    return updated;
  }

  async remove(id: number): Promise<void> {
    await OptimizedLeadsService.deleteLead(id);
    this.bus.emit({ type: "LEAD_DELETED", payload: { id } });
    this.bus.emit({ type: "REFETCH_REQUESTED" });
  }
}
