// src/features/project/application/usecases/GetProjectsWithLeadsUseCase.ts

import type { ProjectRepositoryPort } from "../../domain/ports/ProjectRepositoryPort";
import type { Project } from "../../domain/models/Project";

export interface GetProjectsWithLeadsUseCasePort {
  execute(): Promise<Project[]>;
}

export class GetProjectsWithLeadsUseCase implements GetProjectsWithLeadsUseCasePort {
  constructor(private readonly projectRepository: ProjectRepositoryPort) {}

  async execute(): Promise<Project[]> {
    return await this.projectRepository.findWithLeads();
  }
}