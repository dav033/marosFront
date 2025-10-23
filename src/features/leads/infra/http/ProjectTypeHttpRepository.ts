import type { ProjectType } from "@/leads";
import type { ProjectTypeRepositoryPort } from "@/leads";
import { optimizedApiClient } from "@/shared";

export class ProjectTypeHttpRepository implements ProjectTypeRepositoryPort {
  async findAll(): Promise<ProjectType[]> {
    const res = await optimizedApiClient.get<ProjectType[]>("/project-types/all");
    const data = Array.isArray(res.data) ? res.data : [];
    return data;
  }
}
