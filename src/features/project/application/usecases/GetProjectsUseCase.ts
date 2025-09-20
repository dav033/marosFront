
import type { ProjectRepositoryPort } from "../../domain/ports/ProjectRepositoryPort";
import type { Project } from "../../domain/models/Project";

export interface GetProjectsUseCasePort {
  execute(): Promise<Project[]>;
}

export class GetProjectsUseCase implements GetProjectsUseCasePort {
  constructor(private readonly projectRepository: ProjectRepositoryPort) {}

  async execute(): Promise<Project[]> {
    return await this.projectRepository.findAll();
  }
}