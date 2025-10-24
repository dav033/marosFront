// src/features/project/infra/http/HttpProjectRepository.ts
import type {
  LeadId,
  Project,
  ProjectDraft,
  ProjectId,
  ProjectPatch,
  ProjectRepositoryPort,
  ProjectStatus,
} from "@/project";
import type { HttpClientLike } from "@/shared";
import { makeResource, optimizedApiClient } from "@/shared";

import { projectEndpoints } from "./endpoints";

export class HttpProjectRepository implements ProjectRepositoryPort {
  private readonly api: HttpClientLike;
  private readonly resource: ReturnType<
    typeof makeResource<Project, Project, ProjectDraft, ProjectPatch, ProjectId>
  >;

  constructor(api: HttpClientLike = optimizedApiClient) {
    this.api = api;

    this.resource = makeResource<Project, Project, ProjectDraft, ProjectPatch, ProjectId>(
      projectEndpoints,
      {
        fromApi: (dto) => dto,
        fromApiList: (list) => list,
      },
      this.api,
      { updatePolicy: "require-body" }
    );
  }

  // CRUD base (alineado al puerto)
  async saveNew(draft: ProjectDraft): Promise<Project> {
    return this.resource.create(draft);
  }

  async update(id: ProjectId, patch: ProjectPatch): Promise<Project> {
    const updated = await this.resource.update(id, patch);
    if (!updated) {
      throw new Error("Expected response body on Project update");
    }
    return updated;
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

  // Consultas específicas
  async findByStatus(status: ProjectStatus): Promise<Project[]> {
    const { data } = await this.api.get<Project[]>(
      projectEndpoints.listByStatus(String(status))
    );
    return Array.isArray(data) ? data : [];
  }

  async findWithLeads(): Promise<Project[]> {
    const { data } = await this.api.get<Project[]>(
      projectEndpoints.withLeads()
    );
    return Array.isArray(data) ? data : [];
  }

  async findByName(projectName: string): Promise<Project | null> {
    // Fallback si el backend no expone endpoint específico
    const all = await this.findAll();
    const needle = projectName.trim().toLowerCase();
    return (
      all.find((p) => (p.projectName ?? "").trim().toLowerCase() === needle) ??
      null
    );
  }

  async leadExists(leadId: LeadId): Promise<boolean> {
    // Fallback: verificación por exploración (si se dispone de endpoint dedicado, reemplazar aquí)
    const all = await this.findAll();
    return all.some(
      (p) => (p as any)?.lead?.id === leadId || (p as any)?.leadId === leadId
    );
  }

  async count(): Promise<number> {
    const { data } = await this.api.get<{ total: number }>(
      projectEndpoints.count()
    );
    return data?.total ?? 0;
  }
}
