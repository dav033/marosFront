import type { LeadId, Project, ProjectDraft, ProjectId, ProjectPatch, ProjectRepositoryPort, ProjectStatus } from "@/project";
import type { HttpClientLike } from "@/shared";
import { makeResource,optimizedApiClient } from "@/shared";

import { projectEndpoints } from "./endpoints";

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
  findByStatus(_status: ProjectStatus): Promise<Project[]> {
    throw new Error("Method not implemented.");
  }
  findWithLeads(): Promise<Project[]> {
    throw new Error("Method not implemented.");
  }
  saveNew(_draft: ProjectDraft): Promise<Project> {
    throw new Error("Method not implemented.");
  }
  findByName(_projectName: string): Promise<Project | null> {
    throw new Error("Method not implemented.");
  }
  leadExists(_leadId: LeadId): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

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
