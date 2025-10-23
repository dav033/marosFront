import type { ProjectType } from "@/leads";

export interface ProjectTypeRepositoryPort {
  findAll(): Promise<ProjectType[]>;
}
