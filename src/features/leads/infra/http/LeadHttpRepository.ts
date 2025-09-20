// src/features/leads/infra/http/LeadHttpRepository.ts

import type { LeadRepositoryPort } from "@/features/leads/domain/ports/LeadRepositoryPort";
import type { Lead } from "@/features/leads/domain/models/Lead";
import type { LeadDraft, LeadId, LeadPatch } from "@/features/leads/types";
import type { LeadType } from "@/features/leads/enums";

import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";
import type { HttpClientLike } from "@/shared/infra/http/types"; // ← usamos la interfaz mínima

import { endpoints } from "./endpoints";

// Mappers de dominio (DTO <-> Domain)
import {
  mapLeadFromDTO,
  mapLeadsFromDTO,
  type ApiLeadDTO,
} from "@/features/leads/domain/services/leadReadMapper";
import { mapLeadDraftToCreatePayload } from "@/features/leads/domain/services/leadCreateMapper";
import { mapLeadPatchToUpdatePayload } from "@/features/leads/domain/services/leadUpdateMapper";

/**
 * Adapter HTTP que implementa el puerto de repositorio de Leads.
 */
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
    console.log('🔍 LeadHttpRepository.saveNew called with:', draft);
    
    // Branch 1: crear contacto nuevo + lead
    if ("contact" in draft) {
      console.log('📝 Creating lead with new contact');
      const contact = {
        companyName: draft.contact.companyName,
        name: draft.contact.name,
        phone: draft.contact.phone ?? "",
        email: draft.contact.email ?? "",
      };
      const lead = {
        leadNumber: draft.leadNumber ?? "",
        name: draft.name,
        startDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD format for LocalDate
        location: draft.location,
        status: null,
        contact: null, // Debe ser null
        projectType: { 
          id: Number(draft.projectTypeId), // Asegurar que es número
          name: "", 
          color: "" 
        },
        leadType: draft.leadType,
      };
      const request = { lead, contact };
      
      console.log('📤 Sending request to /leads/new-contact:', JSON.stringify(request, null, 2));
      
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
      if (!data) throw new Error("Empty response creating Lead with new contact");
      console.log('✅ Lead created with new contact:', data);
      return mapLeadFromDTO(data);
    }

    // Branch 2: usar contacto existente + lead
    console.log('📝 Creating lead with existing contact');
    const lead = {
      leadNumber: draft.leadNumber ?? "",
      name: draft.name,
      startDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD format for LocalDate
      location: draft.location,
      status: null,
      contact: null, // Debe ser null, no undefined
      projectType: { 
        id: Number(draft.projectTypeId), // Asegurar que es número
        name: "", 
        color: "" 
      },
      leadType: draft.leadType,
    };
    const request = { 
      lead, 
      contactId: Number(draft.contactId) // Asegurar que es número
    };
    
    console.log('📤 Sending request to /leads/existing-contact:', JSON.stringify(request, null, 2));
    
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
    if (!data) throw new Error("Empty response creating Lead with existing contact");
    console.log('✅ Lead created with existing contact:', data);
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
