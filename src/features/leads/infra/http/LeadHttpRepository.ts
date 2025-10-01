// src/features/leads/infra/http/LeadHttpRepository.ts
import type { Lead } from "@/features/leads/domain/models/Lead";
import type { LeadRepositoryPort } from "@/features/leads/domain/ports/LeadRepositoryPort";
import type { LeadType } from "@/features/leads/enums";

// DTOs / mappers de dominio (existentes en tu código)
import {
  type ApiLeadDTO,
  mapLeadFromDTO,
  mapLeadsFromDTO,
} from "@/features/leads/domain/services/leadReadMapper";
import {
  mapLeadPatchToUpdatePayload,
  type UpdateLeadPayload,
} from "@/features/leads/domain/services/leadUpdateMapper";
import {
  mapLeadDraftToCreatePayload,
  type CreateLeadPayload,
} from "@/features/leads/domain/services/leadCreateMapper";

import type { LeadDraft, LeadId, LeadPatch } from "@/features/leads/types";

import type { HttpClientLike } from "@/shared/infra/http/types";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";
import { makeResource, type Resource } from "@/shared/infra/rest/makeResource";
import { endpoints, BASE } from "./endpoints";

type LeadHttpRepositoryOptions = Readonly<{ skipClickUpSync?: boolean }>;

export class LeadHttpRepository implements LeadRepositoryPort {
  private readonly skipClickUpSync: boolean;

  private readonly resource: Resource<LeadId, Lead, CreateLeadPayload, UpdateLeadPayload>;

  constructor(
    private readonly api: HttpClientLike = optimizedApiClient,
    options?: LeadHttpRepositoryOptions
  ) {
    this.skipClickUpSync = !!options?.skipClickUpSync;

    this.resource = makeResource<ApiLeadDTO, Lead, CreateLeadPayload, UpdateLeadPayload, LeadId>(
      {
        base: BASE,
        getById: endpoints.getById,
        ...(endpoints.list ? { list: endpoints.list } : {}),
        create: endpoints.create, // definido por contrato del Resource; en Leads usamos las 2 variantes específicas abajo
        update: endpoints.update,
        remove: endpoints.remove,
      },
      {
        fromApi: mapLeadFromDTO,
        fromApiList: mapLeadsFromDTO,
      },
      this.api
    );
  }

  // ── Lecturas ─────────────────────────────────────────────────────────────────
  async findById(id: LeadId): Promise<Lead | null> {
    return this.resource.findById(id);
  }

  async findByType(type: LeadType): Promise<Lead[]> {
    const { data } = await this.api.get<ApiLeadDTO[]>(endpoints.listByType(String(type)));
    return mapLeadsFromDTO(data ?? []);
  }

  // ── Creación (dos flujos) ────────────────────────────────────────────────────
  async saveNew(draft: LeadDraft): Promise<Lead> {
    const payload = mapLeadDraftToCreatePayload(draft);
    const maybeSkip = this.skipClickUpSync ? "?skipClickUpSync=true" : "";

    if ("contact" in payload) {
      const { data } = await this.api.post<ApiLeadDTO>(`${endpoints.createWithNewContact()}${maybeSkip}`, payload);
      if (!data) throw new Error("Empty response creating Lead with new contact");
      return mapLeadFromDTO(data);
    }

    const { data } = await this.api.post<ApiLeadDTO>(`${endpoints.createWithExistingContact()}${maybeSkip}`, payload);
    if (!data) throw new Error("Empty response creating Lead with existing contact");
    return mapLeadFromDTO(data);
  }

  // ── Actualización / borrado ─────────────────────────────────────────────────
  async update(id: LeadId, patch: LeadPatch): Promise<Lead> {
    const dto = mapLeadPatchToUpdatePayload(patch);
    return this.resource.update(id, dto);
  }

  async delete(id: LeadId): Promise<void> {
    return this.resource.delete(id);
  }
}
