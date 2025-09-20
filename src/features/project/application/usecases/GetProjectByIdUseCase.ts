
import type { ProjectRepositoryPort } from "../../domain/ports/ProjectRepositoryPort";
import type { Project } from "../../domain/models/Project";
import type { ProjectId } from "../../types";

export interface GetProjectByIdUseCasePort {
  execute(id: ProjectId): Promise<Project | null>;
}

export class GetProjectByIdUseCase implements GetProjectByIdUseCasePort {
  constructor(private readonly projectRepository: ProjectRepositoryPort) {}

  async execute(id: ProjectId): Promise<Project | null> {
    return await this.projectRepository.findById(id);
  }
}