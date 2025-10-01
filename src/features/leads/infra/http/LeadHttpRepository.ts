// src/features/leads/infra/http/LeadHttpRepository.ts

import type { Lead } from "@/features/leads/domain/models/Lead";
import type { LeadRepositoryPort } from "@/features/leads/domain/ports/LeadRepositoryPort";

// Mappers y tipos de dominio/API
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

import type { LeadType } from "@/features/leads/enums";
import type { LeadDraft, LeadId, LeadPatch } from "@/features/leads/types";

// Infra HTTP
import type { HttpClientLike } from "@/shared/infra/http/types";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";

// Factory genérica
import {
  makeResource,
  type Resource,
} from "@/shared/infra/rest/makeResource";

import { endpoints, BASE } from "./endpoints";

// Opciones adicionales del repositorio
type LeadHttpRepositoryOptions = Readonly<{
  /** Si es true, agrega ?skipClickUpSync=true en creación (paridad con el repo previo). */
  skipClickUpSync?: boolean;
}>;

export class LeadHttpRepository implements LeadRepositoryPort {
  private readonly skipClickUpSync: boolean;

  // Recurso genérico para CRUD estándar
  private readonly resource: Resource<
    LeadId,
    Lead,
    CreateLeadPayload,
    UpdateLeadPayload
  >;

  constructor(
    private readonly api: HttpClientLike = optimizedApiClient,
    options?: LeadHttpRepositoryOptions
  ) {
    this.skipClickUpSync = !!options?.skipClickUpSync;

    this.resource = makeResource<ApiLeadDTO, Lead, CreateLeadPayload, UpdateLeadPayload, LeadId>(
      {
        base: BASE,
        getById: endpoints.getById,
        list: endpoints.list,
        create: endpoints.create, // no lo usamos en Leads (2 variantes), pero queda definido
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

  // ──────────────────────────────────────────────────────────────────────────────
  // Lecturas
  // ──────────────────────────────────────────────────────────────────────────────

  async findById(id: LeadId): Promise<Lead | null> {
    return this.resource.findById(id);
  }

  async findByType(type: LeadType): Promise<Lead[]> {
    const { data } = await this.api.get<ApiLeadDTO[]>(
      endpoints.listByType(String(type))
    );
    return mapLeadsFromDTO(data ?? []);
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Creación (dos variantes → endpoint específico)
  // ──────────────────────────────────────────────────────────────────────────────
  async saveNew(draft: LeadDraft): Promise<Lead> {
    const payload = mapLeadDraftToCreatePayload(draft);
    const maybeSkip = this.skipClickUpSync ? "?skipClickUpSync=true" : "";

    // Si el payload incluye "contact", es el flujo de "nuevo contacto"
    if ("contact" in payload) {
      const { data } = await this.api.post<ApiLeadDTO>(
        `${endpoints.createWithNewContact()}${maybeSkip}`,
        payload
      );
      if (!data) {
        throw new Error("Empty response creating Lead with new contact");
      }
      return mapLeadFromDTO(data);
    }

    // Si no, es el flujo de "contacto existente"
    const { data } = await this.api.post<ApiLeadDTO>(
      `${endpoints.createWithExistingContact()}${maybeSkip}`,
      payload
    );
    if (!data) {
      throw new Error("Empty response creating Lead with existing contact");
    }
    return mapLeadFromDTO(data);
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Actualización y borrado (delegados en makeResource)
  // ──────────────────────────────────────────────────────────────────────────────
  async update(id: LeadId, patch: LeadPatch): Promise<Lead> {
    const dto = mapLeadPatchToUpdatePayload(patch);
    return this.resource.update(id, dto);
  }

  async delete(id: LeadId): Promise<void> {
    return this.resource.delete(id);
  }
}
