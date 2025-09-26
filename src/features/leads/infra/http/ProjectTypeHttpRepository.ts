import type { ProjectType } from "@/features/leads/domain/models/ProjectType";
import type { ProjectTypeRepositoryPort } from "@/features/leads/domain/ports/ProjectTypeRepositoryPort";
import { optimizedApiClient } from "@/shared/infra/http/OptimizedApiClient";

export class ProjectTypeHttpRepository implements ProjectTypeRepositoryPort {
  async findAll(): Promise<ProjectType[]> {
    const res = await optimizedApiClient.get<ProjectType[]>("/project-types/all", {
      cache: { enabled: true, strategy: "cache-first", ttl: 5 * 60 * 1000 },
    });
    const data = Array.isArray(res.data) ? res.data : [];
    return data;
  }
}
