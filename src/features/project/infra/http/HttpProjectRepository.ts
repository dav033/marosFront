// src/features/project/infra/http/HttpProjectRepository.ts
import type { Project } from "@/features/project/domain/models/Project";
import type { ProjectRepositoryPort } from "@/features/project/domain/ports/ProjectRepositoryPort";
import type { ProjectId, ProjectDraft, ProjectPatch, LeadId } from "@/features/project/types";

import type { HttpClientLike } from "@/shared/infra/http/types";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";
import { makeResource } from "@/shared/infra/rest/makeResource";
import { projectEndpoints } from "./endpoints";
import type { ProjectStatus } from "../../enums";

export class HttpProjectRepository implements ProjectRepositoryPort {
  private readonly api: HttpClientLike;
  private readonly resource: ReturnType<
    typeof makeResource<Project, Project, ProjectDraft, ProjectPatch, ProjectId>
  >;

  constructor(http: HttpClientLike = optimizedApiClient) {
    this.api = http;
    this.resource = makeResource<Project, Project, ProjectDraft, ProjectPatch, ProjectId>(
      {
        base: projectEndpoints.base,
        ...(projectEndpoints.list ? { list: projectEndpoints.list } : {}),
        create: projectEndpoints.create,
        getById: projectEndpoints.getById,
        update: projectEndpoints.update,
        remove: projectEndpoints.remove,
      },
      { fromApi: (dto) => dto },
      this.api
    );
  }
  findByStatus(status: ProjectStatus): Promise<Project[]> {
    throw new Error("Method not implemented.");
  }
  findWithLeads(): Promise<Project[]> {
    throw new Error("Method not implemented.");
  }
  saveNew(draft: ProjectDraft): Promise<Project> {
    throw new Error("Method not implemented.");
  }
  findByName(projectName: string): Promise<Project | null> {
    throw new Error("Method not implemented.");
  }
  leadExists(leadId: LeadId): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  // CRUD
  create(payload: ProjectDraft): Promise<Project> {
    return this.resource.create(payload);
  }
  update(id: ProjectId, patch: ProjectPatch): Promise<Project> {
    return this.resource.update(id, patch);
  }
  delete(id: ProjectId): Promise<void> {
    return this.resource.delete(id);
  }
  findById(id: ProjectId): Promise<Project | null> {
    return this.resource.findById(id);
  }
  findAll(): Promise<Project[]> {
    return this.resource.findAll();
  }

  // Extras (rutas reales de tu endpoints.ts)
  async listByStatus(status: string): Promise<Project[]> {
    const { data } = await this.api.get<Project[]>(projectEndpoints.listByStatus(status));
    return Array.isArray(data) ? data : [];
  }

  async withLeads(): Promise<Array<Project & { leads: unknown[] }>> {
    const { data } = await this.api.get<Array<Project & { leads: unknown[] }>>(projectEndpoints.withLeads());
    return Array.isArray(data) ? data : [];
  }

  async count(): Promise<number> {
    const { data } = await this.api.get<{ total: number }>(projectEndpoints.count());
    return data?.total ?? 0;
  }
}
