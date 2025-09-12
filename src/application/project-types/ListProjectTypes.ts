import type { ProjectType } from "../../domain/entities/ProjectType";
import type { ProjectTypeRepositoryPort } from "../../domain/ports/ProjectTypeRepositoryPort";

export async function listProjectTypes(repo: ProjectTypeRepositoryPort): Promise<ProjectType[]> {
  return repo.list();
}