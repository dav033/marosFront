import type { Lead } from '@/leads';
import type { LeadRepositoryPort } from '@/leads';
import type { LeadType } from '@/leads';
import type { LeadDraft, LeadId, LeadPatch } from '@/leads';
import { type ApiLeadDTO, mapLeadFromDTO, mapLeadsFromDTO } from '@/leads';
import { mapLeadPatchToUpdatePayload, type UpdateLeadPayload } from '@/leads';
import { type CreateLeadPayload, mapLeadDraftToCreatePayload } from '@/leads';
import type { HttpClientLike } from '@/shared';
import { optimizedApiClient } from '@/shared';
import { makeResource } from '@/shared';

import { endpoints as leadEndpoints } from './endpoints';

export class LeadHttpRepository implements LeadRepositoryPort {
  private readonly api: HttpClientLike;
  private readonly resource: ReturnType<
    typeof makeResource<ApiLeadDTO, Lead, unknown, UpdateLeadPayload, LeadId>
  >;

  constructor(api: HttpClientLike = optimizedApiClient) {
    this.api = api;

    this.resource = makeResource<
      ApiLeadDTO,
      Lead,
      unknown,
      UpdateLeadPayload,
      LeadId
    >(
      leadEndpoints,
      {
        fromApi: mapLeadFromDTO,
        fromApiList: mapLeadsFromDTO,
      },
      this.api,
      { updatePolicy: 'require-body' },
    );
  }

  findById(id: LeadId): Promise<Lead | null> {
    return this.resource.findById(id);
  }

  async findByType(type: LeadType): Promise<Lead[]> {
    const { data } = await this.api.get<ApiLeadDTO[]>(
      leadEndpoints.listByType(String(type)),
    );
    const list = Array.isArray(data) ? data : [];
    return mapLeadsFromDTO(list);
  }

  async saveNew(draft: LeadDraft): Promise<Lead> {
    const payload: CreateLeadPayload = mapLeadDraftToCreatePayload(draft);

    if ('contact' in (payload as Record<string, unknown>)) {
      const { data } = await this.api.post<ApiLeadDTO>(
        leadEndpoints.createWithNewContact(),
        payload,
      );
      if (!data)
        throw new Error('Empty response creating Lead with new contact');
      return mapLeadFromDTO(data);
    }

    const { data } = await this.api.post<ApiLeadDTO>(
      leadEndpoints.createWithExistingContact(),
      payload,
    );
    if (!data)
      throw new Error('Empty response creating Lead with existing contact');
    return mapLeadFromDTO(data);
  }

  async update(id: LeadId, patch: LeadPatch): Promise<Lead> {
    const dto: UpdateLeadPayload = mapLeadPatchToUpdatePayload(patch);
    const updated = await this.resource.update(id, dto);
    if (!updated) {
      throw new Error('Expected response body on Lead update');
    }
    return updated;
  }

  delete(id: LeadId): Promise<void> {
    return this.resource.delete(id);
  }
}
