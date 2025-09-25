import type { Lead } from "@/features/leads/domain/models/Lead";
import type { LeadRepositoryPort } from "@/features/leads/domain/ports/LeadRepositoryPort";
import type { LeadType } from "@/features/leads/enums";
import type { LeadDraft, LeadId } from "@/features/leads/types";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";

/**
 * Adaptador HTTP para creaciones "local-only" (sin sincronizar con ClickUp).
 * - Implementa únicamente saveNew (lo que necesita el modal local).
 * - El resto lanza error explícito para no usarlos accidentalmente.
 */
export class LocalLeadRepository implements LeadRepositoryPort {
  async findById(_id: LeadId): Promise<Lead | null> {
    throw new Error("LocalLeadRepository.findById not implemented");
  }
  async findByType(_type: LeadType): Promise<Lead[]> {
    throw new Error("LocalLeadRepository.findByType not implemented");
  }

  async saveNew(draft: LeadDraft): Promise<Lead> {
    // Branch 1: crear contacto nuevo + lead
    if ("contact" in draft) {
      const contact = {
        companyName: draft.contact.companyName,
        name: draft.contact.name,
        phone: draft.contact.phone ?? "",
        email: draft.contact.email ?? "",
      };
      const lead = {
        leadNumber: draft.leadNumber ?? "",
        name: draft.name,
        startDate: new Date().toISOString().split("T")[0],
        location: draft.location,
        status: null,
        contact,
        projectType: { id: draft.projectTypeId, name: "", color: "" },
        leadType: draft.leadType,
      };
      const request = { lead, contact };
      const response = await optimizedApiClient.post(
        "/leads/new-contact?skipClickUpSync=true",
        request,
        {
          prefetch: {
            enabled: true,
            priority: "high",
            dependencies: ["/leads/type"],
          },
        }
      );
      return response.data as Lead;
    }

    // Branch 2: usar contacto existente + lead
    const lead = {
      leadNumber: draft.leadNumber ?? "",
      name: draft.name,
      startDate: new Date().toISOString().split("T")[0],
      location: draft.location,
      status: null,
      contact: undefined,
      projectType: { id: draft.projectTypeId, name: "", color: "" },
      leadType: draft.leadType,
    };
    const request = { lead, contactId: draft.contactId };
    const response = await optimizedApiClient.post(
      "/leads/existing-contact?skipClickUpSync=true",
      request,
      {
        prefetch: {
          enabled: true,
          priority: "high",
          dependencies: ["/leads/type"],
        },
      }
    );
    return response.data as Lead;
  }

  async update(_id: LeadId): Promise<Lead> {
    throw new Error("LocalLeadRepository.update not implemented");
  }
  async delete(_id: LeadId): Promise<void> {
    throw new Error("LocalLeadRepository.delete not implemented");
  }
}
