import type { Project } from "@/features/project/domain/models/Project";
import type { ProjectRepositoryPort } from "@/features/project/domain/ports/ProjectRepositoryPort";
import type { ProjectStatus } from "@/features/project/enums";
import type {
  LeadId,
  ProjectDraft,
  ProjectId,
  ProjectPatch,
  ProjectWithLeadView,
} from "@/features/project/types";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";

import { PROJECTS_API } from "./endpoints";

export class HttpProjectRepository implements ProjectRepositoryPort {
  constructor(private readonly http = optimizedApiClient) {}

  async findAll(): Promise<Project[]> {
    const { data } = await this.http.get<Project[]>(PROJECTS_API.base);
    return data;
  }

  async findById(id: ProjectId): Promise<Project | null> {
    try {
      const { data } = await this.http.get<Project>(PROJECTS_API.byId(id));
      return data;
    } catch (e: unknown) {
      const maybe = e as { response?: { status?: number } } | undefined;
      if (maybe?.response?.status === 404) return null;
      throw e;
    }
  }

  async findByName(projectName: string): Promise<Project | null> {
    const all = await this.findAll();
    return all.find((p) => p.projectName === projectName) ?? null;
  }

  async findByStatus(status: ProjectStatus): Promise<Project[]> {
    const { data } = await this.http.get<Project[]>(
      PROJECTS_API.byStatus(status)
    );
    return data;
  }

  async findWithLeads(): Promise<Project[]> {
    const { data } = await this.http.get<Project[]>(PROJECTS_API.withLeads);
    return data;
  }

  async saveNew(draft: ProjectDraft): Promise<Project> {
    const { data } = await this.http.post<Project>(PROJECTS_API.base, draft);
    return data;
  }

  async update(id: ProjectId, patch: ProjectPatch): Promise<Project> {
    const { data } = await this.http.put<Project>(PROJECTS_API.byId(id), patch);
    return data;
  }

  async delete(id: ProjectId): Promise<void> {
    await this.http.delete(PROJECTS_API.byId(id));
  }

  async count(): Promise<number> {
    const { data } = await this.http.get<{ count: number }>(PROJECTS_API.count);
    return data.count;
  }

  async leadExists(leadId: LeadId): Promise<boolean> {
    try {
      const r = await this.http.get(`/api/leads/${leadId}`); 
      return r.status === 200;
    } catch (e: unknown) {
      const maybe = e as { response?: { status?: number } } | undefined;
      if (maybe?.response?.status === 404) return false;
      throw e;
    }
  }

  async getWithLeads(): Promise<ProjectWithLeadView[]> {
    const { data } = await optimizedApiClient.get("/api/projects/with-leads");
    return (Array.isArray(data) ? data : []).map((it: unknown) => {
      const asObj = it as Record<string, unknown>;
      return {
        ...(asObj as Record<string, unknown>),
  startDate: (asObj["startDate"] ?? null) as string | null,
  endDate: (asObj["endDate"] ?? null) as string | null,
      } as ProjectWithLeadView;
    });
  }
}
