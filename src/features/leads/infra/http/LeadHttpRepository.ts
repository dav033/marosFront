
import type { Lead } from "@/features/leads/domain/models/Lead";
import type { LeadRepositoryPort } from "@/features/leads/domain/ports/LeadRepositoryPort";
import {
  type ApiLeadDTO,
  mapLeadFromDTO,
  mapLeadsFromDTO,
} from "@/features/leads/domain/services/leadReadMapper";
import { mapLeadPatchToUpdatePayload } from "@/features/leads/domain/services/leadUpdateMapper";
import type { LeadType } from "@/features/leads/enums";
import type { LeadDraft, LeadId, LeadPatch } from "@/features/leads/types";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";
import type { HttpClientLike } from "@/shared/infra/http/types"; 

import { endpoints } from "./endpoints";

export class LeadHttpRepository implements LeadRepositoryPort {
  constructor(private readonly api: HttpClientLike = optimizedApiClient) {}

  async findById(id: LeadId): Promise<Lead | null> {
    const { data } = await this.api.get<ApiLeadDTO>(endpoints.getById(id), {
      cache: { enabled: true, strategy: "network-first", ttl: 60_000 },
    });
    if (!data) return null;
    return mapLeadFromDTO(data);
  }

  async findByType(type: LeadType): Promise<Lead[]> {
    const { data } = await this.api.get<ApiLeadDTO[]>(
      endpoints.listByType(String(type)),
      { cache: { enabled: true, strategy: "cache-first", ttl: 60_000 } }
    );
    return mapLeadsFromDTO(data ?? []);
  }

  async saveNew(draft: LeadDraft): Promise<Lead> {
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
        contact: null, 
        projectType: {
          id: Number(draft.projectTypeId), 
          name: "",
          color: "",
        },
        leadType: draft.leadType,
      };
      const request = { lead, contact };

      const { data } = await this.api.post<ApiLeadDTO>(
        "/leads/new-contact",
        request,
        {
          prefetch: {
            enabled: true,
            priority: "high",
            dependencies: ["/leads/type"],
          },
        }
      );
      if (!data)
        throw new Error("Empty response creating Lead with new contact");

      return mapLeadFromDTO(data);
    }

    const lead = {
      leadNumber: draft.leadNumber ?? "",
      name: draft.name,
      startDate: new Date().toISOString().split("T")[0], 
      location: draft.location,
      status: null,
      contact: null, 
      projectType: {
        id: Number(draft.projectTypeId), 
        name: "",
        color: "",
      },
      leadType: draft.leadType,
    };
    const request = {
      lead,
      contactId: Number(draft.contactId), 
    };

    const { data } = await this.api.post<ApiLeadDTO>(
      "/leads/existing-contact",
      request,
      {
        prefetch: {
          enabled: true,
          priority: "high",
          dependencies: ["/leads/type"],
        },
      }
    );
    if (!data)
      throw new Error("Empty response creating Lead with existing contact");

    return mapLeadFromDTO(data);
  }

  async update(id: LeadId, patch: LeadPatch): Promise<Lead> {
    const dto = mapLeadPatchToUpdatePayload(patch);
    const { data } = await this.api.put<ApiLeadDTO>(endpoints.update(id), dto);

    if (!data) {
      const reloaded = await this.findById(id);
      if (!reloaded) throw new Error("Lead not found after update");
      return reloaded;
    }
    return mapLeadFromDTO(data);
  }

  async delete(id: LeadId): Promise<void> {
    await this.api.delete<void>(endpoints.remove(id));
  }
}
