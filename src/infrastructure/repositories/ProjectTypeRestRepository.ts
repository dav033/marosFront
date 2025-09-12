import type { ProjectType } from "../../domain/entities/ProjectType";
import type { ProjectTypeRepositoryPort } from "../../domain/ports/ProjectTypeRepositoryPort";
import type { ProjectTypeDTO } from "../dto/project-types/ProjectTypeDTO";
import { projectTypeFromDTO } from "../mappers/project-types/projectType.mapper";
import type { HttpClient } from "../http/httpClient";

export class ProjectTypeRestRepository implements ProjectTypeRepositoryPort {
  constructor(private readonly http: HttpClient) {}

  async list(): Promise<ProjectType[]> {
    const { data } = await this.http.get<ProjectTypeDTO[]>("/project-types");
    return data.map(projectTypeFromDTO);
  }
}