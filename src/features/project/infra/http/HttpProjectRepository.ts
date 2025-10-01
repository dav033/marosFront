// src/features/project/infra/http/HttpProjectRepository.ts
import type { Project } from "@/features/project/domain/models/Project";
import type { ProjectRepositoryPort } from "@/features/project/domain/ports/ProjectRepositoryPort";
import type { ProjectStatus } from "@/features/project/enums";
import type {
  LeadId,
  ProjectDraft,
  ProjectId,
  ProjectPatch,
} from "@/features/project/types";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";
import type { HttpClientLike } from "@/shared/infra/http/types";
import {
  makeResource,
  type ResourceEndpoints,
} from "@/shared/infra/rest/makeResource";

import { PROJECTS_API } from "./endpoints";

const endpoints: ResourceEndpoints<ProjectId> = {
  base: PROJECTS_API.base,
  getById: (id) => PROJECTS_API.byId(id),
  list: () => PROJECTS_API.base,
  create: () => PROJECTS_API.base,
  update: (id) => PROJECTS_API.byId(id),
  remove: (id) => PROJECTS_API.byId(id),
};

export class HttpProjectRepository implements ProjectRepositoryPort {
  private readonly api: HttpClientLike;
  private readonly resource: ReturnType<
    typeof makeResource<Project, Project, ProjectDraft, ProjectPatch, ProjectId>
  >;

  constructor(http: HttpClientLike = optimizedApiClient) {
    this.api = http;
    this.resource = makeResource<Project, Project, ProjectDraft, ProjectPatch, ProjectId>(
      endpoints,
      {
        // El backend ya devuelve Project en la forma de dominio:
        fromApi: (dto) => dto,
      },
      this.api
    );
  }
  findByName(projectName: string): Promise<Project | null> {
    throw new Error("Method not implemented.");
  }

  // CRUD estándar vía toolkit
  findAll(): Promise<Project[]> {
    return this.resource.findAll();
  }

  findById(id: ProjectId): Promise<Project | null> {
    return this.resource.findById(id);
  }

  saveNew(draft: ProjectDraft): Promise<Project> {
    return this.resource.create(draft);
  }

  update(id: ProjectId, patch: ProjectPatch): Promise<Project> {
    return this.resource.update(id, patch);
  }

  delete(id: ProjectId): Promise<void> {
    return this.resource.delete(id);
  }

  // Extensiones específicas del dominio Project
  async findByStatus(status: ProjectStatus): Promise<Project[]> {
    const { data } = await this.api.get<Project[]>(
      PROJECTS_API.byStatus(status)
    );
    return Array.isArray(data) ? data : [];
  }

  async findWithLeads(): Promise<Project[]> {
    const { data } = await this.api.get<Project[]>(PROJECTS_API.withLeads);
    return Array.isArray(data) ? data : [];
  }

  async count(): Promise<number> {
    const { data } = await this.api.get<{ count: number }>(PROJECTS_API.count);
    return Number(data?.count ?? 0);
  }

  async leadExists(leadId: LeadId): Promise<boolean> {
    try {
      const r = await this.api.get(`/api/leads/${leadId}`);
      return r.status === 200;
    } catch (e: unknown) {
      const maybe = e as { response?: { status?: number } } | undefined;
      if (maybe?.response?.status === 404) return false;
      throw e;
    }
  }
}
