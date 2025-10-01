import type { Lead } from "@/features/leads/domain/models/Lead";
import type { LeadRepositoryPort } from "@/features/leads/domain/ports/LeadRepositoryPort";
import type { LeadType } from "@/features/leads/enums";

import {
  type ApiLeadDTO,
  mapLeadFromDTO,
  mapLeadsFromDTO,
} from "@/features/leads/domain/services/leadReadMapper";

import {
  type UpdateLeadPayload,
  mapLeadPatchToUpdatePayload,
} from "@/features/leads/domain/services/leadUpdateMapper";

import {
  type CreateLeadPayload,
  mapLeadDraftToCreatePayload,
} from "@/features/leads/domain/services/leadCreateMapper";

import type { LeadDraft, LeadId, LeadPatch } from "@/features/leads/types";

import type { HttpClientLike } from "@/shared/infra/http/types";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";
import { makeResource } from "@/shared/infra/rest/makeResource";

import { endpoints as leadEndpoints } from "./endpoints";

/**
 * Implementación del puerto con factory CRUD para las operaciones base,
 * y endpoints específicos para creación por contacto nuevo/existente.
 * Se preserva nombre de clase y firmas del LeadRepositoryPort.
 */
export class LeadHttpRepository implements LeadRepositoryPort {
  private readonly api: HttpClientLike;
  private readonly resource: ReturnType<
    typeof makeResource<ApiLeadDTO, Lead, unknown, UpdateLeadPayload, LeadId>
  >;

  constructor(api: HttpClientLike = optimizedApiClient) {
    this.api = api;

        this.resource = makeResource<ApiLeadDTO, Lead, unknown, UpdateLeadPayload, LeadId>(
      leadEndpoints,
      {
        fromApi: mapLeadFromDTO,
        fromApiList: mapLeadsFromDTO,
      },
      this.api
    );
  }

  findById(id: LeadId): Promise<Lead | null> {
    return this.resource.findById(id);
  }

  async findByType(type: LeadType): Promise<Lead[]> {
    const { data } = await this.api.get<ApiLeadDTO[]>(
      leadEndpoints.listByType(String(type))
    );
    const list = Array.isArray(data) ? data : [];
    return mapLeadsFromDTO(list);
  }

  async saveNew(draft: LeadDraft): Promise<Lead> {
    const payload: CreateLeadPayload = mapLeadDraftToCreatePayload(draft);

        if ("contact" in (payload as Record<string, unknown>)) {
      const { data } = await this.api.post<ApiLeadDTO>(
        leadEndpoints.createWithNewContact(),
        payload
      );
      if (!data) throw new Error("Empty response creating Lead with new contact");
      return mapLeadFromDTO(data);
    }

        const { data } = await this.api.post<ApiLeadDTO>(
      leadEndpoints.createWithExistingContact(),
      payload
    );
    if (!data) throw new Error("Empty response creating Lead with existing contact");
    return mapLeadFromDTO(data);
  }

  async update(id: LeadId, patch: LeadPatch): Promise<Lead> {
    const dto: UpdateLeadPayload = mapLeadPatchToUpdatePayload(patch);
    return this.resource.update(id, dto);
  }

  delete(id: LeadId): Promise<void> {
    return this.resource.delete(id);
  }
}
