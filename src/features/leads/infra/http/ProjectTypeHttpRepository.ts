import type { ProjectType } from "@/features/leads/domain/models/ProjectType";
import type { ProjectTypeRepositoryPort } from "@/features/leads/domain/ports/ProjectTypeRepositoryPort";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";

export class ProjectTypeHttpRepository implements ProjectTypeRepositoryPort {
  async findAll(): Promise<ProjectType[]> {
    const res = await optimizedApiClient.get<ProjectType[]>("/project-types/all");
    const data = Array.isArray(res.data) ? res.data : [];
    return data;
  }
}
